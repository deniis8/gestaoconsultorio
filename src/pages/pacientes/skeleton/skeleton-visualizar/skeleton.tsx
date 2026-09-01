import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Header } from "../../../../components/layout/header";
import { Card } from "../../../../components/ui/card";
import styles from "./skeleton.module.css";

export function SkeletonVisualizarPaciente() {
    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Paciente"
                subtitle="Informações do paciente"
            />

            <Card
                title="Dados pessoais"
                actions={<Skeleton width={76} height={36} borderRadius={6} />}
            >
                <div className={styles.informacoes}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className={styles.campo}>
                            <Skeleton width={index % 2 === 0 ? 110 : 150} height={16} />
                            <Skeleton width="100%" height={22} />
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Plano do Paciente">
                <div className={styles.informacoes}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={styles.campo}>
                            <Skeleton width={index % 3 === 0 ? 160 : 120} height={16} />
                            <Skeleton width="100%" height={22} />
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Observações">
                <div className={styles.informacoes}>
                    <div className={styles.campo}>
                        <Skeleton width={200} height={16} />
                        <Skeleton width="100%" height={22} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
