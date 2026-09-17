import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import styles from "./nao-encontrado.module.css";

export function NaoEncontrado() {
    const navigate = useNavigate();

    return (
        <div className={styles["container-principal"]}>
            <span className={styles.codigo}>404</span>
            <h1 className={styles.titulo}>Página não encontrada</h1>
            <p className={styles.subtitulo}>
                O endereço que você acessou não existe ou foi movido para outro lugar.
            </p>
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
                Voltar para o Dashboard
            </Button>
        </div>
    );
}
