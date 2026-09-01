import { Agenda } from "../../../types/agenda/agenda.types";
import { api } from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";

export class AgendaService {

    async listar(): Promise<Agenda[]> {

        return api<Agenda[]>(ENDPOINTS.agenda);
    }

    async buscarPorNome(nome: string): Promise<Agenda[]> {

        return api<Agenda[]>(
            `${ENDPOINTS.agenda}?nome_completo=eq.${encodeURIComponent(nome)}`
        );
    }

    async buscarPorId(id_agenda: string): Promise<Agenda[]> {

        return api<Agenda[]>(
            `${ENDPOINTS.agenda}?id_agenda=eq.${id_agenda}`
        );
    }

    async inserir(agenda: Omit<Agenda, "id_agenda">): Promise<Agenda[]> {

        return api<Agenda[]>(ENDPOINTS.agenda, {
            method: "POST",
            body: JSON.stringify(agenda)
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
}

export const agendaService = new AgendaService();