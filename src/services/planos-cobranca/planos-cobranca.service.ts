import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { PlanosCobranca } from "../../types/planos-cobranca/planos-cobranca.types";

export class PlanosCobrancaService {

    async listar(): Promise<PlanosCobranca[]> {

        return api<PlanosCobranca[]>(ENDPOINTS.planos_cobranca);
    }

    async buscarPorId(id_plano_cobranca: string): Promise<PlanosCobranca[]> {

        return api<PlanosCobranca[]>(
            `${ENDPOINTS.planos_cobranca}?id_plano_cobranca=eq.${id_plano_cobranca}`
        );
    }

    async buscarPorIdUsuario(id_plano_cobranca: number): Promise<PlanosCobranca[]> {

        return api<PlanosCobranca[]>(
            `${ENDPOINTS.planos_cobranca}?id_plano_cobranca=eq.${id_plano_cobranca}`
        );
    }

    async inserir(planoCobranca: Omit<PlanosCobranca, "id_plano_cobranca">): Promise<PlanosCobranca[]> {

        return api<PlanosCobranca[]>(ENDPOINTS.planos_cobranca, {
            method: "POST",
            body: JSON.stringify(planoCobranca)
        });
    }

    async atualizar(id: string, planoCobranca: Partial<PlanosCobranca>) {

        return api<PlanosCobranca[]>(
            `${ENDPOINTS.planos_cobranca}?id_plano_cobranca=eq.${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(planoCobranca)
            }
        );
    }

    async excluir(id: number) {

        return api<void>(
            `${ENDPOINTS.planos_cobranca}?id_plano_cobranca=eq.${id}`,
            {
                method: "DELETE"
            }
        );
    }
}

export const planosCobrancaService = new PlanosCobrancaService();