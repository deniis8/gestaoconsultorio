import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Header } from "../../../components/layout/header";
import styles from "./formulario-agenda.module.css";
import { Combobox } from "../../../components/ui/combobox";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";

type FormularioAgendaProps = {
    onClose?: () => void;
};

export function FormularioAgenda({ onClose }: FormularioAgendaProps) {

    const [pacientes, setPacientes] = useState<{ label: string; value: string }[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");

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
                </div>
            </div>
        </div>
    );
}