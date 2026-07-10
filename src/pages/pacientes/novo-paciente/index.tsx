import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import toast from "react-hot-toast";
import styles from "./novo-paciente.module.css";
import { TextArea } from "../../../components/ui/textArea";
import { Combobox } from "../../../components/ui/combobox";
import planosCobrancaMock from "../../../mocks/mock-planos-cobranca.json";
import statusPlano from "../../../mocks/mock-status-plano.json";
import { Header } from "../../../components/layout/header";

export function NovoPaciente() {

    const navigate = useNavigate();
    const planosCobrancaOptions = planosCobrancaMock.map((plano) => ({
        label: plano.nome,
        value: plano.codigo,
    }));

    const statusPlanoOptions = statusPlano.map((status) => ({
        label: status.nome,
        value: status.codigo,
    }));

    function handleSalvarCliente() {
        //Salva o cliente no banco de dados
        toast.success("Paciente salvo!");

        navigate(-1);
    }

    return (
        <div className={styles['container-principal']}>
            <Header
                title="Novo Paciente"
                subtitle="Preencha os dados do paciente"
            >
                <Button type="submit" icon="back" onClick={() => navigate(-1)}>Voltar</Button>
            </Header>
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
                    <Combobox
                        label="Plano de Cobrança"
                        name="plano-cobranca"
                        placeholder="Selecione um plano"
                        options={planosCobrancaOptions}
                    />
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
                    <Combobox
                        label="Status do Plano"
                        name="status-plano"
                        placeholder="Escolher status"
                        options={statusPlanoOptions}
                    />
                </div>
            </Card>

            <Card title="Observações">
                <TextArea name="Observações Administrativas"></TextArea>
            </Card>

            <div className={styles['linha-botao']}>
                <Button type="cancel" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button type="submit" onClick={() => handleSalvarCliente()}>Salvar</Button>
            </div>
        </div>
    )
}