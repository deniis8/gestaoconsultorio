import { Header } from "../../components/layout/header"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input-comum"
import styles from "./login.module.css"
import { LuBrain } from "react-icons/lu";

export function Login() {

    return (
        <div className={styles["container-login"]}>
            <div className={styles["login-detalhamento"]}>
                <div className={styles["login-icone"]}>
                    <div className={styles["logo"]}>
                        <LuBrain size={25} />
                    </div>
                    
                    <span className={styles["nome-cammis"]}>Cammis</span>
                </div>
                <div className={styles["login-descricao"]}>
                    <h1 className={styles["login-h1"]}>Gestão do seu
                        consultório em um
                        só lugar.
                    </h1>
                    <h4 className={styles["login-h4"]}>
                        Agenda, pacientes, planos de cobrança e financeiro — tudo integrado para você focar no que importa.
                    </h4>
                </div>

            </div>
            <div className={styles["login"]}>
                <Header title="Bem-vinda de volta" subtitle="Entre com sua conta para continuar"></Header>
                <Input name="E-mail"></Input>
                <Input name="Senha"></Input>
                <Button className={styles["button-login-entrar"]}>Entrar</Button>
            </div>
        </div>
    )
}