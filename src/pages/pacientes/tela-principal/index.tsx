import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from './pacientes.module.css';

type Paciente = {
    paciente: string;
    contato: string;
    tipo: string;
    ultimaConsulta: string;
    status: string;
    acoes: string;
};

const pacientes: Paciente[] = [
    {
        paciente: "Ana Souza",
        contato: "(11) 99999-1111",
        tipo: "Particular",
        ultimaConsulta: "08/07/2026",
        status: "Em dia",
        acoes: "Ver",
    },
    {
        paciente: "Bruno Lima",
        contato: "(11) 98888-2222",
        tipo: "Convênio",
        ultimaConsulta: "05/07/2026",
        status: "Atrasado",
        acoes: "Ver",
    },
    {
        paciente: "Carla Mendes",
        contato: "(11) 97777-3333",
        tipo: "Particular",
        ultimaConsulta: "01/07/2026",
        status: "Em dia",
        acoes: "Ver",
    },
];

export function Pacientes() {
    const navigate = useNavigate();

    return (
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
                            { key: "contato", header: "Contato" },
                            { key: "tipo", header: "Tipo" },
                            { key: "ultimaConsulta", header: "Última Consulta" },
                            { key: "status", header: "Status" },
                            { key: "acoes", header: "Ações" },
                        ]}
                        data={pacientes}
                    />
                </div>
            </Card>
        </div>
    )
}