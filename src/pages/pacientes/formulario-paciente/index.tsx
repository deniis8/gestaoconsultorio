import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import toast from "react-hot-toast";
import styles from "./novo-paciente.module.css";
import { TextArea } from "../../../components/ui/textArea";
import { Combobox } from "../../../components/ui/combobox";
import statusPlano from "../../../mocks/mock-status-plano.json";
import { Header } from "../../../components/layout/header";
import { InputValor } from "../../../components/ui/input-valor";
import { useEffect, useState } from "react";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { pacientesService } from "../../../services/pacientes/pacientes.service";
import { planosCobrancaService } from "../../../services/planos-cobranca/planos-cobranca.service";
import { PacientePlano } from "../../../types/paciente-plano/paciente-plano.types";
import { pacientePlanoService } from "../../../services/paciente-plano/paciente-plano.service";

function formatDateForInput(value?: string | Date) {
    if (!value) return "";
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return value.toString().slice(0, 10);
}

export function FormularioPaciente() {

    const navigate = useNavigate();
    const { id_paciente } = useParams();
    const idPaciente = id_paciente;
    const isEdicao = Boolean(idPaciente);
    const [loadingPaciente, setLoadingPaciente] = useState(isEdicao);

    const [paciente, setPaciente] = useState<Paciente>({
        id_paciente: "",
        nome_completo: "",
        data_nascimento: "",
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
        observacoes_administrativas: ""
    });

    const [pacientePlano, setPacientePlano] = useState<PacientePlano>({
        id_paciente_plano: "",
        id_paciente: "",
        id_plano_cobranca: "",
        valor_contratado: 0,
        quantidade_contratada_sessoes: 0,
        data_inicio: "",
        data_fim: "",
        status: "ativo",
        id_usuario: ""
    });
    const [planosCobrancaOptions, setPlanosCobrancaOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        console.log("isEdicao:", isEdicao);
        console.log("idPaciente:", idPaciente);
        if (!isEdicao || !idPaciente) {
            setLoadingPaciente(false);
            return;
        }

        async function listarPaciente() {
            try {
                setLoadingPaciente(true);
                const [pacienteSelecionado, planoSelecionado, planosDisponiveis] = await Promise.all([
                    pacientesService.buscarPorId(idPaciente!),
                    pacientePlanoService.buscarPorIdPaciente(idPaciente!),
                    planosCobrancaService.listar()
                ]);

                if (pacienteSelecionado.length > 0) {
                    setPaciente(pacienteSelecionado[0]);
                }

                if (planoSelecionado.length > 0) {
                    setPacientePlano(planoSelecionado[0]);
                }

                setPlanosCobrancaOptions(
                    planosDisponiveis.map((plano) => ({
                        label: plano.nome,
                        value: plano.id_plano_cobranca ?? ""
                    }))
                );
            } catch (error) {
                console.error("Erro ao carregar paciente:", error);
                toast.error("Não foi possível carregar o paciente para edição.");
                navigate(-1);
            } finally {
                setLoadingPaciente(false);
            }
        }

        listarPaciente();
    }, [isEdicao, idPaciente, navigate]);

    useEffect(() => {
        async function listarPlanosDisponiveis() {
            try {
                const planosDisponiveis = await planosCobrancaService.listar();
                setPlanosCobrancaOptions(
                    planosDisponiveis.map((plano) => ({
                        label: plano.nome,
                        value: plano.id_plano_cobranca ?? ""
                    }))
                );
            } catch (error) {
                console.error("Erro ao listar planos de cobrança:", error);
            }
        }

        if (!isEdicao) {
            listarPlanosDisponiveis();
        }
    }, [isEdicao]);

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
            if (!pacientePlano.id_plano_cobranca) {
                toast.error("Selecione um plano de cobrança antes de salvar.");
                return;
            }

            const payloadPaciente = {
                nome_completo: paciente?.nome_completo || "",
                data_nascimento: paciente?.data_nascimento || "",
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
                observacoes_administrativas: paciente?.observacoes_administrativas || ""
            };

            let pacienteId = idPaciente;

            if (isEdicao && idPaciente) {
                await pacientesService.atualizar(idPaciente, payloadPaciente);
            } else {
                const pacientesCadastrados = await pacientesService.inserir(payloadPaciente);
                pacienteId = pacientesCadastrados[0]?.id_paciente || "";
            }

            if (!pacienteId) {
                throw new Error("Não foi possível identificar o paciente para salvar o plano.");
            }

            const payloadPacientePlano = {
                id_paciente: pacienteId,
                id_plano_cobranca: pacientePlano.id_plano_cobranca || "",
                valor_contratado: Number((valor.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0),
                quantidade_contratada_sessoes: Number(pacientePlano.quantidade_contratada_sessoes || 0),
                data_inicio: pacientePlano.data_inicio ? new Date(pacientePlano.data_inicio).toISOString() : undefined,
                data_fim: pacientePlano.data_fim ? new Date(pacientePlano.data_fim).toISOString() : undefined,
                status: pacientePlano.status || "ativo"
            };

            console.log("Payload do paciente:", payloadPaciente);
            console.log("Payload do plano do paciente:", payloadPacientePlano);

            if (isEdicao && pacientePlano.id_paciente_plano) {
                await pacientePlanoService.atualizar(pacientePlano.id_paciente_plano, payloadPacientePlano);
                toast.success("Paciente e plano atualizados com sucesso!");
            } else {
                await pacientePlanoService.inserir(payloadPacientePlano as Omit<PacientePlano, "id_paciente_plano">);
                toast.success("Paciente e plano salvos com sucesso!");
            }

            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar paciente:", error);
            toast.error("Não foi possível salvar o paciente. Erro: " + (error instanceof Error ? error.message : String(error)));
        }
    }

    const [valor, setValor] = useState("");

    const tituloPaciente = isEdicao ? "Editar Paciente" : "Novo Paciente";
    const subtituloPaciente = isEdicao
        ? "Altere os dados do paciente e confirme para atualizar as informações."
        : "Preencha os dados do paciente";

    return (
        <div className={styles['container-principal']}>
            <Header
                title={tituloPaciente}
                subtitle={subtituloPaciente}
            >
                <Button type="submit" icon="back" onClick={() => navigate(-1)}>Voltar</Button>
            </Header>
            {loadingPaciente ? (
                <div>Carregando...</div>
            ) : (
                <>
            <Card title="Dados Pessoais">
                <div className={styles['linha-campo']}>
                    <Input
                        name="Nome Completo *"
                        placeholder="Digite o nome do paciente"
                        value={paciente.nome_completo || ""}
                        onChange={(e) => handleChange("nome_completo", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo']}>
                    <InputData
                        name="Data de Nascimento *"
                        placeholder=""
                        value={formatDateForInput(paciente.data_nascimento)}
                        onChange={(e) => handleChange("data_nascimento", e.target.value)}
                    />
                    <Input
                        name="Cpf"
                        placeholder="Digite o CPF"
                        value={paciente.cpf || ""}
                        onChange={(e) => handleChange("cpf", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo']}>
                    <Input
                        name="Telefone *"
                        placeholder="Digite seu telefone"
                        type="tel"
                        value={paciente.telefone_principal || ""}
                        onChange={(e) => handleChange("telefone_principal", e.target.value)}
                    />
                    <Input
                        name="Telefone Secundário"
                        placeholder="Digite seu telefone"
                        type="tel"
                        value={paciente.telefone_secundario || ""}
                        onChange={(e) => handleChange("telefone_secundario", e.target.value)}
                    />
                </div>

                <div>
                    <Input
                        name="E-mail"
                        placeholder="E-mail"
                        type="email"
                        value={paciente.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo-metade']}>
                    <Input
                        name="CEP"
                        placeholder="00000-000"
                        value={paciente.cep || ""}
                        onChange={(e) => handleChange("cep", e.target.value)}
                    />
                </div>

                <div>
                    <Input
                        name="Logradouro"
                        placeholder="Rua, Avenida, Travessa..."
                        value={paciente.logradouro || ""}
                        onChange={(e) => handleChange("logradouro", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo']}>
                    <Input
                        name="Número"
                        placeholder="123"
                        value={paciente.numero || ""}
                        onChange={(e) => handleChange("numero", e.target.value)}
                    />
                    <Input
                        name="Complemento"
                        placeholder="Próximo..."
                        value={paciente.complemento || ""}
                        onChange={(e) => handleChange("complemento", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo']}>
                    <Input
                        name="Bairro"
                        placeholder="Bairro"
                        value={paciente.bairro || ""}
                        onChange={(e) => handleChange("bairro", e.target.value)}
                    />
                    <Input
                        name="Cidade"
                        placeholder="Cidade"
                        value={paciente.cidade || ""}
                        onChange={(e) => handleChange("cidade", e.target.value)}
                    />
                </div>

                <div className={styles['linha-campo-metade']}>
                    <Input
                        name="Estado"
                        placeholder="Nome de estado"
                        value={paciente.estado || ""}
                        onChange={(e) => handleChange("estado", e.target.value)}
                    />
                </div>


            </Card>
            <Card title="Plano do Paciente">
                <div>
                    <Combobox
                        label="Plano de Cobrança"
                        name="plano-cobranca"
                        placeholder="Selecione um plano"
                        value={pacientePlano.id_plano_cobranca || ""}
                        options={planosCobrancaOptions}
                        onChange={(e) => setPacientePlano((prev) => ({
                            ...prev,
                            id_plano_cobranca: e.target.value
                        }))}
                    />
                </div>
                <div className={styles['linha-campo']}>
                    <InputData
                        name="Data de Início *"
                        placeholder=""
                        value={formatDateForInput(pacientePlano.data_inicio)}
                        onChange={(e) => setPacientePlano((prev) => ({
                            ...prev,
                            data_inicio: e.target.value
                        }))}
                    />
                    <InputData
                        name="Data de Término (opcional)"
                        placeholder=""
                        value={formatDateForInput(pacientePlano.data_fim)}
                        onChange={(e) => setPacientePlano((prev) => ({
                            ...prev,
                            data_fim: e.target.value
                        }))}
                    />
                </div>
                <div className={styles['linha-campo']}>
                    <InputValor
                        name="Valor Contratado (R$ *)"
                        value={valor}
                        onChange={(nextValue) => {
                            setValor(nextValue);
                            setPacientePlano((prev) => ({
                                ...prev,
                                valor_contratado: Number(nextValue.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
                            }));
                        }}
                    />
                    <Input
                        name="Sessões Contratadas *"
                        placeholder=""
                        value={pacientePlano.quantidade_contratada_sessoes?.toString() || ""}
                        onChange={(e) => setPacientePlano((prev) => ({
                            ...prev,
                            quantidade_contratada_sessoes: Number(e.target.value) || 0
                        }))}
                    />
                </div>
                <div className={styles['linha-campo-metade']}>
                    <Combobox
                        label="Status do Plano"
                        name="status-plano"
                        placeholder="Escolher status"
                        value={pacientePlano.status || ""}
                        options={statusPlanoOptions}
                        onChange={(e) => setPacientePlano((prev) => ({
                            ...prev,
                            status: e.target.value
                        }))}
                    />
                </div>
            </Card>

            <Card title="Observações">
                <TextArea
                    name="Observações Administrativas"
                    value={paciente.observacoes_administrativas || ""}
                    onChange={(e) => handleChange("observacoes_administrativas", e.target.value)}
                />
            </Card>

            <div className={styles['linha-botao']}>
                <Button variant="warning" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSalvarCliente()}>{isEdicao ? "Confirmar" : "Salvar"}</Button>
            </div>
        </>
            )}
        </div>
    )
}