import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { pacientesService } from "../../../services/pacientes/pacientes.service";
import styles from "./visualizacao-pacientes.module.css";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { Header } from "../../../components/layout/header";

export function VisualizacaoPacientes() {

    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loadingPaciente, setLoadingPaciente] = useState(false);

    useEffect(() => {
        async function carregarPaciente() {
            try {
                setLoadingPaciente(true);
                const paciente = await pacientesService.buscarPorId(window.location.pathname.split("/").pop() || "");
                console.log("paciente", paciente);
                if (paciente.length > 0) {
                    setPaciente(paciente[0]);
                }
                console.log(paciente);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            } finally {
                setLoadingPaciente(false);
            }
        }
        carregarPaciente();
    }, [])

    return (
        loadingPaciente ? (
            null) : (
            <div className={styles['container-principal']}>
                <div>
                    <Header
                        title="Paciente"
                        subtitle="Informações do paciente"
                    >
                    </Header>
                </div>
                <Card title="Dados pessoais"
                    actions={
                        <Button
                            variant="secondary"
                            icon="edit"
                            onClick={() => navigate(`/pacientes/formulario/${paciente?.id_paciente}`)}
                        >
                            Editar
                        </Button>
                    }
                >
                    <div className={styles.informacoes}>
                        <Label name="Nome do Paciente" value={paciente?.nome_completo ?? ""} />
                        <Label name="Data de Nascimento" value={paciente?.data_nascimento?.toString() ?? ""} />
                        <Label name="CPF" value={paciente?.cpf ?? ""} />
                        <Label name="Telefone Principal" value={paciente?.telefone_principal ?? ""} />
                        <Label name="Telefone Secundário" value={paciente?.telefone_secundario ?? ""} />
                        <Label name="Email" value={paciente?.email ?? ""} />
                        <Label name="CEP" value={paciente?.cep ?? ""} />
                        <Label name="Logradouro" value={paciente?.logradouro ?? ""} />
                        <Label name="Número" value={paciente?.numero ?? ""} />
                        <Label name="Complemento" value={paciente?.complemento ?? ""} />
                        <Label name="Bairro" value={paciente?.bairro ?? ""} />
                        <Label name="Cidade" value={paciente?.cidade ?? ""} />
                        <Label name="Estado" value={paciente?.estado ?? ""} />
                    </div>
                </Card>
                <Card title="Plano do Paciente">

                </Card>

                <Card title="Observações">
                    <div className={styles.informacoes}>
                        <Label name="Observações Administrativas" value={paciente?.observacoes_administrativas ?? ""} />
                    </div>
                </Card>
            </div>
        )
    )
}