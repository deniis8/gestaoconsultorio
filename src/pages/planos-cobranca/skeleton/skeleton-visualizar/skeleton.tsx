import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Header } from "../../../../components/layout/header";
import { Card } from "../../../../components/ui/card";
import styles from "./skeleton.module.css";

export function SkeletonVisualizarCobranca() {
    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Planos de Cobrança"
                subtitle="Modelos de cobrança disponíveis para vincular aos pacientes"
            />

            <Card
                title="Informações do Plano de Cobrança"
                actions={<Skeleton width={76} height={36} borderRadius={6} />}
            >
                <div className={styles.informacoes}>
                    <div className={styles.campo}>
                        <Skeleton width={120} height={16} />
                        <Skeleton width="100%" height={22} />
                    </div>

                    <div className={styles.campo}>
                        <Skeleton width={130} height={16} />
                        <Skeleton width="100%" height={22} />
                    </div>

                    <div className={styles.campo}>
                        <Skeleton width={90} height={16} />
                        <Skeleton width="100%" height={22} />
                    </div>

                    <div className={styles.campo}>
                        <Skeleton width={190} height={16} />
                        <Skeleton width="100%" height={22} />
                    </div>

                    <div className={styles.campo}>
                        <Skeleton width={42} height={16} />
                        <Skeleton width={32} height={22} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
