import { Header } from "../../components/layout/header";
import styles from "./dashboard.module.css"

export function Dashboard() {
    return (
        <div className={styles['container-principal']}>
            <Header
                title="Dashboard"
                subtitle="Visão geral do consultório"
            >
            </Header>
        </div>
    )
}