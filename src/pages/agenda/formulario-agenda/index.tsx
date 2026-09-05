import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Header } from "../../../components/layout/header";
import styles from "./formulario-agenda.module.css";
import { Combobox } from "../../../components/ui/combobox";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import { TextArea } from "../../../components/ui/textArea";

type FormularioAgendaProps = {
    onClose?: () => void;
};

const tiposConsulta = [
    { label: "Consulta Individual", value: "Consulta Individual" },
    { label: "Primeira Consulta", value: "Primeira Consulta" },
    { label: "Retorno", value: "Retorno" },
    { label: "Avaliação", value: "Avaliação" },
];

const statuses = [
    { label: "Agendado", value: "Agendado" },
    { label: "Confirmado", value: "Confirmado" },
    { label: "Realizado", value: "Realizado" },
    { label: "Cancelado", value: "Cancelado" },
    { label: "Falta", value: "Falta" },
];

const frequencias = [
    { label: "Sem recorrência", value: "Sem recorrência" },
    { label: "Semanal", value: "Semanal" },
    { label: "Quinzenal", value: "Quinzenal" },
    { label: "Mensal", value: "Mensal" },
];

export function FormularioAgenda({ onClose }: FormularioAgendaProps) {

    const [pacientes, setPacientes] = useState<{ label: string; value: string }[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");
    const [tipoConsultaSelecionado, setTipoConsultaSelecionado] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("");
    const [frequenciaSelecionada, setFrequenciaSelecionada] = useState("");
    useEffect(() => {
        async function fetchPacientes() {
            try {
                const pacientes = await pacientesService.listar();
                console.log("Pacientes buscados:", pacientes);
                setPacientes(
                    pacientes.map((paciente) => ({
                        label: paciente.nome_completo || "Paciente sem nome",
                        value: paciente.id_paciente ?? ""
                    }))
                );
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            }
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        fetchPacientes();

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <div className={styles.overlay} role="presentation">
            <div
                className={styles["modal-container"]}
                role="dialog"
                aria-modal="true"
                aria-label="Nova consulta"
            >
                <div className={styles["modal-header"]}>
                    <Header
                        title="Nova consulta"
                        subtitle="Cadastre um novo horário para o paciente"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        className={styles["close-button"]}
                    >
                        ×
                    </Button>
                </div>

                <div className={styles["modal-content"]}>
                    <Combobox
                        label="Paciente *"
                        name="paciente"
                        placeholder="Selecione o paciente"
                        value={pacienteSelecionado}
                        options={pacientes}
                        onChange={(event) => setPacienteSelecionado(event.target.value)}
                        disabled={pacientes.length === 0}
                    />
                    <div className={styles["linha-campo"]}>
                        <InputData
                            name="Data da consulta *"
                        />
                        <Input
                            name="Duração da consulta (em minutos) *"
                            type="number"
                            placeholder="Selecione a data da consulta"
                        />
                    </div>

                    <div className={styles["linha-campo"]}>
                        <InputData
                            name="Hora Início *"
                        />
                        <InputData
                            name="Hora Fim *"
                        />
                    </div>

                    <div className={styles["linha-campo"]}>
                        <Combobox
                            label="Tipo de Consulta *"
                            name="tipo_consulta"
                            placeholder="Selecione o tipo de consulta"
                            value={tipoConsultaSelecionado}
                            options={tiposConsulta}
                            onChange={(event) => setTipoConsultaSelecionado(event.target.value)}
                        />
                        <Combobox
                            label="Status *"
                            name="status_sessao"
                            placeholder="Selecione o status"
                            value={statusSelecionado}
                            options={statuses}
                            onChange={(event) => setStatusSelecionado(event.target.value)}
                        />
                    </div>
                    <Combobox
                        label="Frequência *"
                        name="frequencia"
                        placeholder="Selecione a frequência"
                        value={frequenciaSelecionada}
                        options={frequencias}
                        onChange={(event) => setFrequenciaSelecionada(event.target.value)}
                    />
                    <TextArea
                        name="Observações "
                    />

                    <div className={styles['linha-botao']}>
                        <Button variant="warning" onClick={onClose}>Cancelar</Button>
                        <Button variant="success" >Salvar Consulta</Button>
                    </div>

                </div>
            </div>
        </div>
    );
}