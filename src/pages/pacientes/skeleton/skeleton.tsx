import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card } from "../../../components/ui/card";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import styles from "./skeleton.module.css";

export function SkeletonPacientes() {
    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Pacientes"
                subtitle="Gerencie seus pacientes e acompanhe histórico"
            >
                <Button icon="add" disabled>
                    Novo Paciente
                </Button>
            </Header>

            <Card>
                <div className={styles["container-pesquisa"]}>
                    <Skeleton width={300} height={40} borderRadius={8} />

                    <div className={styles["tabela"]}>
                        {/* Cabeçalho */}
                        <div className={styles["linha-cabecalho"]}>
                            <Skeleton width={120} />
                            <Skeleton width={80} />
                            <Skeleton width={90} />
                            <Skeleton width={50} />
                        </div>

                        {/* Linhas */}
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className={styles["linha"]}
                            >
                                <Skeleton width="85%" />
                                <Skeleton width="80%" />
                                <Skeleton width="90%" />
                                <Skeleton width="40%" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}