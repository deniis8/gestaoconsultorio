import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from "./cobranca.module.css";
import { useEffect, useState } from "react";
import { planosCobrancaService } from "../../../services/apis-supabase/planos-cobranca/planos-cobranca.service";
import { PlanosCobranca } from "../../../types/planos-cobranca/planos-cobranca.types";
import { SkeletonPlanosCobranca } from "../skeleton/skeleton-principal/skeleton";
import { mascaraMoney } from "../../../utils/moneyFormat";

const LABELS_FORMA_COBRANCA: Record<string, string> = {
    SESSAO: "Por Sessão",
    PACOTE: "Pacote",
    MENSAL: "Mensal",
};

export function PlanoCobranca() {

    const navigate = useNavigate();
    const [planosCobranca, setPlanosCobranca] = useState<PlanosCobranca[]>([]);
    const [loadingCobranca, setLoadingCobranca] = useState(true);
    const [nomePesquisado, setNomePesquisado] = useState("");

    useEffect(() => {
        async function carregarPlanos() {
            try {
                setLoadingCobranca(true);
                const planos = await planosCobrancaService.listar();
                setPlanosCobranca(planos);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            } finally {
                setLoadingCobranca(false);
            }
        }
        carregarPlanos();
    }, []);

    const handleRowClick = (id_plano: string) => {
        navigate(`/planos-cobranca/visualizacao/${id_plano}`);
    }

    const handleSearch = async (searchTerm: string) => {
        try {
            setLoadingCobranca(true);
            const planos = await planosCobrancaService.buscarPorNome(searchTerm);
            setPlanosCobranca(planos);
        } catch (error) {
            console.error("Erro ao buscar planos:", error);
        } finally {
            setLoadingCobranca(false);
        }
    };

    return (
        <div className={styles['container-principal']}>
            <Header
                title="Planos de Cobrança"
                subtitle="Modelos de cobrança disponíveis para vincular aos pacientes"
            >
                <Button type="submit" icon="add" onClick={() => navigate("/planos-cobranca/formulario")}>Novo Plano</Button>
            </Header>

            <Card>
                <div className={styles['container-pesquisa']}>
                    <div className={styles['pesquisar']}>
                        <InputPesquisar
                            placeholder="Buscar planos"
                            value={nomePesquisado}
                            onChange={(e) => setNomePesquisado(e.target.value)}
                        />
                        <Button type="submit" icon="search" onClick={() => handleSearch(nomePesquisado)}>Buscar</Button>
                    </div>

                    {loadingCobranca ? (
                        <SkeletonPlanosCobranca />
                    ) : (
                        <Table
                            columns={[
                                { key: "nome", header: "Nome" },
                                { key: "formaCobranca", header: "Forma de Cobrança" },
                                { key: "valorPadrao", header: "Valor Padrão" },
                                { key: "sessoesPadrao", header: "Sessões no Pacote" },
                                { key: "status", header: "Status" },
                            ]}
                            data={planosCobranca.map((plano) => ({
                                id_plano_cobranca: plano.id_plano_cobranca ?? "",
                                nome: plano.nome,
                                formaCobranca: LABELS_FORMA_COBRANCA[plano.forma_cobranca] ?? plano.forma_cobranca,
                                valorPadrao: mascaraMoney(plano.valor_padrao?.toString() || ""),
                                sessoesPadrao: plano.quantidade_padrao_sessoes,
                                status: plano.ativo ? "Ativo" : "Inativo",
                            }))}
                            onRowClick={(item) => {
                                handleRowClick(item.id_plano_cobranca ?? "");
                            }}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}