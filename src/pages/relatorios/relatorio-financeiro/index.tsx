import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "../../../components/ui/card";
import { Combobox } from "../../../components/ui/combobox";
import { InputData } from "../../../components/ui/input-data";
import { Button } from "../../../components/ui/button";
import { Table } from "../../../components/ui/table";
import { Loading } from "../../../components/layout/loading";
import styles from "./relatorio-financeiro.module.css";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { financeiroService } from "../../../services/apis-supabase/financeiro/financeiro.service";
import { Financeiro } from "../../../types/financeiro/financeiro.types";
import { formatarMoeda, formatarOrigemFinanceiro, CORES_STATUS_FINANCEIRO } from "../../../utils/financeiroFormat";
import { formatSimpleDate } from "../../../utils/dataFormat";
import { exportarParaExcel, exportarParaPdf } from "../../../utils/exportarRelatorio";
import { estiloBadgeStatus } from "../../../utils/statusBadge";

const STATUS_OPTIONS = [
    { label: "Todos", value: "" },
    { label: "Pendente", value: "Pendente" },
    { label: "Pago", value: "Pago" },
    { label: "Cancelado", value: "Cancelado" }
];

const STATUS_FINANCEIRO = ["Pendente", "Pago", "Cancelado"];

type LinhaFinanceiro = {
    id_financeiro: string;
    data_cobranca: string;
    descricao: string;
    origem: string;
    valor: string;
    data_vencimento: string;
    data_pagamento: string;
    status: string;
};

export function RelatorioFinanceiro() {
    const [pacientes, setPacientes] = useState<{ label: string; value: string }[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [gerado, setGerado] = useState(false);
    const [resultados, setResultados] = useState<Financeiro[]>([]);

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
            const planos = await pacientePlanoService.listarPorIdPaciente(pacienteSelecionado);
            const idsPacientePlano = planos.map((p) => p.id_paciente_plano ?? "").filter(Boolean);

            const dados = await financeiroService.buscarPorPacientePlanoEPeriodo(
                idsPacientePlano,
                dataInicio || undefined,
                dataFim || undefined,
                statusSelecionado || undefined
            );

            setResultados(dados);
            setGerado(true);
        } catch (error) {
            console.error("Erro ao gerar relatório financeiro:", error);
            toast.error("Não foi possível gerar o relatório.");
        } finally {
            setCarregando(false);
        }
    };

    const linhas: LinhaFinanceiro[] = resultados.map((item) => ({
        id_financeiro: item.id_financeiro ?? "",
        data_cobranca: item.data_cobranca ? formatSimpleDate(item.data_cobranca) : "",
        descricao: item.descricao ?? "",
        origem: formatarOrigemFinanceiro(item.origem),
        valor: formatarMoeda(item.valor ?? 0),
        data_vencimento: item.data_vencimento ? formatSimpleDate(item.data_vencimento) : "",
        data_pagamento: item.data_pagamento ? formatSimpleDate(item.data_pagamento) : "-",
        status: item.status ?? ""
    }));

    const totalGeral = resultados.reduce((total, item) => total + (item.valor ?? 0), 0);
    const subtotaisPorStatus = STATUS_FINANCEIRO.map((status) => ({
        status,
        total: resultados.filter((item) => item.status === status).reduce((soma, item) => soma + (item.valor ?? 0), 0)
    })).filter((item) => item.total > 0);

    const nomePacienteSelecionado = pacientes.find((p) => p.value === pacienteSelecionado)?.label ?? "";

    const colunasExportacao = [
        { header: "Data Cobrança", key: "data_cobranca" },
        { header: "Descrição", key: "descricao" },
        { header: "Origem", key: "origem" },
        { header: "Valor", key: "valor" },
        { header: "Vencimento", key: "data_vencimento" },
        { header: "Pagamento", key: "data_pagamento" },
        { header: "Status", key: "status" }
    ];

    const handleExportarExcel = () => {
        exportarParaExcel(`financeiro_${nomePacienteSelecionado || "paciente"}`, colunasExportacao, linhas);
    };

    const handleExportarPdf = () => {
        exportarParaPdf(
            `financeiro_${nomePacienteSelecionado || "paciente"}`,
            "Relatório Financeiro",
            `Paciente: ${nomePacienteSelecionado}${dataInicio ? ` | De: ${formatSimpleDate(dataInicio)}` : ""}${dataFim ? ` | Até: ${formatSimpleDate(dataFim)}` : ""}${statusSelecionado ? ` | Status: ${statusSelecionado}` : ""}`,
            colunasExportacao,
            linhas,
            `Total do período: ${formatarMoeda(totalGeral)}`
        );
    };

    return (
        <Card title="Relatório Financeiro">
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
                <Combobox
                    label="Status"
                    name="status"
                    value={statusSelecionado}
                    options={STATUS_OPTIONS}
                    onChange={(e) => setStatusSelecionado(e.target.value)}
                />
                <Button variant="primary" onClick={handleGerar} disabled={carregando}>
                    Gerar Relatório
                </Button>
            </div>

            {gerado && (
                <>
                    <div className={styles["resumo-chips"]}>
                        {subtotaisPorStatus.map(({ status, total }) => (
                            <span key={status} className={styles.chip}>
                                <span className={styles["chip-ponto"]} style={{ backgroundColor: CORES_STATUS_FINANCEIRO[status] ?? "#7E8A97" }} />
                                {status}: {formatarMoeda(total)}
                            </span>
                        ))}
                        <span className={`${styles.chip} ${styles["chip-total"]}`}>Total: {formatarMoeda(totalGeral)}</span>
                    </div>

                    <Table
                        columns={[
                            { key: "data_cobranca", header: "Data Cobrança" },
                            { key: "descricao", header: "Descrição" },
                            { key: "origem", header: "Origem" },
                            { key: "valor", header: "Valor" },
                            { key: "data_vencimento", header: "Vencimento" },
                            { key: "data_pagamento", header: "Pagamento" },
                            {
                                key: "status",
                                header: "Status",
                                render: (item) => (
                                    <span
                                        className={styles["status-badge"]}
                                        style={estiloBadgeStatus(CORES_STATUS_FINANCEIRO[item.status] ?? "#7E8A97")}
                                    >
                                        {item.status}
                                    </span>
                                )
                            }
                        ]}
                        data={linhas}
                        emptyMessage="Nenhum lançamento encontrado para o período selecionado."
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
