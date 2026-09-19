import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Header } from "../../components/layout/header";
import { Card } from "../../components/ui/card";
import { Table } from "../../components/ui/table";
import styles from "./dashboard.module.css";
import { dashboardService } from "../../services/apis-supabase/dashboard/dashboard.service";
import {
    AgendaHojeDashboard,
    CobrancaVencidaDashboard,
    DistribuicaoPlanoDashboard,
    ProximaConsultaDashboard,
    ReceitaMensalDashboard,
    ResumoFinanceiroDashboard
} from "../../types/dashboard/dashboard.types";
import { CORES_STATUS_AGENDA } from "../../utils/agendaFormat";
import { formatarMoeda } from "../../utils/financeiroFormat";
import { estiloBadgeStatus } from "../../utils/statusBadge";
import { GraficoReceitaMensal } from "./grafico-receita-mensal";
import { SkeletonDashboard } from "./skeleton/skeleton";

type LinhaAgendaHoje = {
    id_agenda: string;
    hora: string;
    duracao: string;
    paciente: string;
    status: string;
};

function formatarDataHoraConsulta(horaInicioIso: string): string {
    const data = new Date(horaInicioIso);
    const hoje = new Date();
    const mesmoDia =
        data.getFullYear() === hoje.getFullYear() &&
        data.getMonth() === hoje.getMonth() &&
        data.getDate() === hoje.getDate();

    const hora = format(data, "HH:mm");
    return mesmoDia ? `Hoje às ${hora}` : `${format(data, "dd/MM")} às ${hora}`;
}

export function Dashboard() {
    const [loadingDashboard, setLoadingDashboard] = useState(true);

    const [resumo, setResumo] = useState<ResumoFinanceiroDashboard | null>(null);
    const [receitaMensal, setReceitaMensal] = useState<ReceitaMensalDashboard[]>([]);
    const [distribuicaoPlanos, setDistribuicaoPlanos] = useState<DistribuicaoPlanoDashboard[]>([]);
    const [agendaHoje, setAgendaHoje] = useState<AgendaHojeDashboard[]>([]);
    const [proximaConsulta, setProximaConsulta] = useState<ProximaConsultaDashboard | null>(null);
    const [cobrancaVencida, setCobrancaVencida] = useState<CobrancaVencidaDashboard[]>([]);

    useEffect(() => {
        async function carregarDashboard() {
            try {
                setLoadingDashboard(true);

                const [
                    resumoResultado,
                    receitaMensalResultado,
                    distribuicaoPlanosResultado,
                    agendaHojeResultado,
                    proximaConsultaResultado,
                    cobrancaVencidaResultado
                ] = await Promise.all([
                    dashboardService.buscarResumoFinanceiro(),
                    dashboardService.buscarReceitaMensal(),
                    dashboardService.buscarDistribuicaoPlanos(),
                    dashboardService.buscarAgendaHoje(),
                    dashboardService.buscarProximaConsulta(),
                    dashboardService.buscarCobrancaVencida()
                ]);

                setResumo(resumoResultado[0] ?? null);
                setReceitaMensal(receitaMensalResultado);
                setDistribuicaoPlanos(distribuicaoPlanosResultado);
                setAgendaHoje(agendaHojeResultado);
                setProximaConsulta(proximaConsultaResultado[0] ?? null);
                setCobrancaVencida(cobrancaVencidaResultado);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoadingDashboard(false);
            }
        }

        carregarDashboard();
    }, []);

    const pacientesComCobrancaVencida = new Set(cobrancaVencida.map((c) => c.id_paciente)).size;
    const valorTotalVencido = cobrancaVencida.reduce((total, c) => total + (c.valor ?? 0), 0);

    const maiorQuantidadePlano = Math.max(1, ...distribuicaoPlanos.map((p) => p.quantidade_pacientes));

    const linhasAgendaHoje: LinhaAgendaHoje[] = agendaHoje.map((item) => ({
        id_agenda: item.id_agenda,
        hora: format(new Date(item.hora_inicio), "HH:mm"),
        duracao: `${item.duracao_minutos} min`,
        paciente: item.nome_paciente,
        status: item.status_sessao
    }));

    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Dashboard"
                subtitle="Visão geral do consultório"
            />

            {loadingDashboard ? (
                <SkeletonDashboard />
            ) : (
                <>
                    <div className={styles["linha-indicadores"]}>
                        <Card>
                            <span className={styles["indicador-label"]}>Pacientes com Cobrança Vencida</span>
                            <span className={`${styles["indicador-valor"]} ${pacientesComCobrancaVencida > 0 ? styles.alerta : ""}`}>
                                {pacientesComCobrancaVencida}
                            </span>
                            {pacientesComCobrancaVencida > 0 && (
                                <span className={styles["indicador-sub"]}>{formatarMoeda(valorTotalVencido)} em atraso</span>
                            )}
                        </Card>

                        <Card>
                            <span className={styles["indicador-label"]}>Próxima Consulta</span>
                            {proximaConsulta ? (
                                <>
                                    <span className={styles["indicador-valor"]}>{formatarDataHoraConsulta(proximaConsulta.hora_inicio)}</span>
                                    <span className={styles["indicador-sub"]}>{proximaConsulta.nome_paciente}</span>
                                </>
                            ) : (
                                <span className={styles["indicador-valor"]}>—</span>
                            )}
                        </Card>

                        <Card>
                            <span className={styles["indicador-label"]}>Receita do Mês</span>
                            <span className={styles["indicador-valor"]}>{formatarMoeda(resumo?.recebido ?? 0)}</span>
                        </Card>
                    </div>

                    <div className={styles["linha-duas-colunas"]}>
                        <Card title="Agenda de Hoje">
                            <Table
                                columns={[
                                    { key: "hora", header: "Hora" },
                                    { key: "duracao", header: "Duração" },
                                    { key: "paciente", header: "Paciente" },
                                    {
                                        key: "status",
                                        header: "Status",
                                        render: (item) => (
                                            <span
                                                className={styles["status-badge"]}
                                                style={estiloBadgeStatus(CORES_STATUS_AGENDA[item.status] ?? "#7E8A97")}
                                            >
                                                {item.status}
                                            </span>
                                        )
                                    }
                                ]}
                                data={linhasAgendaHoje}
                                emptyMessage="Nenhuma consulta agendada para hoje."
                            />
                        </Card>

                        <Card title="Distribuição por Plano de Cobrança">
                            <div className={styles["distribuicao-lista"]}>
                                {distribuicaoPlanos.length === 0 ? (
                                    <span className={styles["indicador-sub"]}>Nenhum plano cadastrado.</span>
                                ) : (
                                    distribuicaoPlanos.map((plano) => (
                                        <div key={plano.id_plano_cobranca} className={styles["distribuicao-item"]}>
                                            <div className={styles["distribuicao-topo"]}>
                                                <span>{plano.nome_plano}</span>
                                                <span className={styles["distribuicao-contagem"]}>{plano.quantidade_pacientes}</span>
                                            </div>
                                            <div className={styles["distribuicao-barra-fundo"]}>
                                                <div
                                                    className={styles["distribuicao-barra-preenchida"]}
                                                    style={{ width: `${(plano.quantidade_pacientes / maiorQuantidadePlano) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    <Card title="Resumo Financeiro" className={styles["grafico-card"]}>
                        <div className={styles["resumo-grid"]}>
                            <div>
                                <span className={styles["indicador-label"]}>Recebido</span>
                                <span className={styles["indicador-valor"]}>{formatarMoeda(resumo?.recebido ?? 0)}</span>
                            </div>
                            <div>
                                <span className={styles["indicador-label"]}>Pendente</span>
                                <span className={styles["indicador-valor"]}>{formatarMoeda(resumo?.pendente ?? 0)}</span>
                            </div>
                            <div>
                                <span className={styles["indicador-label"]}>Atrasado</span>
                                <span className={`${styles["indicador-valor"]} ${(resumo?.atrasado ?? 0) > 0 ? styles.alerta : ""}`}>
                                    {formatarMoeda(resumo?.atrasado ?? 0)}
                                </span>
                            </div>
                            <div>
                                <span className={styles["indicador-label"]}>Taxa de Comparecimento</span>
                                <span className={styles["indicador-valor"]}>{resumo?.taxa_comparecimento ?? 0}%</span>
                            </div>
                            <div>
                                <span className={styles["indicador-label"]}>Consultas Realizadas</span>
                                <span className={styles["indicador-valor"]}>{resumo?.consultas_realizadas ?? 0}</span>
                            </div>
                            <div>
                                <span className={styles["indicador-label"]}>Receita Prevista</span>
                                <span className={styles["indicador-valor"]}>{formatarMoeda(resumo?.receita_prevista ?? 0)}</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Receita dos Últimos Meses">
                        <GraficoReceitaMensal dados={receitaMensal} />
                    </Card>
                </>
            )}
        </div>
    );
}
