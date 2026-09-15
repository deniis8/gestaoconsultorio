import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import styles from "./visualizacao-financeiro.module.css";
import { financeiroService } from "../../../services/apis-supabase/financeiro/financeiro.service";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { Financeiro } from "../../../types/financeiro/financeiro.types";
import { formatSimpleDate } from "../../../utils/dataFormat";
import { mascaraMoney } from "../../../utils/moneyFormat";
import { formatarOrigemFinanceiro } from "../../../utils/financeiroFormat";
import { SkeletonVisualizarFinanceiro } from "../skeleton/skeleton-visualizar/skeleton";

export function VisualizacaoFinanceiro() {
    const navigate = useNavigate();
    const { id_financeiro: idFinanceiro } = useParams();
    const [financeiro, setFinanceiro] = useState<Financeiro | null>(null);
    const [nomePaciente, setNomePaciente] = useState("");
    const [loadingFinanceiro, setLoadingFinanceiro] = useState(false);

    useEffect(() => {
        if (!idFinanceiro) return;

        async function carregarFinanceiro() {
            try {
                setLoadingFinanceiro(true);
                const [registro] = await financeiroService.buscarPorId(idFinanceiro!);

                if (registro) {
                    setFinanceiro(registro);

                    if (registro.id_paciente_plano) {
                        const [pacientePlano] = await pacientePlanoService.buscarPorIdPacientePlano(registro.id_paciente_plano);
                        if (pacientePlano?.id_paciente) {
                            const [paciente] = await pacientesService.buscarPorId(pacientePlano.id_paciente);
                            setNomePaciente(paciente?.nome_completo ?? "");
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar lançamento financeiro:", error);
            } finally {
                setLoadingFinanceiro(false);
            }
        }

        carregarFinanceiro();
    }, [idFinanceiro]);

    if (loadingFinanceiro) {
        return <SkeletonVisualizarFinanceiro />;
    }

    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Financeiro"
                subtitle="Informações do lançamento"
            />
            <Card
                title="Dados do Lançamento"
                actions={
                    <Button
                        variant="secondary"
                        icon="edit"
                        onClick={() => navigate(`/financeiro/formulario/${financeiro?.id_financeiro}`)}
                    >
                        Editar
                    </Button>
                }
            >
                <div className={styles.informacoes}>
                    <Label name="Paciente" value={nomePaciente} />
                    <Label name="Descrição" value={financeiro?.descricao ?? ""} />
                    <Label name="Origem" value={formatarOrigemFinanceiro(financeiro?.origem)} />
                    <Label name="Valor" value={financeiro?.valor != null ? mascaraMoney(financeiro.valor.toString()) : ""} />
                    <Label name="Data de Vencimento" value={financeiro?.data_vencimento ? formatSimpleDate(financeiro.data_vencimento) : ""} />
                    <Label name="Data de Pagamento" value={financeiro?.data_pagamento ? formatSimpleDate(financeiro.data_pagamento) : "-"} />
                    <Label name="Status" value={financeiro?.status ?? ""} />
                    <Label name="Observações" value={financeiro?.observacoes ?? ""} />
                </div>
            </Card>
        </div>
    );
}
