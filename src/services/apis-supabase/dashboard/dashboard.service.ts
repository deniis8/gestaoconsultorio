import { api } from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import {
    AgendaHojeDashboard,
    CobrancaVencidaDashboard,
    DistribuicaoPlanoDashboard,
    ProximaConsultaDashboard,
    ReceitaMensalDashboard,
    ResumoFinanceiroDashboard
} from "../../../types/dashboard/dashboard.types";

export class DashboardService {

    async buscarResumoFinanceiro(): Promise<ResumoFinanceiroDashboard[]> {

        return api<ResumoFinanceiroDashboard[]>(ENDPOINTS.vw_dashboard_resumo_financeiro);
    }

    async buscarReceitaMensal(): Promise<ReceitaMensalDashboard[]> {

        return api<ReceitaMensalDashboard[]>(ENDPOINTS.vw_dashboard_receita_mensal);
    }

    async buscarDistribuicaoPlanos(): Promise<DistribuicaoPlanoDashboard[]> {

        return api<DistribuicaoPlanoDashboard[]>(ENDPOINTS.vw_dashboard_distribuicao_planos);
    }

    async buscarAgendaHoje(): Promise<AgendaHojeDashboard[]> {

        return api<AgendaHojeDashboard[]>(ENDPOINTS.vw_dashboard_agenda_hoje);
    }

    async buscarProximaConsulta(): Promise<ProximaConsultaDashboard[]> {

        return api<ProximaConsultaDashboard[]>(ENDPOINTS.vw_dashboard_proxima_consulta);
    }

    async buscarCobrancaVencida(): Promise<CobrancaVencidaDashboard[]> {

        return api<CobrancaVencidaDashboard[]>(ENDPOINTS.vw_dashboard_cobranca_vencida);
    }
}

export const dashboardService = new DashboardService();
