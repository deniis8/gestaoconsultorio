import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from "./cobranca.module.css";

export function PlanoCobranca() {

    const navigate = useNavigate();

    const planos = [
        {
            id: 1,
            nome: "Sessão Avulsa",
            formaCobranca: "Por sessão",
            valorPadrao: "R$ 180,00",
            sessoesPadrao: "-",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "Plano Mensal - 4 Sessões",
            formaCobranca: "Mensal",
            valorPadrao: "R$ 700,00",
            sessoesPadrao: 4,
            status: "Ativo",
        },
        {
            id: 3,
            nome: "Plano Mensal - 8 Sessões",
            formaCobranca: "Mensal",
            valorPadrao: "R$ 1.350,00",
            sessoesPadrao: 8,
            status: "Ativo",
        },
        {
            id: 4,
            nome: "Pacote 10 Sessões",
            formaCobranca: "Pacote",
            valorPadrao: "R$ 1.600,00",
            sessoesPadrao: 10,
            status: "Ativo",
        },
        {
            id: 5,
            nome: "Pacote 20 Sessões",
            formaCobranca: "Pacote",
            valorPadrao: "R$ 3.000,00",
            sessoesPadrao: 20,
            status: "Ativo",
        },
        {
            id: 6,
            nome: "Atendimento Social",
            formaCobranca: "Por sessão",
            valorPadrao: "R$ 80,00",
            sessoesPadrao: "-",
            status: "Inativo",
        },
    ];

    return (
        <div className={styles['container-principal']}>
            <Header
                title="Planos de Cobrança"
                subtitle="Modelos de cobrança disponíveis para vincular aos pacientes"
            >
                <Button type="submit" icon="add" onClick={() => navigate("/planos-cobranca/novo")}>Novo Plano</Button>
            </Header>

            <Card>
                <div className={styles['container-pesquisa']}>
                    <InputPesquisar placeholder="Buscar planos" />
                    <Table
                        columns={[
                            { key: "nome", header: "Nome" },
                            { key: "formaCobranca", header: "Forma de Cobrança" },
                            { key: "valorPadrao", header: "Valor Padrão" },
                            { key: "sessoesPadrao", header: "Sessões Padrão" },
                            { key: "status", header: "Status" },
                        ]}
                        data={planos}
                    />
                </div>
            </Card>
        </div>
    )
}