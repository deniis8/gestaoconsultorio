import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./agenda.module.css";
import { agendaService } from "../../../services/apis-supabase/agenda/pacientes.service";
import { useEffect, useState } from "react";
import { Agenda } from "../../../types/agenda/agenda.types";
import { FormularioAgenda } from "../formulario-agenda";

const locales = {
    "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date) =>
        startOfWeek(date, {
            weekStartsOn: 1,
        }),
    getDay,
    locales,
});

const mensagens = {
    allDay: "Dia inteiro",
    previous: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Horário",
    event: "Consulta",
    noEventsInRange: "Nenhuma consulta neste período.",
    showMore: (total: number) => `+ ${total} consultas`,
};

const parseDataHora = (data?: string | Date, hora?: string | Date) => {
    if (!data) return null;

    const dataTexto = typeof data === "string" ? data.slice(0, 10) : data.toISOString().slice(0, 10);

    if (typeof hora === "string" && hora.includes(":")) {
        return new Date(`${dataTexto}T${hora}`);
    }

    if (typeof hora === "string" && /^\d{4}-\d{2}-\d{2}$/.test(hora)) {
        return new Date(`${hora}T09:00:00`);
    }

    return new Date(`${dataTexto}T09:00:00`);
};

export function Agendamentos() {

    const [agendamentos, setAgendamentos] = useState<Agenda[] | null>(null);
    const [dataAtual, setDataAtual] = useState(new Date());
    const [modalAberto, setModalAberto] = useState(false);

    const eventos = (agendamentos ?? []).map((agendamento) => {
        const start = parseDataHora(agendamento.data_agendamento, agendamento.hora_inicio);
        const end = parseDataHora(agendamento.data_agendamento, agendamento.hora_fim) ??
            (start ? new Date(start.getTime() + 60 * 60 * 1000) : new Date());

        return {
            id: agendamento.id_agenda,
            title: agendamento.tipo_consulta ?? "Consulta",
            start: start ?? new Date(),
            end: end,
            status: agendamento.status_sessao,
            observacoes: agendamento.observacoes,
        };
    });

    useEffect(() => {
            async function fetchAgendamentos() {
                try {
                    const agendamentos = await agendaService.listar();
                    setAgendamentos(agendamentos);

                    console.log("Agendamentos carregados:", agendamentos);

                } catch (error) {
                    console.error("Erro ao buscar agendamentos:", error);
                }
            }

            fetchAgendamentos();
        }, []);

    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Agenda"
                subtitle="Gerencie seus horários e consultas"
            >
                <Button type="button" icon="add" onClick={() => setModalAberto(true)}>
                    Nova Consulta
                </Button>
            </Header>

            {modalAberto ? (
                <FormularioAgenda onClose={() => setModalAberto(false)} />
            ) : null}

            <div className={styles["calendar-container"]}>
                <Calendar
                    localizer={localizer}
                    date={dataAtual}
                    onNavigate={(novaData) => setDataAtual(novaData)}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="week"
                    views={["month", "week", "day"]}
                    step={30}
                    timeslots={2}
                    style={{ height: 700 }}
                    culture="pt-BR"
                    messages={mensagens}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.status === "Agendada" ? "#5B9BD5" : "#7E8A97",
                            borderRadius: "8px",
                            border: "none",
                            color: "#fff",
                        },
                    })}
                />
            </div>
        </div>
    );
}