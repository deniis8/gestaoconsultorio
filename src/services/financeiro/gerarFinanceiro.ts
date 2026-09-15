import { format } from "date-fns";
import { Agenda } from "../../types/agenda/agenda.types";
import { PacientePlano } from "../../types/paciente-plano/paciente-plano.types";
import { agendaService } from "../apis-supabase/agenda/agenda.service";
import { financeiroService } from "../apis-supabase/financeiro/financeiro.service";
import { pacientePlanoService } from "../apis-supabase/paciente-plano/paciente-plano.service";
import { pacientesService } from "../apis-supabase/pacientes/pacientes.service";
import { planosCobrancaService } from "../apis-supabase/planos-cobranca/planos-cobranca.service";

async function nomeDoPaciente(id_paciente?: string): Promise<string> {
    if (!id_paciente) return "Paciente";
    const [paciente] = await pacientesService.buscarPorId(id_paciente);
    return paciente?.nome_completo || "Paciente";
}

async function gerarCobrancaAvulsa(agendamento: Agenda, pacientePlano: PacientePlano): Promise<void> {
    const existentes = await financeiroService.buscarPorIdAgenda(agendamento.id_agenda!);
    if (existentes.length > 0) return;

    const nomePaciente = await nomeDoPaciente(agendamento.id_paciente);
    const dataSessao = String(agendamento.data_agendamento);

    await financeiroService.inserir({
        id_paciente_plano: pacientePlano.id_paciente_plano,
        id_agenda: agendamento.id_agenda,
        descricao: `Sessão avulsa - ${nomePaciente}`,
        origem: "AGENDA_AVULSO",
        valor: pacientePlano.valor_contratado ?? 0,
        referencia_inicio: dataSessao,
        referencia_fim: dataSessao,
        data_cobranca: format(new Date(), "yyyy-MM-dd"),
        data_vencimento: dataSessao,
        status: "Pendente"
    });
}

// Conta por quantidade total de sessões Realizado do contrato, não por sequência cronológica:
// sessões "puladas" (ex: sessão 4 nunca vira Realizado, mas a 5ª sim) ainda contam para fechar o ciclo.
async function gerarCobrancasMensaisPendentes(pacientePlano: PacientePlano): Promise<void> {
    const tamanhoCiclo = pacientePlano.quantidade_contratada_sessoes || 0;
    if (tamanhoCiclo <= 0 || !pacientePlano.id_paciente_plano) return;

    const realizados = await agendaService.listarRealizadosPorPacientePlano(pacientePlano.id_paciente_plano);
    const ciclosCompletos = Math.floor(realizados.length / tamanhoCiclo);
    if (ciclosCompletos === 0) return;

    const cobrancasExistentes = await financeiroService.buscarPorIdPacientePlanoEOrigem(pacientePlano.id_paciente_plano, "AGENDA_MENSAL");
    if (cobrancasExistentes.length >= ciclosCompletos) return;

    const nomePaciente = await nomeDoPaciente(pacientePlano.id_paciente);

    for (let ciclo = cobrancasExistentes.length; ciclo < ciclosCompletos; ciclo++) {
        const sessoesDoCiclo = realizados.slice(ciclo * tamanhoCiclo, ciclo * tamanhoCiclo + tamanhoCiclo);
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

export async function gerarFinanceiroPorSessaoRealizada(agendamento: Agenda): Promise<void> {
    if (!agendamento.id_paciente_plano || !agendamento.id_agenda) return;

    const [pacientePlano] = await pacientePlanoService.buscarPorIdPacientePlano(agendamento.id_paciente_plano);
    if (!pacientePlano?.id_plano_cobranca) return;

    const [planoCobranca] = await planosCobrancaService.buscarPorId(pacientePlano.id_plano_cobranca);
    if (!planoCobranca) return;

    if (planoCobranca.forma_cobranca === "SESSAO") {
        await gerarCobrancaAvulsa(agendamento, pacientePlano);
    } else if (planoCobranca.forma_cobranca === "MENSAL") {
        await gerarCobrancasMensaisPendentes(pacientePlano);
    }
    // PACOTE não gera cobrança aqui - ver gerarFinanceiroPorContratacaoPacote
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
