import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card } from "../../../components/ui/card";
import styles from "./skeleton.module.css";

export function SkeletonDashboard() {
    return (
        <div>
            <div className={styles["linha-indicadores"]}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                        <div className={styles["card-skeleton"]}>
                            <Skeleton width={120} height={14} />
                            <Skeleton width={90} height={26} />
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles["linha-duas-colunas"]}>
                <Card title="Agenda de Hoje">
                    <div className={styles["card-skeleton"]}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} height={20} />
                        ))}
                    </div>
                </Card>
                <Card title="Distribuição por Plano">
                    <div className={styles["card-skeleton"]}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} height={20} />
                        ))}
                    </div>
                </Card>
            </div>

            <Card title="Resumo Financeiro">
                <div className={styles["linha-indicadores"]}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} height={18} />
                    ))}
                </div>
            </Card>

            <Card title="Receita dos Últimos Meses">
                <Skeleton height={220} />
            </Card>
        </div>
    );
}
