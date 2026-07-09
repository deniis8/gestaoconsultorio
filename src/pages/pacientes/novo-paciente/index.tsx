import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import toast from "react-hot-toast";
import styles from "./novo-paciente.module.css";
import { TextArea } from "../../../components/ui/textArea";

export function NovoPaciente() {

    const navigate = useNavigate();

    function handleSalvarCliente() {
        //Salva o cliente no banco de dados

        toast.success("Paciente salvo!", {
            duration: 3000,
            style: {
                background: "#047857",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.12)",
            },
        });

        navigate(-1);
    }

    return (
        <div className={styles['container-principal']}>
            <div>
                <h1 className={styles['h1-configuracoes']}>Novo Paciente</h1>
                <h2 className={styles['h2-configuracoes']}>Preencha os dados do paciente</h2>
            </div>
            <Card title="Dados Pessoais">
                <div className={styles['linha-campo']}>
                    <Input name="Nome Completo *" placeholder="Digite o nome do paciente" />
                </div>

                <div className={styles['linha-campo']}>
                    <InputData name="Data de Nascimento *" placeholder="" />
                    <Input name="Cpf" placeholder="Digite o CPF" />
                </div>

                <div className={styles['linha-campo']}>
                    <Input name="Telefone *" placeholder="Digite seu telefone" type="tel" />
                    <Input name="Telefone Secundário" placeholder="Digite seu telefone" type="tel" />
                </div>

                <div>
                    <Input name="E-mail" placeholder="E-mail" type="email" />
                </div>

                <div className={styles['linha-campo-metade']}>
                    <Input name="CEP" placeholder="00000-000" type="" />
                </div>

                <div>
                    <Input name="Logradouro" placeholder="Rua, Avenida, Travessa..." type="" />
                </div>

                <div className={styles['linha-campo']}>
                    <Input name="Número" placeholder="123" type="" />
                    <Input name="Complemento" placeholder="Próximo..." type="" />
                </div>

                <div className={styles['linha-campo']}>
                    <Input name="Bairro" placeholder="Bairro" type="" />
                    <Input name="Cidade" placeholder="Cidade" type="" />
                </div>

                <div className={styles['linha-campo-metade']}>
                    <Input name="Estado" placeholder="Nome de estado" type="" />
                </div>


            </Card>
            <Card title="Plano de Cobrança">
                <div>
                    <Input name="Plano de Cobrança *" placeholder="" type="" />
                </div>
                <div className={styles['linha-campo']}>
                    <InputData name="Data de Início *" placeholder="" />
                    <InputData name="Data de Término (opcional)" placeholder="" />
                </div>
                <div className={styles['linha-campo']}>
                    <Input name="Valor Contratado (R$ *)" placeholder="" type="" />
                    <Input name="Sessões Contratadas *" placeholder="" type="" />
                </div>
                <div className={styles['linha-campo-metade']}>
                    <Input name="Status do Plano" placeholder="" type="" />
                </div>
            </Card>

            <Card title="Observações">
                <Input name="Status do Plano" placeholder="" type="" />
                <TextArea name="Observações Administrativas"></TextArea>
            </Card>

            <div className={styles['linha-botao']}>
                <Button type="cancel" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button type="submit" onClick={() => handleSalvarCliente()}>Salvar</Button>
            </div>
        </div>
    )
}