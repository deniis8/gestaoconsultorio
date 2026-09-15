import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input-comum"
import styles from "./login.module.css"
import { LuBrain } from "react-icons/lu";
import { login } from "../../services/auth/authService";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/layout/loading";

export function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading, navigate]);

    if (loading || user) {
        return <Loading loading={true} />;
    }

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();

        if (loadingLogin) return;

        try {
            setLoginError(false);
            setLoadingLogin(true);
            await login(email.trim(), password);
            navigate("/dashboard");
        } catch (error) {
            setLoginError(true);
            setPassword("");
            console.error("Erro ao efetuar login:", error);
        } finally {
            setLoadingLogin(false);
        }
    }

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["header"]}>
                    <div className={styles["icone"]}>
                        <div className={styles["logo"]}>
                            <LuBrain size={25} />
                        </div>

                        <span className={styles["my-app"]}>Cammis</span>
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

                    <div className={styles["tags"]}>
                        <span className={styles["tags-itens"]}>Agenda inteligente</span>
                        <span className={styles["tags-itens"]}>Cobrança automática</span>
                        <span className={styles["tags-itens"]}>Financeiro</span>
                        <span className={styles["tags-itens"]}>Relatórios</span>
                    </div>
                    <div className={styles["footer"]}>
                        <span>© 2026 Cammis. Todos os direitos reservados.</span>
                    </div>

                </div>
                <div className={styles["formulario"]}>
                    <div className={styles["formulario-login"]}>
                        <div className={styles["header-login"]}>
                            <h1 className={styles['h1-header-login']}>Bem-vinda de volta</h1>
                            <h2 className={styles['h2-header-login']}>Entre com sua conta para continuar</h2>
                        </div>

                        <form className={styles['inputs']} onSubmit={handleLogin}>
                            <Input
                                name="E-mail"
                                type="email"
                                value={email}
                                error={loginError}
                                icon="email"
                                autoComplete="email"
                                disabled={loadingLogin}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className={styles["senha"]}>
                                <Input
                                    name="Senha"
                                    type="password"
                                    value={password}
                                    error={loginError}
                                    icon="password"
                                    autoComplete="current-password"
                                    disabled={loadingLogin}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={styles["button-senha"]}
                                >Esqueci minha senha</button>
                            </div>
                            {loginError && (
                                <div className={styles["dados-invalidos"]}>
                                    <IoCloseCircleOutline className={styles["icone-invalido"]} />
                                    <span className={styles["texto-invalido"]}>Dados de acesso inválidos.</span>
                                </div>
                            )}
                            <Button type="submit" disabled={loadingLogin}>Entrar</Button>
                        </form>
                    </div>
                </div>
            </div>
            <Loading loading={loadingLogin} />
        </>

    )
}