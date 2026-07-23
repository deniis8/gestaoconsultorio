import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import styles from "./nova-cobranca.module.css";
import toast from "react-hot-toast";


export function NovoPlanoCobranca(){

    const navigate = useNavigate();

    const handleSalvarPlano = () =>{
        toast.success("Plano salvo com sucesso!");
        navigate(-1);
    }

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
                <Input name="Valor por Sessão (R$) *" placeholder="R$ 0,00" />
            </Card>

            <Card>
                {/*Plano ativo?*/}
            </Card>

            <div className={styles['linha-botao']}>
                <Button variant="warning" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSalvarPlano()}>Salvar</Button>
            </div>
        </div>
    )
}