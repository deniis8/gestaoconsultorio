import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from './pacientes.module.css';
import { useEffect, useState } from "react";
import { pacientesService } from "../../../services/pacientes/pacientes.service";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { SkeletonPacientes } from "../skeleton/skeleton";

type PacienteTableRow = {
    paciente: string;
    telefone: string;
    email: string;
    idade: string | number;
    original: Paciente;
};

export function Pacientes() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<Paciente[] | null>(null);
    const [loadingPacientes, setLoadingPacientes] = useState(false);

    useEffect(() => {
        async function fetchPacientes() {
            try {
                setLoadingPacientes(true);
                const pacientes = await pacientesService.listar();
                setPacientes(pacientes);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            } finally {
                setLoadingPacientes(false);
            }
        }
        fetchPacientes();
    }, []);

    const rows: PacienteTableRow[] = (pacientes || []).map((paciente) => ({
        paciente: paciente.nome_completo || "",
        telefone: paciente.telefone_principal || "",
        email: paciente.email || "",
        idade: paciente.data_nascimento ? new Date().getFullYear() - new Date(paciente.data_nascimento).getFullYear() : "N/A",
        original: paciente,
    }));

    const handleRowClick = (item: PacienteTableRow) => {
        alert(`Paciente selecionado: ${item.paciente}`);
    };

    return (
        loadingPacientes ? (
            <SkeletonPacientes />) : (
            <div className={styles['container-principal']}>
                <Header
                    title="Pacientes"
                    subtitle="Gerencie seus pacientes e acompanhe histórico"
                >
                    <Button type="submit" onClick={() => navigate('/pacientes/novo')} icon="add">Novo Paciente</Button>
                </Header>
                <Card>
                    <div className={styles['container-pesquisa']}>
                        <InputPesquisar placeholder="Buscar paciente" />
                        <Table
                            columns={[
                                { key: "paciente", header: "Paciente" },
                                { key: "telefone", header: "Telefone" },
                                { key: "email", header: "E-mail" },
                                { key: "idade", header: "Idade" }
                            ]}
                            data={rows}
                            onRowClick={handleRowClick}
                        />
                    </div>
                </Card>
            </div>
        )
    )
}