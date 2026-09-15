import { Financeiro } from "../../../types/financeiro/financeiro.types";
import { api } from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";

export class FinanceiroService {

    async listar(): Promise<Financeiro[]> {

        return api<Financeiro[]>(ENDPOINTS.financeiro);
    }

    async buscarPorId(id_financeiro: string): Promise<Financeiro[]> {

        return api<Financeiro[]>(
            `${ENDPOINTS.financeiro}?id_financeiro=eq.${id_financeiro}`
        );
    }

    async buscarPorDescricao(termo: string): Promise<Financeiro[]> {

        const texto = termo.trim();
        const filtro = texto ? `%${texto}%` : "%";

        return api<Financeiro[]>(
            `${ENDPOINTS.financeiro}?descricao=ilike.${encodeURIComponent(filtro)}`
        );
    }

    async buscarPorIdAgenda(id_agenda: string): Promise<Financeiro[]> {

        return api<Financeiro[]>(
            `${ENDPOINTS.financeiro}?id_agenda=eq.${id_agenda}`
        );
    }

    async buscarPorIdPacientePlanoEOrigem(id_paciente_plano: string, origem: string): Promise<Financeiro[]> {

        return api<Financeiro[]>(
            `${ENDPOINTS.financeiro}?id_paciente_plano=eq.${id_paciente_plano}&origem=eq.${origem}`
        );
    }

    async inserir(financeiro: Omit<Financeiro, "id_financeiro">): Promise<Financeiro[]> {

        return api<Financeiro[]>(ENDPOINTS.financeiro, {
            method: "POST",
            body: JSON.stringify(financeiro)
        });
    }

    async atualizar(id_financeiro: string, financeiro: Partial<Financeiro>) {

        return api<Financeiro[]>(
            `${ENDPOINTS.financeiro}?id_financeiro=eq.${id_financeiro}`,
            {
                method: "PATCH",
                body: JSON.stringify(financeiro)
            }
        );
    }
}

export const financeiroService = new FinanceiroService();
