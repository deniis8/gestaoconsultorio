import { ClipLoader } from "react-spinners";
import styles from "./loading.module.css";

interface LoadingProps {
    loading: boolean;
}

export function Loading({ loading }: LoadingProps) {
    if (!loading) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <ClipLoader
                loading={loading}
                size={40}
                color="#6D4AFF"
                aria-label="Carregando"
            />
        </div>
    );
}