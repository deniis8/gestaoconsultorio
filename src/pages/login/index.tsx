import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input-comum"
import styles from "./login.module.css"
import { LuBrain } from "react-icons/lu";

export function Login() {

    return (
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <div className={styles["icone"]}>
                    <div className={styles["logo"]}>
                        <LuBrain size={25} />
                    </div>

                    <span className={styles["software"]}>Cammis</span>
                </div>
                <div className={styles["titles"]}>
                    <h1 className={styles["h1-header"]}>Gestão do seu
                        consultório em um
                        só lugar.
                    </h1>
                    <h4 className={styles["h4-header"]}>
                        Agenda, pacientes, planos de cobrança e financeiro — tudo integrado para você focar no que importa.
                    </h4>
                </div>

            </div>
            <div className={styles["formulario"]}>
                <div className={styles["formulario-login"]}>
                    <div className={styles["header-login"]}>
                        <h1 className={styles['h1-header-login']}>Bem-vinda de volta</h1>
                        <h2 className={styles['h2-header-login']}>Entre com sua conta para continuar</h2>
                    </div>

                    <div className={styles['inputs']}>
                        <Input name="E-mail"></Input>
                        <Input name="Senha"></Input>
                        <Button>Entrar</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}