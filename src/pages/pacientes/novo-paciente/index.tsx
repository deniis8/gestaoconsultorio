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
import { InputValor } from "../../../components/ui/input-valor";
import { useState } from "react";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { pacientesService } from "../../../services/pacientes/pacientes.service";

export function NovoPaciente() {

    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<Paciente>({
        id_paciente: "",
        nome_completo: "",
        data_nascimento: new Date(),
        cpf: "",
        telefone_principal: "",
        telefone_secundario: "",
        email: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        observacoes_administrativas: "",
        id_usuario: ""
    });

    const planosCobrancaOptions = planosCobrancaMock.map((plano) => ({
        label: plano.nome,
        value: plano.codigo,
    }));

    const statusPlanoOptions = statusPlano.map((status) => ({
        label: status.nome,
        value: status.codigo,
    }));

    function handleChange(
        campo: keyof Paciente,
        valor: string
    ) {
        setPaciente(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    async function handleSalvarCliente() {

        try {
            const novoPaciente = await pacientesService.inserir({
                nome_completo: paciente?.nome_completo || "",
                data_nascimento: paciente?.data_nascimento || new Date(),
                cpf: paciente?.cpf || "",
                telefone_principal: paciente?.telefone_principal || "",
                telefone_secundario: paciente?.telefone_secundario || "",
                email: paciente?.email || "",
                cep: paciente?.cep || "",
                logradouro: paciente?.logradouro || "",
                numero: paciente?.numero || "",
                bairro: paciente?.bairro || "",
                cidade: paciente?.cidade || "",
                estado: paciente?.estado || "",
                complemento: paciente?.complemento || "",
                observacoes_administrativas: paciente?.observacoes_administrativas || "",
                id_usuario: "2a959e5b-dee7-4786-a6df-37883406bae7"
            });
            console.log(novoPaciente);
            toast.success("Paciente salvo com sucesso!");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar paciente:", error);
            toast.error("Não foi possível salvar o paciente. Erro: " + (error instanceof Error ? error.message : String(error)));
        }
    }

    const [valor, setValor] = useState("");

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
                    <Input
                        name="Nome Completo *"
                        placeholder="Digite o nome do paciente"
                        onChange={(e) => handleChange("nome_completo", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo']}>
                    <InputData
                        name="Data de Nascimento *"
                        placeholder=""
                        onChange={(e) => handleChange("data_nascimento", e.target.value)}
                    />
                    <Input name="Cpf" placeholder="Digite o CPF" onChange={(e) => handleChange("cpf", e.target.value)} />
                </div>

                <div className={styles['linha-campo']}>
                    <Input name="Telefone *" placeholder="Digite seu telefone" type="tel" onChange={(e) => handleChange("telefone_principal", e.target.value)} />
                    <Input name="Telefone Secundário" placeholder="Digite seu telefone" type="tel" onChange={(e) => handleChange("telefone_secundario", e.target.value)} />
                </div>

                <div>
                    <Input name="E-mail" placeholder="E-mail" type="email" onChange={(e) => handleChange("email", e.target.value)} />
                </div>

                <div className={styles['linha-campo-metade']}>
                    <Input name="CEP" placeholder="00000-000" type="" onChange={(e) => handleChange("cep", e.target.value)} />
                </div>

                <div>
                    <Input name="Logradouro" placeholder="Rua, Avenida, Travessa..." type="" onChange={(e) => handleChange("logradouro", e.target.value)} />
                </div>

                <div className={styles['linha-campo']}>
                    <Input name="Número" placeholder="123" type="" onChange={(e) => handleChange("numero", e.target.value)} />
                    <Input name="Complemento" placeholder="Próximo..." type="" onChange={(e) => handleChange("complemento", e.target.value)} />
                </div>

                <div className={styles['linha-campo']}>
                    <Input name="Bairro" placeholder="Bairro" type="" onChange={(e) => handleChange("bairro", e.target.value)} />
                    <Input name="Cidade" placeholder="Cidade" type="" onChange={(e) => handleChange("cidade", e.target.value)} />
                </div>

                <div className={styles['linha-campo-metade']}>
                    <Input name="Estado" placeholder="Nome de estado" type="" onChange={(e) => handleChange("estado", e.target.value)} />
                </div>


            </Card>
            <Card title="Plano do Paciente">
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
                    <InputValor name="Valor Contratado (R$ *)" value={valor} onChange={setValor} />
                    <Input name="Sessões Contratadas *" placeholder="" />
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
                <TextArea name="Observações Administrativas" onChange={(e) => handleChange("observacoes_administrativas", e.target.value)}></TextArea>
            </Card>

            <div className={styles['linha-botao']}>
                <Button variant="warning" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSalvarCliente()}>Salvar</Button>
            </div>
        </div>
    )
}