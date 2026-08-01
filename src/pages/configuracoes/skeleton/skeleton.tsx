import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card } from "../../../components/ui/card";
import { Header } from "../../../components/layout/header";
import styles from "./skeleton.module.css"

export function Skeletonfiguracoes() {
    return (
        <div className={styles['container-principal']}>
            <div>
                <Header
                    title="Configurações"
                    subtitle="Personalize seu consultório e preferências"
                >
                </Header>
            </div>
            <Card title="Informações Pessoais">
                <div className={styles.informacoes}>

                    <div>
                        <Skeleton width={120} />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton width={50} />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton width={60} />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton width={70} />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton width={90} />
                        <Skeleton height={50} />
                    </div>

                </div>
            </Card>
        </div>
    );
}