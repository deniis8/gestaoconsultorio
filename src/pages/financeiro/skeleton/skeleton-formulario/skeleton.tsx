import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./skeleton.module.css";

export function SkeletonFormFinanceiro() {
    return (
        <div className={styles["container-skeleton"]}>
            <div className={styles["card-skeleton"]}>
                <Skeleton width={160} height={18} style={{ marginBottom: 8 }} />

                <div className={styles["campo"]}>
                    <Skeleton width="100%" height={42} borderRadius={8} />
                </div>

                <div className={styles["linha-campo"]}>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                </div>

                <div className={styles["linha-campo"]}>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                </div>

                <div className={styles["campo"]}>
                    <Skeleton width="100%" height={90} borderRadius={8} />
                </div>
            </div>

            <div className={styles["linha-botao"]}>
                <Skeleton width={100} height={40} borderRadius={8} />
                <Skeleton width={100} height={40} borderRadius={8} />
            </div>
        </div>
    );
}
