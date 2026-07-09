import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input-comum";
import { TextArea } from "../../components/ui/textArea";
import styles from "./configuracoes.module.css";

export function Configuracoes() {
    return (
        <div className={styles['container-principal']}>
            <div>
                <h1 className={styles['h1-configuracoes']}>Configurações</h1>
                <h2 className={styles['h2-configuracoes']}>Personalize seu consultório e preferências</h2>
            </div>
            <Card title="Informações Pessoais">
                    <div className={styles['linha-campo']}>
                        <Input name="Nome completo" placeholder="Digite seu nome" />
                        <Input name="CRP" placeholder="Digite seu CRP" />
                    </div>

                    <div className={styles['linha-campo']}>
                        <Input name="E-mail" placeholder="Digite seu e-mail" type="email" />
                        <Input name="Telefone" placeholder="Digite seu telefone" type="tel" />
                    </div>

                    <TextArea name="Sobre você" placeholder="Conte um pouco sobre você" />
                    <div className={styles['botao-salvar']}>
                        <Button type="submit">Salvar Alterações</Button>
                    </div>
            </Card>
        </div>
    )
}