import { Paciente } from "../../types/pacientes/pacientes.types";
import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoints";

export class PacientesService {

    async listar(): Promise<Paciente[]> {

        return api<Paciente[]>(ENDPOINTS.pacientes);
    }

    async buscarPorNome(nome: string): Promise<Paciente[]> {

        return api<Paciente[]>(
            `${ENDPOINTS.pacientes}?nome_completo=eq.${encodeURIComponent(nome)}`
        );
    }

    async buscarPorId(id: string): Promise<Paciente[]> {

        return api<Paciente[]>(
            `${ENDPOINTS.pacientes}?id_paciente=eq.${id}`
        );
    }

    async inserir(paciente: Omit<Paciente, "id_paciente">): Promise<Paciente[]> {

        return api<Paciente[]>(ENDPOINTS.pacientes, {
            method: "POST",
            body: JSON.stringify(paciente)
        });
    }

    async atualizar(id: string, paciente: Partial<Paciente>) {

        return api<Paciente[]>(
            `${ENDPOINTS.pacientes}?id_paciente=eq.${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(paciente)
            }
        );
    }

    async excluir(id: string) {

        return api<void>(
            `${ENDPOINTS.pacientes}?id_paciente=eq.${id}`,
            {
                method: "DELETE"
            }
        );
    }
}

export const pacientesService = new PacientesService();