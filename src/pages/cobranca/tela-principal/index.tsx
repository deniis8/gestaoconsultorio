import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from "./cobranca.module.css";
import { useEffect, useState } from "react";
import { planosCobrancaService } from "../../../services/planos-cobranca/planos-cobranca.service";
import { PlanosCobranca } from "../../../types/planos-cobranca/planos-cobranca.types";

export function PlanoCobranca() {

    const navigate = useNavigate();
    const [planosCobranca, setPlanosCobranca] = useState<PlanosCobranca[]>([]);
    const [loadingCobranca, setLoadingCobranca] = useState(false);

    useEffect(() => {
        async function carregarPlanos() {
            try {
                setLoadingCobranca(true);
                const planos = await planosCobrancaService.listar();
                setPlanosCobranca(planos);
                console.log(planosCobranca);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            } finally {
                setLoadingCobranca(false);
            }
        }
        carregarPlanos();
    }, []);

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
                            { key: "sessoesPadrao", header: "Sessões no Pacote" },
                            { key: "status", header: "Status" },
                        ]}
                        data={planosCobranca.map((plano) => ({
                            nome: plano.nome,
                            formaCobranca: plano.forma_cobranca,
                            valorPadrao: plano.valor_padrao,
                            sessoesPadrao: plano.quantidade_padrao_sessoes,
                            status: plano.ativo ? "Ativo" : "Inativo",
                        }))}
                        onRowClick={(item) => {
                            alert(`Plano selecionado: ${item.nome}`);
                        }}
                    />
                </div>
            </Card>
        </div>
    )
}