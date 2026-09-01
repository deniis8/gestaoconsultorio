import { api } from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { PacientePlano } from "../../../types/paciente-plano/paciente-plano.types";

export class PacientePlanoService {

    async listar(): Promise<PacientePlano[]> {

        return api<PacientePlano[]>(ENDPOINTS.paciente_plano);
    }

    async buscarPorId(id_plano_cobranca: string): Promise<PacientePlano[]> {

        return api<PacientePlano[]>(
            `${ENDPOINTS.paciente_plano}?id_plano_cobranca=eq.${id_plano_cobranca}`
        );
    }

    async buscarPorIdPaciente(id_paciente: string): Promise<PacientePlano[]> {

        return api<PacientePlano[]>(
            `${ENDPOINTS.paciente_plano}?id_paciente=eq.${id_paciente}&status=eq.ativo`
        );
    }

    async inserir(planoCobranca: Omit<PacientePlano, "id_paciente_plano">): Promise<PacientePlano[]> {

        return api<PacientePlano[]>(ENDPOINTS.paciente_plano, {
            method: "POST",
            body: JSON.stringify(planoCobranca)
        });
    }

    async atualizar(id_paciente_plano: string, planoCobranca: Partial<PacientePlano>) {

        return api<PacientePlano[]>(
            `${ENDPOINTS.paciente_plano}?id_paciente_plano=eq.${id_paciente_plano}`,
            {
                method: "PATCH",
                body: JSON.stringify(planoCobranca)
            }
        );
    }

    async excluir(id_paciente_plano: string) {

        return api<void>(
            `${ENDPOINTS.paciente_plano}?id_paciente_plano=eq.${id_paciente_plano}`,
            {
                method: "DELETE"
            }
        );
    }
}

export const pacientePlanoService = new PacientePlanoService();