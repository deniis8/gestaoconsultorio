import { useState } from "react";
import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import styles from "./relatorios.module.css";
import { RelatorioAtendimentos } from "./relatorio-atendimentos";
import { RelatorioFinanceiro } from "./relatorio-financeiro";

type TipoRelatorio = "atendimentos" | "financeiro";

export function Relatorios() {
    const [tipoSelecionado, setTipoSelecionado] = useState<TipoRelatorio>("atendimentos");

    return (
        <div className={styles['container-principal']}>
            <Header
                title="Relatórios"
                subtitle="Análises e indicadores do consultório"
            />

            <div className={styles["seletor-tipo"]}>
                <Button
                    variant={tipoSelecionado === "atendimentos" ? "primary" : "secondary"}
                    onClick={() => setTipoSelecionado("atendimentos")}
                >
                    Atendimentos
                </Button>
                <Button
                    variant={tipoSelecionado === "financeiro" ? "primary" : "secondary"}
                    onClick={() => setTipoSelecionado("financeiro")}
                >
                    Financeiro
                </Button>
            </div>

            {tipoSelecionado === "atendimentos" ? <RelatorioAtendimentos /> : <RelatorioFinanceiro />}
        </div>
    )
}