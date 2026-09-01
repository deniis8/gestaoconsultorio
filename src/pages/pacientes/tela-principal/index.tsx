import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from "./pacientes.module.css";
import { useEffect, useState } from "react";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { SkeletonPacientes } from "../skeleton/skeleton-principal/skeleton";


type PacienteTableRow = {
    id_paciente: string;
    paciente: string;
    telefone: string;
    email: string;
    idade: string | number;
    original: Paciente;
};

export function Pacientes() {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState<Paciente[] | null>(null);
    const [loadingPacientes, setLoadingPacientes] = useState(true);
    const [nomePesquisado, setNomePesquisado] = useState("");

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
        id_paciente: paciente.id_paciente || "",
        paciente: paciente.nome_completo || "",
        telefone: paciente.telefone_principal || "",
        email: paciente.email || "",


        idade: paciente.data_nascimento
            ? new Date().getFullYear() -
            new Date(paciente.data_nascimento).getFullYear()
            : "N/A",


        original: paciente,
    }));


    const handleRowClick = (id_paciente: string) => {
        navigate(`/pacientes/visualizacao/${id_paciente}`);
    }

    const handleSearch = async (searchTerm: string) => {
        try {
            setLoadingPacientes(true);

            const pacientes = await pacientesService.buscarPorNome(searchTerm);

            setPacientes(pacientes);
        } catch (error) {
            console.error("Erro ao buscar pacientes:", error);
        } finally {
            setLoadingPacientes(false);
        }
    };

    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Pacientes"
                subtitle="Gerencie seus pacientes e acompanhe histórico"
            >
                <Button
                    type="submit"
                    onClick={() => navigate("/pacientes/formulario")}
                    icon="add"
                >
                    Novo Paciente
                </Button>
            </Header>

            <Card>
                <div className={styles["container-pesquisa"]}>
                    <div className={styles['pesquisar']}>
                        <InputPesquisar
                            placeholder="Buscar paciente"
                            value={nomePesquisado}
                            onChange={(e) => setNomePesquisado(e.target.value)}
                        />
                        <Button type="submit" icon="search" onClick={() => handleSearch(nomePesquisado)}>Buscar</Button>
                    </div>

                    {loadingPacientes ? (
                        <SkeletonPacientes />
                    ) : (
                        <Table
                            columns={[
                                {
                                    key: "paciente",
                                    header: "Paciente",
                                },
                                {
                                    key: "telefone",
                                    header: "Telefone",
                                },
                                {
                                    key: "email",
                                    header: "E-mail",
                                },
                                {
                                    key: "idade",
                                    header: "Idade",
                                },
                            ]}
                            data={rows}
                            onRowClick={(item) => {
                                handleRowClick(item.id_paciente ?? "");
                            }}
                        />
                    )}
                </div>
            </Card>
        </div>
    )
}