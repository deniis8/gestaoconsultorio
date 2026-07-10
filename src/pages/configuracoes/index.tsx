import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input-comum";
import { TextArea } from "../../components/ui/textArea";
import styles from "./configuracoes.module.css";

export function Configuracoes() {
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