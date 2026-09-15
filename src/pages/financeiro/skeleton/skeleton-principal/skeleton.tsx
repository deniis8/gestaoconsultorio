import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./skeleton.module.css";

export function SkeletonFinanceiro() {
    return (
        <div className={styles["container-pesquisa"]}>
            <div className={styles["tabela"]}>
                <div className={styles["linha-cabecalho"]}>
                    <Skeleton width={100} />
                    <Skeleton width={140} />
                    <Skeleton width={80} />
                    <Skeleton width={60} />
                    <Skeleton width={70} />
                    <Skeleton width={60} />
                </div>

                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className={styles["linha"]}>
                        <Skeleton width="85%" />
                        <Skeleton width="90%" />
                        <Skeleton width="70%" />
                        <Skeleton width="60%" />
                        <Skeleton width="60%" />
                        <Skeleton width="50%" />
                    </div>
                ))}
            </div>
        </div>
    );
}
