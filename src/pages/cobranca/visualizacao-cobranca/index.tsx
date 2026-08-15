import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Skeletonfiguracoes } from "../../configuracoes/skeleton/skeleton";
import { PlanosCobranca } from "../../../types/planos-cobranca/planos-cobranca.types";
import { planosCobrancaService } from "../../../services/planos-cobranca/planos-cobranca.service";
import styles from "./visualizacao-cobranca.module.css";


export function PlanoCobrancaVisualizacao() {
    const navigate = useNavigate();
    const [planoCobraca, setPlanoCobranca] = useState<PlanosCobranca | null>(null);
    const [loadingPlanoCobranca, setLoadingPlanoCobranca] = useState(false);

    useEffect(() => {
        async function carregarPlanoCobranca() {
            try {
                setLoadingPlanoCobranca(true);
                const plano = await planosCobrancaService.buscarPorId(window.location.pathname.split("/").pop() || "");
                if (plano.length > 0) {
                    setPlanoCobranca(plano[0]);
                }
                console.log(plano);
            } catch (error) {
                console.error("Erro ao buscar planos de cobrança:", error);
            } finally {
                setLoadingPlanoCobranca(false);
            }
        }
        carregarPlanoCobranca();
    }, [])

    return (
        loadingPlanoCobranca ? (
            <Skeletonfiguracoes />) : (
            <div className={styles['container-principal']}>
                <div>
                    <Header
                        title="Planos de Cobrança"
                        subtitle="Modelos de cobrança disponíveis para vincular aos pacientes"
                    >
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
                        <Label name="Valor Padrão" value={planoCobraca?.valor_padrao?.toString() ?? ""} />
                        <Label name="Quantidade Padrão de Sessões" value={planoCobraca?.quantidade_padrao_sessoes?.toString() ?? ""} />
                        <Label name="Ativo" value={planoCobraca?.ativo ? "Sim" : "Não"} />
                    </div>
                </Card>
            </div>
        )
    )
}