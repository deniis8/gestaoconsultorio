import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./skeleton.module.css";

export function SkeletonFormPaciente() {
    return (
        <div className={styles["container-skeleton"]}>
            <div className={styles["card-skeleton"]}>
                <Skeleton width={160} height={18} style={{ marginBottom: 16 }} />

                <div className={styles["linha-campo"]}>
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

                <div className={styles["linha-campo"]}>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                </div>

                <div className={styles["campo"]}>
                    <Skeleton width="100%" height={42} borderRadius={8} />
                </div>

                <div className={styles["linha-campo-metade"]}>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                </div>

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

                <div className={styles["linha-campo-metade"]}>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                </div>
            </div>

            <div className={styles["card-skeleton"]}>
                <Skeleton width={170} height={18} style={{ marginBottom: 16 }} />

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

                <div className={styles["linha-campo-metade"]}>
                    <div className={styles.campo}>
                        <Skeleton width="100%" height={42} borderRadius={8} />
                    </div>
                </div>
            </div>

            <div className={styles["card-skeleton"]}>
                <Skeleton width={120} height={18} style={{ marginBottom: 16 }} />
                <Skeleton width="100%" height={110} borderRadius={8} />
            </div>

            <div className={styles["linha-botao"]}>
                <Skeleton width={100} height={40} borderRadius={8} />
                <Skeleton width={100} height={40} borderRadius={8} />
            </div>
        </div>
    );
}
