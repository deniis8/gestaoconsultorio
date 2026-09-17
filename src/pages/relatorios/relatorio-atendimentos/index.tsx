import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { differenceInMinutes, format } from "date-fns";
import { Card } from "../../../components/ui/card";
import { Combobox } from "../../../components/ui/combobox";
import { InputData } from "../../../components/ui/input-data";
import { Button } from "../../../components/ui/button";
import { Table } from "../../../components/ui/table";
import { Loading } from "../../../components/layout/loading";
import styles from "./relatorio-atendimentos.module.css";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { agendaService } from "../../../services/apis-supabase/agenda/agenda.service";
import { Agenda } from "../../../types/agenda/agenda.types";
import { CORES_STATUS_AGENDA } from "../../../utils/agendaFormat";
import { formatSimpleDate } from "../../../utils/dataFormat";
import { exportarParaExcel, exportarParaPdf } from "../../../utils/exportarRelatorio";

const STATUS_ATENDIMENTO = ["Agendado", "Confirmado", "Realizado", "Cancelado", "Falta"];

type LinhaAtendimento = {
    id_agenda: string;
    data: string;
    hora: string;
    tipo_consulta: string;
    duracao: string;
    status_sessao: string;
    observacoes: string;
};

export function RelatorioAtendimentos() {
    const [pacientes, setPacientes] = useState<{ label: string; value: string }[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [gerado, setGerado] = useState(false);
    const [resultados, setResultados] = useState<Agenda[]>([]);

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
        fetchPacientes();
    }, []);

    const handleGerar = async () => {
        if (!pacienteSelecionado) {
            toast.error("Selecione um paciente.");
            return;
        }

        try {
            setCarregando(true);
            const dados = await agendaService.buscarPorPacienteEPeriodo(pacienteSelecionado, dataInicio || undefined, dataFim || undefined);
            setResultados(dados);
            setGerado(true);
        } catch (error) {
            console.error("Erro ao gerar relatório de atendimentos:", error);
            toast.error("Não foi possível gerar o relatório.");
        } finally {
            setCarregando(false);
        }
    };

    const linhas: LinhaAtendimento[] = resultados.map((item) => {
        const inicio = item.hora_inicio ? new Date(item.hora_inicio as string) : null;
        const fim = item.hora_fim ? new Date(item.hora_fim as string) : null;
        const duracaoMin = inicio && fim ? Math.max(differenceInMinutes(fim, inicio), 0) : 0;

        return {
            id_agenda: item.id_agenda ?? "",
            data: formatSimpleDate(String(item.data_agendamento ?? "")),
            hora: inicio ? format(inicio, "HH:mm") : "",
            tipo_consulta: item.tipo_consulta ?? "",
            duracao: `${duracaoMin} min`,
            status_sessao: item.status_sessao ?? "",
            observacoes: item.observacoes ?? ""
        };
    });

    const contagemPorStatus = STATUS_ATENDIMENTO.map((status) => ({
        status,
        total: resultados.filter((item) => item.status_sessao === status).length
    })).filter((item) => item.total > 0);

    const nomePacienteSelecionado = pacientes.find((p) => p.value === pacienteSelecionado)?.label ?? "";

    const colunasExportacao = [
        { header: "Data", key: "data" },
        { header: "Hora", key: "hora" },
        { header: "Tipo de Consulta", key: "tipo_consulta" },
        { header: "Duração", key: "duracao" },
        { header: "Status", key: "status_sessao" },
        { header: "Observações", key: "observacoes" }
    ];

    const handleExportarExcel = () => {
        exportarParaExcel(`atendimentos_${nomePacienteSelecionado || "paciente"}`, colunasExportacao, linhas);
    };

    const handleExportarPdf = () => {
        exportarParaPdf(
            `atendimentos_${nomePacienteSelecionado || "paciente"}`,
            "Relatório de Atendimentos",
            `Paciente: ${nomePacienteSelecionado}${dataInicio ? ` | De: ${formatSimpleDate(dataInicio)}` : ""}${dataFim ? ` | Até: ${formatSimpleDate(dataFim)}` : ""}`,
            colunasExportacao,
            linhas,
            `Total de atendimentos: ${resultados.length}`
        );
    };

    return (
        <Card title="Relatório de Atendimentos">
            <div className={styles["linha-campo"]}>
                <Combobox
                    label="Paciente *"
                    name="paciente"
                    placeholder="Selecione o paciente"
                    value={pacienteSelecionado}
                    options={pacientes}
                    onChange={(e) => setPacienteSelecionado(e.target.value)}
                    disabled={pacientes.length === 0}
                />
                <InputData
                    name="De"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                />
                <InputData
                    name="Até"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                />
                <Button variant="primary" onClick={handleGerar} disabled={carregando}>
                    Gerar Relatório
                </Button>
            </div>

            {gerado && (
                <>
                    {contagemPorStatus.length > 0 && (
                        <div className={styles["resumo-chips"]}>
                            {contagemPorStatus.map(({ status, total }) => (
                                <span key={status} className={styles.chip}>
                                    <span className={styles["chip-ponto"]} style={{ backgroundColor: CORES_STATUS_AGENDA[status] ?? "#7E8A97" }} />
                                    {status}: {total}
                                </span>
                            ))}
                            <span className={styles.chip}>Total: {resultados.length}</span>
                        </div>
                    )}

                    <Table
                        columns={[
                            { key: "data", header: "Data" },
                            { key: "hora", header: "Hora" },
                            { key: "tipo_consulta", header: "Tipo de Consulta" },
                            { key: "duracao", header: "Duração" },
                            {
                                key: "status_sessao",
                                header: "Status",
                                render: (item) => (
                                    <span
                                        className={styles["status-badge"]}
                                        style={{ backgroundColor: CORES_STATUS_AGENDA[item.status_sessao] ?? "#7E8A97" }}
                                    >
                                        {item.status_sessao}
                                    </span>
                                )
                            },
                            { key: "observacoes", header: "Observações" }
                        ]}
                        data={linhas}
                        emptyMessage="Nenhum atendimento encontrado para o período selecionado."
                    />

                    <div className={styles["acoes-exportar"]}>
                        <Button variant="secondary" onClick={handleExportarExcel} disabled={linhas.length === 0}>
                            Exportar Excel
                        </Button>
                        <Button variant="secondary" onClick={handleExportarPdf} disabled={linhas.length === 0}>
                            Exportar PDF
                        </Button>
                    </div>
                </>
            )}

            <Loading loading={carregando} />
        </Card>
    );
}
