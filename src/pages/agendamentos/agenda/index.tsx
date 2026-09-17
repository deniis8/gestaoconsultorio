import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./agenda.module.css";
import { agendaService } from "../../../services/apis-supabase/agenda/agenda.service";
import { useCallback, useEffect, useState } from "react";
import { Agenda } from "../../../types/agenda/agenda.types";
import { FormularioAgenda, SlotSelecionado } from "../formulario-agenda";
import { CORES_STATUS_AGENDA } from "../../../utils/agendaFormat";

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

const LEGENDA_STATUS = Object.entries(CORES_STATUS_AGENDA).map(([status, cor]) => ({ status, cor }));

type EventoAgenda = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    status?: string;
    observacoes?: string;
};

type ModalAgendaState =
    | { modo: "fechado" }
    | { modo: "criacao"; slot?: SlotSelecionado }
    | { modo: "edicao"; idAgenda: string };

const ehTelaPequena = () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

export function Agendamentos() {

    const [agendamentos, setAgendamentos] = useState<Agenda[] | null>(null);
    const [view, setView] = useState<View>(() => (ehTelaPequena() ? "day" : "week"));
    const [dataAtual, setDataAtual] = useState(new Date());
    const [modalAgenda, setModalAgenda] = useState<ModalAgendaState>({ modo: "fechado" });

    const eventos: EventoAgenda[] = (agendamentos ?? []).map((agendamento) => ({
        id: agendamento.id_agenda ?? "",
        title: agendamento.tipo_consulta ?? "Consulta",
        start: agendamento.hora_inicio ? new Date(agendamento.hora_inicio as string) : new Date(),
        end: agendamento.hora_fim ? new Date(agendamento.hora_fim as string) : new Date(),
        status: agendamento.status_sessao,
        observacoes: agendamento.observacoes,
    }));

    const fetchAgendamentos = useCallback(async () => {
        try {
            const agendamentos = await agendaService.listar();
            setAgendamentos(agendamentos);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        }
    }, []);

    useEffect(() => {
        fetchAgendamentos();
    }, [fetchAgendamentos]);

    const fecharModal = () => setModalAgenda({ modo: "fechado" });

    const handleSalvo = () => {
        fecharModal();
        fetchAgendamentos();
    };

    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Agenda"
                subtitle="Gerencie seus horários e consultas"
            >
                <Button type="button" icon="add" onClick={() => setModalAgenda({ modo: "criacao" })}>
                    Nova Consulta
                </Button>
            </Header>

            {modalAgenda.modo !== "fechado" ? (
                <FormularioAgenda
                    idAgenda={modalAgenda.modo === "edicao" ? modalAgenda.idAgenda : undefined}
                    slotSelecionado={modalAgenda.modo === "criacao" ? modalAgenda.slot : undefined}
                    onClose={fecharModal}
                    onSalvo={handleSalvo}
                />
            ) : null}

            <div className={styles["calendar-container"]}>
                <div className={styles["legenda"]}>
                    {LEGENDA_STATUS.map(({ status, cor }) => (
                        <span key={status} className={styles["legenda-item"]}>
                            <span className={styles["legenda-ponto"]} style={{ backgroundColor: cor }} />
                            {status}
                        </span>
                    ))}
                </div>

                <Calendar
                    localizer={localizer}
                    date={dataAtual}
                    onNavigate={(novaData) => setDataAtual(novaData)}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={setView}
                    views={["month", "week", "day"]}
                    step={30}
                    timeslots={2}
                    style={{ height: 640 }}
                    culture="pt-BR"
                    messages={mensagens}
                    selectable
                    onSelectSlot={(slotInfo) => setModalAgenda({ modo: "criacao", slot: { start: slotInfo.start, end: slotInfo.end } })}
                    onSelectEvent={(evento) => {
                        const id = (evento as EventoAgenda).id;
                        if (id) setModalAgenda({ modo: "edicao", idAgenda: id });
                    }}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: CORES_STATUS_AGENDA[(event as EventoAgenda).status ?? ""] ?? "#5B9BD5",
                            borderRadius: "6px",
                            border: "none",
                            color: "#fff",
                        },
                    })}
                />
            </div>
        </div>
    );
}
