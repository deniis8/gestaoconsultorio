import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card } from "../../../../components/ui/card";
import styles from "./skeleton.module.css";

export function SkeletonPlanosCobranca() {
    return (
        <div className={styles["container-principal"]}>

            <Card>
                <div className={styles["container-pesquisa"]}>

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
