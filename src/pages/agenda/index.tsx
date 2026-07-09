import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import styles from './agenda.module.css'

export function Agenda() {
    return (
        <div className={styles['container-principal']}>
            <Header
                title="Agenda"
                subtitle="Gerencie seus horários e consultas"
            >
                <Button type="submit" icon="add">Nova Consulta</Button>
            </Header>
        </div>
    )
}