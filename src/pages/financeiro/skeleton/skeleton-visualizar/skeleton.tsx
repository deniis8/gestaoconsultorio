import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Header } from "../../../../components/layout/header";
import { Card } from "../../../../components/ui/card";
import styles from "./skeleton.module.css";

export function SkeletonVisualizarFinanceiro() {
    return (
        <>
            <Header
                title="Lançamento Financeiro"
                subtitle="Informações do lançamento"
            />

            <Card
                title="Dados do Lançamento"
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
        </>
    );
}
