import { Agenda } from "../../../types/agenda/agenda.types";
import { api } from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";

export class AgendaService {

    async listar(): Promise<Agenda[]> {

        return api<Agenda[]>(ENDPOINTS.agenda);
    }

    async buscarPorId(id_agenda: string): Promise<Agenda[]> {

        return api<Agenda[]>(
            `${ENDPOINTS.agenda}?id_agenda=eq.${id_agenda}`
        );
    }

    async listarRealizadosPorPacientePlano(id_paciente_plano: string): Promise<Agenda[]> {

        return api<Agenda[]>(
            `${ENDPOINTS.agenda}?id_paciente_plano=eq.${id_paciente_plano}&status_sessao=eq.Realizado&order=data_agendamento.asc`
        );
    }

    async inserir(agenda: Omit<Agenda, "id_agenda">): Promise<Agenda[]> {

        return api<Agenda[]>(ENDPOINTS.agenda, {
            method: "POST",
            body: JSON.stringify(agenda)
        });
    }

    async inserirVarios(agendas: Omit<Agenda, "id_agenda">[]): Promise<Agenda[]> {

        return api<Agenda[]>(ENDPOINTS.agenda, {
            method: "POST",
            body: JSON.stringify(agendas)
        });
    }

    async atualizar(id: string, agenda: Partial<Agenda>) {

        return api<Agenda[]>(
            `${ENDPOINTS.agenda}?id_agenda=eq.${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(agenda)
            }
        );
    }

    async excluir(id: string) {

        return api<void>(
            `${ENDPOINTS.agenda}?id_agenda=eq.${id}`,
            {
                method: "DELETE"
            }
        );
    }

    async excluirPorGrupoRecorrencia(id_grupo_recorrencia: string) {

        return api<void>(
            `${ENDPOINTS.agenda}?id_grupo_recorrencia=eq.${id_grupo_recorrencia}`,
            {
                method: "DELETE"
            }
        );
    }
}

export const agendaService = new AgendaService();
