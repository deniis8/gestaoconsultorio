import { Header } from "../../components/layout/header";
import styles from "./financeiro.module.css";

export function Financeiro() {
    return (
        <div>
            <div className={styles['container-principal']}>
            <Header
                title="Financeiro"
                subtitle="Controle de pagamentos e receitas"
            >
            </Header>
        </div>
        </div>
    )
}