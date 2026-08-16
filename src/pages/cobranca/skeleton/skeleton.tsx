import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./skeleton.module.css";

export function SkeletonPlanoCobranca() {
    return (
        <div className={styles["container-skeleton"]}>

            {/* Card - Nome do plano */}
            <div className={styles["card-skeleton"]}>
                <Skeleton
                    width="100%"
                    height={16}
                    style={{ marginBottom: 8 }}
                />

                <Skeleton
                    width="100%"
                    height={42}
                    borderRadius={6}
                />
            </div>

            {/* Card - Forma de cobrança */}
            <div className={styles["card-skeleton"]}>

                <Skeleton
                    width={150}
                    height={18}
                    style={{ marginBottom: 16 }}
                />

                <div className={styles["formas-cobranca"]}>

                    {/* Sessão */}
                    <div className={styles["cobranca-item"]}>
                        <Skeleton
                            circle
                            width={40}
                            height={40}
                        />

                        <div className={styles["cobranca-textos"]}>
                            <Skeleton
                                width={90}
                                height={16}
                            />

                            <Skeleton
                                width={180}
                                height={14}
                            />
                        </div>
                    </div>

                    {/* Pacote */}
                    <div className={styles["cobranca-item"]}>
                        <Skeleton
                            circle
                            width={40}
                            height={40}
                        />

                        <div className={styles["cobranca-textos"]}>
                            <Skeleton
                                width={70}
                                height={16}
                            />

                            <Skeleton
                                width={180}
                                height={14}
                            />
                        </div>
                    </div>

                    {/* Mensal */}
                    <div className={styles["cobranca-item"]}>
                        <Skeleton
                            circle
                            width={40}
                            height={40}
                        />

                        <div className={styles["cobranca-textos"]}>
                            <Skeleton
                                width={75}
                                height={16}
                            />

                            <Skeleton
                                width={180}
                                height={14}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Card - Valor e sessões */}
            <div className={styles["card-skeleton"]}>

                <div className={styles["inputs-valor"]}>

                    <div className={styles["campo"]}>
                        <Skeleton
                            width={150}
                            height={16}
                            style={{ marginBottom: 8 }}
                        />

                        <Skeleton
                            width="100%"
                            height={42}
                            borderRadius={6}
                        />
                    </div>

                    <div className={styles["campo"]}>
                        <Skeleton
                            width={150}
                            height={16}
                            style={{ marginBottom: 8 }}
                        />

                        <Skeleton
                            width="100%"
                            height={42}
                            borderRadius={6}
                        />
                    </div>

                </div>

            </div>

            {/* Card - Toggle */}
            <div className={styles["card-skeleton"]}>

                <div className={styles["toggle-skeleton"]}>

                    <div>
                        <Skeleton
                            width={100}
                            height={16}
                        />

                        <Skeleton
                            width={380}
                            height={14}
                            style={{ marginTop: 8 }}
                        />
                    </div>

                    <Skeleton
                        width={44}
                        height={24}
                        borderRadius={20}
                    />

                </div>

            </div>

            {/* Botões */}
            <div className={styles["linha-botao"]}>
                <Skeleton
                    width={100}
                    height={40}
                    borderRadius={8}
                />

                <Skeleton
                    width={100}
                    height={40}
                    borderRadius={8}
                />
            </div>

        </div>
    );
}