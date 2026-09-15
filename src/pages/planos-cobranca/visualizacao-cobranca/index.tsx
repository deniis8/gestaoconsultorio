import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { PlanosCobranca } from "../../../types/planos-cobranca/planos-cobranca.types";
import { planosCobrancaService } from "../../../services/apis-supabase/planos-cobranca/planos-cobranca.service";
import { SkeletonVisualizarCobranca } from "../skeleton/skeleton-visualizar/skeleton";
import styles from "./visualizacao-cobranca.module.css";
import { mascaraMoney } from "../../../utils/moneyFormat";


export function PlanoCobrancaVisualizacao() {
    const navigate = useNavigate();
    const [planoCobraca, setPlanoCobranca] = useState<PlanosCobranca | null>(null);
    const [loadingPlanoCobranca, setLoadingPlanoCobranca] = useState(false);
    const { id_plano_cobranca } = useParams();

    useEffect(() => {
        if (!id_plano_cobranca) return;

        async function carregarPlanoCobranca() {
            try {
                setLoadingPlanoCobranca(true);
                const plano = await planosCobrancaService.buscarPorId(id_plano_cobranca!);
                if (plano.length > 0) {
                    setPlanoCobranca(plano[0]);
                }
            } catch (error) {
                console.error("Erro ao buscar planos de cobrança:", error);
            } finally {
                setLoadingPlanoCobranca(false);
            }
        }
        carregarPlanoCobranca();
    }, [id_plano_cobranca])

    return (
        loadingPlanoCobranca ? (
            <SkeletonVisualizarCobranca />) : (
            <div className={styles['container-principal']}>
                <div>
                    <Header
                        title="Planos de Cobrança"
                        subtitle="Modelos de cobrança disponíveis para vincular aos pacientes"
                    >
                        <Button type="submit" onClick={() => navigate(-1)} icon="back">Voltar</Button>
                    </Header>
                </div>
                <Card title="Informações do Plano de Cobrança"
                    actions={
                        <Button
                            variant="secondary"
                            icon="edit"
                            onClick={() => navigate(`/planos-cobranca/formulario/${planoCobraca?.id_plano_cobranca}`)}
                        >
                            Editar
                        </Button>
                    }
                >
                    <div className={styles.informacoes}>
                        <Label name="Nome do Pacote" value={planoCobraca?.nome ?? ""} />
                        <Label name="Forma de Cobrança" value={planoCobraca?.forma_cobranca ?? ""} />
                        <Label name="Valor Padrão" value={mascaraMoney(planoCobraca?.valor_padrao?.toString() ?? "")} />
                        <Label name="Quantidade Padrão de Sessões" value={planoCobraca?.quantidade_padrao_sessoes?.toString() ?? ""} />
                        <Label name="Ativo" value={planoCobraca?.ativo ? "Sim" : "Não"} />
                    </div>
                </Card>
            </div>
        )
    )
}