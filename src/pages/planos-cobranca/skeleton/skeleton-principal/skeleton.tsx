import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card } from "../../../../components/ui/card";
import { Header } from "../../../../components/layout/header";
import styles from "./skeleton.module.css";

export function SkeletonPlanosCobranca() {
    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Planos de Cobrança"
                subtitle="Modelos de cobrança disponíveis para vincular aos pacientes"
            >
                <Skeleton width={110} height={40} borderRadius={8} />
            </Header>

            <Card>
                <div className={styles["container-pesquisa"]}>
                    <Skeleton width={300} height={40} borderRadius={8} />

                    <div className={styles["tabela"]}>
                        <div className={styles["linha-cabecalho"]}>
                            <Skeleton width="70%" />
                            <Skeleton width="75%" />
                            <Skeleton width="70%" />
                            <Skeleton width="80%" />
                            <Skeleton width="55%" />
                        </div>

                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className={styles["linha"]}>
                                <Skeleton width="85%" />
                                <Skeleton width="80%" />
                                <Skeleton width="75%" />
                                <Skeleton width="80%" />
                                <Skeleton width="50%" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
