import { Header } from "../../components/layout/header";
import styles from "./relatorios.module.css";

export function Relatorios() {
    return (
        <div className={styles['container-principal']}>
            <Header
                title="Relatórios"
                subtitle="Análises e indicadores do consultório"
            >
            </Header>
        </div>
    )
}