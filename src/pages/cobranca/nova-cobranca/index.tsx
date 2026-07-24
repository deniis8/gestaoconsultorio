import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import styles from "./nova-cobranca.module.css";
import toast from "react-hot-toast";
import { Label } from "../../../components/ui/label";
import { Toggle } from "../../../components/ui/toggle";
import { useState } from "react";
import { InputValor } from "../../../components/ui/input-valor";
import { SlEnergy } from "react-icons/sl";
import { BsBoxSeam } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";

export function NovoPlanoCobranca() {

    const navigate = useNavigate();

    const handleSalvarPlano = () => {
        toast.success("Plano salvo com sucesso!");
        navigate(-1);
    }

    const [ativo, setAtivo] = useState(true);
    const [valor, setValor] = useState("");

    return (
        <div className={styles['container-principal']}>
            <Header
                title="Novo Plano de Cobrança"
                subtitle="Defina como o paciente será cobrado ao usar este plano"
            >
                <Button type="submit" icon="back" onClick={() => navigate(-1)}>Voltar</Button>
            </Header>

            <Card>
                <div>
                    <Input name="Nome do Plano *" placeholder="Ex: Sessão Avulsa, Pacote Trimestral, mensal 4x..." />
                </div>
            </Card>

            <Card>
                <span>Forma de Cobrança</span>
                <div className={styles["formas-cobranca"]}>
                    <div className={styles["cobranca-sessao"]}>
                        <div className={styles["cobranca-item"]}>
                            <div className={styles["cobranca-sessao-ico"]}>
                                <SlEnergy />
                            </div>
                            <span className={styles["cobranca-sessao-nome"]}>Por Sessão</span>
                            <span className={styles["cobranca-sessao-descricao"]}>Cobrado a cada sessão realizada</span>
                        </div>
                    </div>
                    <div className={styles["cobranca-pacote"]}>
                        <div className={styles["cobranca-item"]}>
                            <div className={styles["cobranca-pacote-ico"]}>
                                <BsBoxSeam />
                            </div>
                            <span className={styles["cobranca-pacote-nome"]}>Pacote</span>
                            <span className={styles["cobranca-pacote-descricao"]}>Cobrado uma única vez no pacote</span>
                        </div>
                    </div>
                    <div className={styles["cobranca-mensal"]}>
                        <div className={styles["cobranca-item"]}>
                            <div className={styles["cobranca-mensal-ico"]}>
                                <LuCalendarDays />
                            </div>
                            <span className={styles["cobranca-mensal-nome"]}>Mensal</span>
                            <span className={styles["cobranca-mensal-descricao"]}>Cobrado ao fechar o ciclo mensal</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <InputValor
                    name="Valor por Sessão (R$) *"
                    value={valor}
                    onChange={setValor}
                />
            </Card>

            <Card >
                <div className={styles["card-toggle"]}>
                    <Label name="Plano ativo" value="Apenas planos ativos aparecem para seleção no cadastro de pacientes" />
                    <Toggle checked={ativo} onChange={setAtivo} />
                </div>
            </Card>

            <div className={styles['linha-botao']}>
                <Button variant="warning" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSalvarPlano()}>Salvar</Button>
            </div>
        </div>
    )
}