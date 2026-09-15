import { format } from "date-fns";
import { Agenda } from "../../types/agenda/agenda.types";
import { PacientePlano } from "../../types/paciente-plano/paciente-plano.types";
import { agendaService } from "../apis-supabase/agenda/agenda.service";
import { financeiroService } from "../apis-supabase/financeiro/financeiro.service";
import { pacientePlanoService } from "../apis-supabase/paciente-plano/paciente-plano.service";
import { pacientesService } from "../apis-supabase/pacientes/pacientes.service";
import { planosCobrancaService } from "../apis-supabase/planos-cobranca/planos-cobranca.service";
import { formatarMoeda } from "../../utils/financeiroFormat";

export type AvaliacaoCobranca = {
    mensagemConfirmacao: string;
    confirmarEGerar: () => Promise<void>;
};

async function nomeDoPaciente(id_paciente?: string): Promise<string> {
    if (!id_paciente) return "Paciente";
    const [paciente] = await pacientesService.buscarPorId(id_paciente);
    return paciente?.nome_completo || "Paciente";
}

async function inserirCobrancaAvulsa(agendamento: Agenda, pacientePlano: PacientePlano, nomePaciente: string, valor: number): Promise<void> {
    const dataSessao = String(agendamento.data_agendamento);

    await financeiroService.inserir({
        id_paciente_plano: pacientePlano.id_paciente_plano,
        id_agenda: agendamento.id_agenda,
        descricao: `Sessão avulsa - ${nomePaciente}`,
        origem: "AGENDA_AVULSO",
        valor,
        referencia_inicio: dataSessao,
        referencia_fim: dataSessao,
        data_cobranca: format(new Date(), "yyyy-MM-dd"),
        data_vencimento: dataSessao,
        status: "Pendente"
    });
}

// Conta por quantidade total de sessões Realizado do contrato, não por sequência cronológica:
// sessões "puladas" (ex: sessão 4 nunca vira Realizado, mas a 5ª sim) ainda contam para fechar o ciclo.
async function inserirCobrancasMensais(
    pacientePlano: PacientePlano,
    realizadosOrdenados: Agenda[],
    tamanhoCiclo: number,
    ciclosJaExistentes: number,
    ciclosCompletos: number,
    nomePaciente: string
): Promise<void> {
    for (let ciclo = ciclosJaExistentes; ciclo < ciclosCompletos; ciclo++) {
        const sessoesDoCiclo = realizadosOrdenados.slice(ciclo * tamanhoCiclo, ciclo * tamanhoCiclo + tamanhoCiclo);
        const dataInicio = String(sessoesDoCiclo[0].data_agendamento);
        const dataFim = String(sessoesDoCiclo[sessoesDoCiclo.length - 1].data_agendamento);

        await financeiroService.inserir({
            id_paciente_plano: pacientePlano.id_paciente_plano,
            descricao: `Mensalidade (${tamanhoCiclo} sessões) - ${nomePaciente}`,
            origem: "AGENDA_MENSAL",
            valor: pacientePlano.valor_contratado ?? 0,
            referencia_inicio: dataInicio,
            referencia_fim: dataFim,
            data_cobranca: format(new Date(), "yyyy-MM-dd"),
            data_vencimento: dataFim,
            status: "Pendente"
        });
    }
}

/**
 * Avalia se marcar este agendamento como Realizado vai gerar uma cobrança (Avulso ou Mensal),
 * sem gerar nada ainda. Retorna uma mensagem para confirmação com o usuário e uma função
 * que efetivamente cria o(s) lançamento(s) caso ele confirme. Retorna null se nada será gerado
 * (ex: plano Pacote, sem plano ativo, ciclo Mensal ainda incompleto, ou cobrança já existente).
 */
export async function avaliarCobrancaPorSessaoRealizada(agendamento: Agenda): Promise<AvaliacaoCobranca | null> {
    if (!agendamento.id_paciente_plano || !agendamento.id_agenda) return null;

    const [pacientePlano] = await pacientePlanoService.buscarPorIdPacientePlano(agendamento.id_paciente_plano);
    if (!pacientePlano?.id_plano_cobranca) return null;

    const [planoCobranca] = await planosCobrancaService.buscarPorId(pacientePlano.id_plano_cobranca);
    if (!planoCobranca) return null;

    if (planoCobranca.forma_cobranca === "SESSAO") {
        const existentes = await financeiroService.buscarPorIdAgenda(agendamento.id_agenda);
        if (existentes.length > 0) return null;

        const nomePaciente = await nomeDoPaciente(agendamento.id_paciente);
        const valor = pacientePlano.valor_contratado ?? 0;

        return {
            mensagemConfirmacao: `Esta sessão vai gerar uma cobrança de ${formatarMoeda(valor)} para ${nomePaciente}. Confirmar?`,
            confirmarEGerar: () => inserirCobrancaAvulsa(agendamento, pacientePlano, nomePaciente, valor)
        };
    }

    if (planoCobranca.forma_cobranca === "MENSAL") {
        const idPacientePlano = pacientePlano.id_paciente_plano;
        const tamanhoCiclo = pacientePlano.quantidade_contratada_sessoes || 0;
        if (tamanhoCiclo <= 0 || !idPacientePlano) return null;

        const realizadosAtuais = await agendaService.listarRealizadosPorPacientePlano(idPacientePlano);
        const jaContabilizada = realizadosAtuais.some((r) => r.id_agenda === agendamento.id_agenda);
        const realizados = jaContabilizada ? realizadosAtuais : [...realizadosAtuais, agendamento];
        realizados.sort((a, b) => String(a.data_agendamento).localeCompare(String(b.data_agendamento)));

        const ciclosCompletos = Math.floor(realizados.length / tamanhoCiclo);
        if (ciclosCompletos === 0) return null;

        const cobrancasExistentes = await financeiroService.buscarPorIdPacientePlanoEOrigem(idPacientePlano, "AGENDA_MENSAL");
        const novosCiclos = ciclosCompletos - cobrancasExistentes.length;
        if (novosCiclos <= 0) return null;

        const nomePaciente = await nomeDoPaciente(pacientePlano.id_paciente);
        const valorTotal = (pacientePlano.valor_contratado ?? 0) * novosCiclos;

        const mensagem = novosCiclos === 1
            ? `Esta sessão completa o ciclo mensal e vai gerar uma cobrança de ${formatarMoeda(valorTotal)} para ${nomePaciente}. Confirmar?`
            : `Esta sessão completa ${novosCiclos} ciclos mensais e vai gerar ${novosCiclos} cobranças, totalizando ${formatarMoeda(valorTotal)}, para ${nomePaciente}. Confirmar?`;

        return {
            mensagemConfirmacao: mensagem,
            confirmarEGerar: () => inserirCobrancasMensais(
                pacientePlano, realizados, tamanhoCiclo, cobrancasExistentes.length, ciclosCompletos, nomePaciente
            )
        };
    }

    return null;
}

export async function gerarFinanceiroPorContratacaoPacote(pacientePlano: PacientePlano): Promise<void> {
    if (!pacientePlano.id_plano_cobranca) return;

    const [planoCobranca] = await planosCobrancaService.buscarPorId(pacientePlano.id_plano_cobranca);
    if (planoCobranca?.forma_cobranca !== "PACOTE") return;

    const nomePaciente = await nomeDoPaciente(pacientePlano.id_paciente);
    const dataInicio = pacientePlano.data_inicio ? String(pacientePlano.data_inicio) : format(new Date(), "yyyy-MM-dd");

    await financeiroService.inserir({
        id_paciente_plano: pacientePlano.id_paciente_plano,
        descricao: `Pacote contratado - ${nomePaciente}`,
        origem: "PACOTE",
        valor: pacientePlano.valor_contratado ?? 0,
        referencia_inicio: dataInicio,
        referencia_fim: pacientePlano.data_fim ? String(pacientePlano.data_fim) : undefined,
        data_cobranca: format(new Date(), "yyyy-MM-dd"),
        data_vencimento: dataInicio,
        status: "Pendente"
    });
}
