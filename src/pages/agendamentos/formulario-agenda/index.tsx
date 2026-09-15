import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addDays, addMonths, differenceInMinutes, format, isAfter } from "date-fns";
import { Button } from "../../../components/ui/button";
import { Header } from "../../../components/layout/header";
import { Loading } from "../../../components/layout/loading";
import { confirmar, confirmarComOpcoes } from "../../../components/layout/mensagem";
import styles from "./formulario-agenda.module.css";
import { Combobox } from "../../../components/ui/combobox";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { agendaService } from "../../../services/apis-supabase/agenda/agenda.service";
import { gerarFinanceiroPorSessaoRealizada } from "../../../services/financeiro/gerarFinanceiro";
import { Agenda } from "../../../types/agenda/agenda.types";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import { TextArea } from "../../../components/ui/textArea";

export type SlotSelecionado = { start: Date; end: Date };

type FormularioAgendaProps = {
    idAgenda?: string;
    slotSelecionado?: SlotSelecionado;
    onClose: () => void;
    onSalvo: () => void;
};

const tiposConsulta = [
    { label: "Consulta Individual", value: "Consulta Individual" },
    { label: "Primeira Consulta", value: "Primeira Consulta" },
    { label: "Retorno", value: "Retorno" },
    { label: "Avaliação", value: "Avaliação" },
];

const statuses = [
    { label: "Agendado", value: "Agendado" },
    { label: "Confirmado", value: "Confirmado" },
    { label: "Realizado", value: "Realizado" },
    { label: "Cancelado", value: "Cancelado" },
    { label: "Falta", value: "Falta" },
];

const frequencias = [
    { label: "Sem recorrência", value: "Sem recorrência" },
    { label: "Semanal", value: "Semanal" },
    { label: "Quinzenal", value: "Quinzenal" },
    { label: "Mensal", value: "Mensal" },
];

const LIMITE_MAX_OCORRENCIAS = 104;

function montarDataHora(dataYYYYMMDD: string, horaHHmm: string): Date {
    const [ano, mes, dia] = dataYYYYMMDD.split("-").map(Number);
    const [hora, minuto] = horaHHmm.split(":").map(Number);
    return new Date(ano, mes - 1, dia, hora, minuto, 0, 0);
}

function calcularHoraFim(inicio: Date, duracaoMin: number): Date {
    return new Date(inicio.getTime() + duracaoMin * 60_000);
}

function mensagemErroExclusao(error: unknown): string {
    const mensagem = error instanceof Error ? error.message : String(error);
    if (mensagem.includes("23503")) {
        return "Não é possível excluir: já existe um lançamento financeiro vinculado a esta consulta.";
    }
    return "Não foi possível excluir a consulta.";
}

function gerarDatasRecorrencia(
    dataInicial: Date,
    frequencia: "Semanal" | "Quinzenal" | "Mensal",
    dataFim: Date
): Date[] {
    const datas: Date[] = [dataInicial];

    for (let n = 1; n < LIMITE_MAX_OCORRENCIAS; n++) {
        const proxima =
            frequencia === "Semanal" ? addDays(dataInicial, 7 * n) :
            frequencia === "Quinzenal" ? addDays(dataInicial, 14 * n) :
            addMonths(dataInicial, n);

        if (isAfter(proxima, dataFim)) break;
        datas.push(proxima);
    }

    return datas;
}

export function FormularioAgenda({ idAgenda, slotSelecionado, onClose, onSalvo }: FormularioAgendaProps) {

    const isEdicao = Boolean(idAgenda);

    const [carregando, setCarregando] = useState(isEdicao);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    const [pacientes, setPacientes] = useState<{ label: string; value: string }[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");
    const [idPacientePlano, setIdPacientePlano] = useState("");
    const [idGrupoRecorrencia, setIdGrupoRecorrencia] = useState<string | undefined>(undefined);

    const [dataConsulta, setDataConsulta] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [duracaoMinutos, setDuracaoMinutos] = useState("60");

    const [tipoConsultaSelecionado, setTipoConsultaSelecionado] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("Agendado");
    const [statusOriginal, setStatusOriginal] = useState<string | undefined>(undefined);
    const [frequenciaSelecionada, setFrequenciaSelecionada] = useState("Sem recorrência");
    const [dataFimRecorrencia, setDataFimRecorrencia] = useState("");
    const [observacoes, setObservacoes] = useState("");

    useEffect(() => {
        async function fetchPacientes() {
            try {
                const pacientes = await pacientesService.listar();
                setPacientes(
                    pacientes.map((paciente) => ({
                        label: paciente.nome_completo || "Paciente sem nome",
                        value: paciente.id_paciente ?? ""
                    }))
                );
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            }
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        fetchPacientes();

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        if (!isEdicao || !idAgenda) return;

        async function carregarAgendamento() {
            try {
                setCarregando(true);
                const [registro] = await agendaService.buscarPorId(idAgenda!);

                if (!registro) {
                    toast.error("Consulta não encontrada.");
                    onClose();
                    return;
                }

                const inicio = new Date(registro.hora_inicio as string);
                const fim = new Date(registro.hora_fim as string);

                setPacienteSelecionado(registro.id_paciente);
                setIdPacientePlano(registro.id_paciente_plano);
                setIdGrupoRecorrencia(registro.id_grupo_recorrencia);
                setDataConsulta(format(inicio, "yyyy-MM-dd"));
                setHoraInicio(format(inicio, "HH:mm"));
                setDuracaoMinutos(String(Math.max(differenceInMinutes(fim, inicio), 0)));
                setTipoConsultaSelecionado(registro.tipo_consulta ?? "");
                setStatusSelecionado(registro.status_sessao ?? "Agendado");
                setStatusOriginal(registro.status_sessao ?? "Agendado");
                setObservacoes(registro.observacoes ?? "");
            } catch (error) {
                console.error("Erro ao carregar consulta:", error);
                toast.error("Não foi possível carregar a consulta.");
                onClose();
            } finally {
                setCarregando(false);
            }
        }

        carregarAgendamento();
    }, [isEdicao, idAgenda, onClose]);

    useEffect(() => {
        if (isEdicao || !slotSelecionado) return;

        setDataConsulta(format(slotSelecionado.start, "yyyy-MM-dd"));
        setHoraInicio(format(slotSelecionado.start, "HH:mm"));

        const minutos = differenceInMinutes(slotSelecionado.end, slotSelecionado.start);
        if (minutos > 0) setDuracaoMinutos(String(minutos));
    }, [isEdicao, slotSelecionado]);

    useEffect(() => {
        if (isEdicao || !pacienteSelecionado) return;

        async function resolverPlanoAtivo() {
            try {
                const planos = await pacientePlanoService.buscarPorIdPaciente(pacienteSelecionado);

                if (planos.length === 0) {
                    toast.error("Este paciente não possui um plano de cobrança ativo. Cadastre um plano antes de agendar.");
                    setIdPacientePlano("");
                    return;
                }

                if (planos.length > 1) {
                    console.warn("Paciente com múltiplos planos ativos, usando o primeiro retornado:", planos);
                }

                setIdPacientePlano(planos[0].id_paciente_plano ?? "");
            } catch (error) {
                console.error("Erro ao buscar plano do paciente:", error);
                toast.error("Não foi possível verificar o plano de cobrança do paciente.");
                setIdPacientePlano("");
            }
        }

        resolverPlanoAtivo();
    }, [isEdicao, pacienteSelecionado]);

    function validar(): string | null {
        if (!pacienteSelecionado) return "Selecione um paciente.";
        if (!isEdicao && !idPacientePlano) return "Paciente sem plano de cobrança ativo.";
        if (!dataConsulta) return "Informe a data da consulta.";
        if (!horaInicio) return "Informe a hora de início.";

        const duracao = Number(duracaoMinutos);
        if (!duracao || duracao <= 0) return "Informe uma duração válida (em minutos).";

        if (!tipoConsultaSelecionado) return "Selecione o tipo de consulta.";
        if (isEdicao && !statusSelecionado) return "Selecione o status da sessão.";

        if (!isEdicao && frequenciaSelecionada !== "Sem recorrência") {
            if (!dataFimRecorrencia) return "Informe a data fim da recorrência.";
            if (dataFimRecorrencia <= dataConsulta) return "A data fim da recorrência deve ser posterior à data da consulta.";
        }

        return null;
    }

    const handleSalvarConsulta = async () => {
        const erro = validar();
        if (erro) {
            toast.error(erro);
            return;
        }

        try {
            setSalvando(true);

            const inicioBase = montarDataHora(dataConsulta, horaInicio);
            const duracao = Number(duracaoMinutos);

            if (isEdicao && idAgenda) {
                const fim = calcularHoraFim(inicioBase, duracao);

                await agendaService.atualizar(idAgenda, {
                    data_agendamento: dataConsulta,
                    hora_inicio: inicioBase.toISOString(),
                    hora_fim: fim.toISOString(),
                    tipo_consulta: tipoConsultaSelecionado,
                    status_sessao: statusSelecionado,
                    observacoes: observacoes || undefined
                });

                toast.success("Consulta atualizada com sucesso!");

                if (statusSelecionado === "Realizado" && statusOriginal !== "Realizado") {
                    try {
                        await gerarFinanceiroPorSessaoRealizada({
                            id_agenda: idAgenda,
                            id_paciente_plano: idPacientePlano,
                            id_paciente: pacienteSelecionado,
                            data_agendamento: dataConsulta
                        });
                    } catch (erroFinanceiro) {
                        console.error("Erro ao gerar financeiro da consulta:", erroFinanceiro);
                        toast.error("Consulta salva, mas houve um erro ao gerar o lançamento financeiro. Verifique manualmente em Financeiro.");
                    }
                }

                onSalvo();
                return;
            }

            const ehRecorrente = frequenciaSelecionada !== "Sem recorrência";
            const dataBaseSemHora = new Date(inicioBase.getFullYear(), inicioBase.getMonth(), inicioBase.getDate());

            const datas = ehRecorrente
                ? gerarDatasRecorrencia(
                    dataBaseSemHora,
                    frequenciaSelecionada as "Semanal" | "Quinzenal" | "Mensal",
                    montarDataHora(dataFimRecorrencia, "00:00")
                )
                : [dataBaseSemHora];

            if (ehRecorrente && datas.length === LIMITE_MAX_OCORRENCIAS) {
                toast(`A série foi limitada a ${LIMITE_MAX_OCORRENCIAS} consultas.`, { icon: "⚠️" });
            }

            const idGrupoRecorrencia = ehRecorrente ? crypto.randomUUID() : undefined;

            const registros: Omit<Agenda, "id_agenda">[] = datas.map((data) => {
                const inicio = new Date(
                    data.getFullYear(), data.getMonth(), data.getDate(),
                    inicioBase.getHours(), inicioBase.getMinutes()
                );
                const fim = calcularHoraFim(inicio, duracao);

                return {
                    id_paciente_plano: idPacientePlano,
                    id_paciente: pacienteSelecionado,
                    data_agendamento: format(data, "yyyy-MM-dd"),
                    hora_inicio: inicio.toISOString(),
                    hora_fim: fim.toISOString(),
                    tipo_consulta: tipoConsultaSelecionado,
                    status_sessao: "Agendado",
                    frequencia: ehRecorrente ? frequenciaSelecionada : undefined,
                    data_fim_recorrencia: ehRecorrente ? dataFimRecorrencia : undefined,
                    id_grupo_recorrencia: idGrupoRecorrencia,
                    observacoes: observacoes || undefined
                };
            });

            if (registros.length === 1) {
                await agendaService.inserir(registros[0]);
            } else {
                await agendaService.inserirVarios(registros);
            }

            toast.success(
                registros.length === 1
                    ? "Consulta agendada com sucesso!"
                    : `${registros.length} consultas agendadas com sucesso!`
            );
            onSalvo();
        } catch (error) {
            console.error("Erro ao salvar consulta:", error);
            toast.error("Não foi possível salvar a consulta. Erro: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluir = async () => {
        if (!idAgenda) return;

        if (idGrupoRecorrencia) {
            const escolha = await confirmarComOpcoes({
                title: "Excluir consulta recorrente",
                text: "Esta consulta faz parte de uma série recorrente. O que deseja excluir?",
                icon: "warning",
                confirmButtonText: "Excluir apenas esta",
                denyButtonText: "Excluir toda a série"
            });

            if (escolha === "cancel") return;

            try {
                setExcluindo(true);
                if (escolha === "deny") {
                    await agendaService.excluirPorGrupoRecorrencia(idGrupoRecorrencia);
                    toast.success("Série de consultas excluída com sucesso.");
                } else {
                    await agendaService.excluir(idAgenda);
                    toast.success("Consulta excluída com sucesso.");
                }
                onSalvo();
            } catch (error) {
                console.error("Erro ao excluir consulta:", error);
                toast.error(mensagemErroExclusao(error));
            } finally {
                setExcluindo(false);
            }
            return;
        }

        const confirmou = await confirmar({
            title: "Excluir consulta?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning"
        });

        if (!confirmou) return;

        try {
            setExcluindo(true);
            await agendaService.excluir(idAgenda);
            toast.success("Consulta excluída com sucesso.");
            onSalvo();
        } catch (error) {
            console.error("Erro ao excluir consulta:", error);
            toast.error(mensagemErroExclusao(error));
        } finally {
            setExcluindo(false);
        }
    };

    const carregandoAcao = salvando || excluindo;

    return (
        <div className={styles.overlay} role="presentation">
            <div
                className={styles["modal-container"]}
                role="dialog"
                aria-modal="true"
                aria-label={isEdicao ? "Editar consulta" : "Nova consulta"}
            >
                <div className={styles["modal-header"]}>
                    <Header
                        title={isEdicao ? "Editar consulta" : "Nova consulta"}
                        subtitle={isEdicao ? "Altere os dados da consulta" : "Cadastre um novo horário para o paciente"}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        className={styles["close-button"]}
                    >
                        ×
                    </Button>
                </div>

                <div className={styles["modal-content"]}>
                    {isEdicao && idGrupoRecorrencia && (
                        <p>Esta consulta faz parte de uma série recorrente.</p>
                    )}

                    <Combobox
                        label="Paciente *"
                        name="paciente"
                        placeholder="Selecione o paciente"
                        value={pacienteSelecionado}
                        options={pacientes}
                        onChange={(event) => setPacienteSelecionado(event.target.value)}
                        disabled={pacientes.length === 0 || isEdicao}
                    />

                    <div className={styles["linha-campo"]}>
                        <InputData
                            name="Data da consulta *"
                            value={dataConsulta}
                            onChange={(event) => setDataConsulta(event.target.value)}
                        />
                        <Input
                            name="Duração da consulta (em minutos) *"
                            type="number"
                            placeholder="Ex: 60"
                            value={duracaoMinutos}
                            onChange={(event) => setDuracaoMinutos(event.target.value)}
                        />
                    </div>

                    <div className={styles["linha-campo"]}>
                        <InputData
                            name="Hora Início *"
                            type="time"
                            value={horaInicio}
                            onChange={(event) => setHoraInicio(event.target.value)}
                        />
                        <Combobox
                            label="Tipo de Consulta *"
                            name="tipo_consulta"
                            placeholder="Selecione o tipo de consulta"
                            value={tipoConsultaSelecionado}
                            options={tiposConsulta}
                            onChange={(event) => setTipoConsultaSelecionado(event.target.value)}
                        />
                    </div>

                    {isEdicao ? (
                        <Combobox
                            label="Status *"
                            name="status_sessao"
                            placeholder="Selecione o status"
                            value={statusSelecionado}
                            options={statuses}
                            onChange={(event) => setStatusSelecionado(event.target.value)}
                        />
                    ) : (
                        <div className={styles["linha-campo"]}>
                            <Combobox
                                label="Frequência"
                                name="frequencia"
                                placeholder="Selecione a frequência"
                                value={frequenciaSelecionada}
                                options={frequencias}
                                onChange={(event) => setFrequenciaSelecionada(event.target.value)}
                            />
                            {frequenciaSelecionada !== "Sem recorrência" && (
                                <InputData
                                    name="Data Fim da Recorrência *"
                                    value={dataFimRecorrencia}
                                    onChange={(event) => setDataFimRecorrencia(event.target.value)}
                                />
                            )}
                        </div>
                    )}

                    <TextArea
                        name="Observações"
                        value={observacoes}
                        onChange={(event) => setObservacoes(event.target.value)}
                    />

                    <div className={styles["linha-botao"]}>
                        {isEdicao && (
                            <Button variant="danger" icon="delete" onClick={handleExcluir} disabled={carregandoAcao}>
                                Excluir
                            </Button>
                        )}
                        <Button variant="warning" onClick={onClose} disabled={carregandoAcao}>Cancelar</Button>
                        <Button variant="success" onClick={handleSalvarConsulta} disabled={carregandoAcao}>
                            {isEdicao ? "Salvar Alterações" : "Salvar Consulta"}
                        </Button>
                    </div>
                </div>
            </div>

            <Loading loading={carregando || carregandoAcao} />
        </div>
    );
}
