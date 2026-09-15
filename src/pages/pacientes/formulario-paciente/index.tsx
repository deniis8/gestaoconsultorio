import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import toast from "react-hot-toast";
import styles from "./formulario-paciente.module.css";
import { TextArea } from "../../../components/ui/textArea";
import { Combobox } from "../../../components/ui/combobox";
import statusPlano from "../../../mocks/mock-status-plano.json";
import { Header } from "../../../components/layout/header";
import { InputValor } from "../../../components/ui/input-valor";
import { useEffect, useState } from "react";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { planosCobrancaService } from "../../../services/apis-supabase/planos-cobranca/planos-cobranca.service";
import { PacientePlano } from "../../../types/paciente-plano/paciente-plano.types";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { mascaraMoney } from "../../../utils/moneyFormat";
import { SkeletonFormPaciente } from "../skeleton/skeleton-formulario/skeleton";
import { Loading } from "../../../components/layout/loading";
import { confirmar } from "../../../components/layout/mensagem";
import { gerarFinanceiroPorContratacaoPacote } from "../../../services/financeiro/gerarFinanceiro";
import { isErroChaveEstrangeira } from "../../../utils/apiErrorFormat";

export function FormularioPaciente() {

    const navigate = useNavigate();
    const { id_paciente } = useParams();
    const idPaciente = id_paciente;
    const isEdicao = Boolean(idPaciente);
    const [loadingPaciente, setLoadingPaciente] = useState(isEdicao);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

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

    function formatDateForInput(value?: string) {
        if (!value) return "";
        return value.slice(0, 10);
    }

    useEffect(() => {
        if (!isEdicao || !idPaciente) {
            setLoadingPaciente(false);
            return;
        }

         const listarPaciente = async () => {
            try {
                setLoadingPaciente(true);
                const [pacienteSelecionado, planoSelecionado, planosAtivos] = await Promise.all([
                    pacientesService.buscarPorId(idPaciente!),
                    pacientePlanoService.buscarUltimoPorIdPaciente(idPaciente!),
                    planosCobrancaService.listarAtivos()
                ]);

                if (pacienteSelecionado.length > 0) {
                    setPaciente(pacienteSelecionado[0]);
                }

                let opcoesPlanos = planosAtivos.map((plano) => ({
                    label: plano.nome,
                    value: plano.id_plano_cobranca ?? ""
                }));

                if (planoSelecionado.length > 0) {
                    const plano = planoSelecionado[0];
                    setPacientePlano(plano);
                    setValor(mascaraMoney(plano.valor_contratado != null ? String(plano.valor_contratado) : ""));

                    // paciente pode ter um plano hoje inativo; garante que ele apareça no combo para não ficar em branco
                    const planoContratadoEstaAtivo = opcoesPlanos.some((opcao) => opcao.value === plano.id_plano_cobranca);
                    if (plano.id_plano_cobranca && !planoContratadoEstaAtivo) {
                        const planoInativo = await planosCobrancaService.buscarPorId(plano.id_plano_cobranca);
                        if (planoInativo[0]) {
                            opcoesPlanos = [
                                ...opcoesPlanos,
                                { label: `${planoInativo[0].nome} (inativo)`, value: planoInativo[0].id_plano_cobranca ?? "" }
                            ];
                        }
                    }
                }

                setPlanosCobrancaOptions(opcoesPlanos);
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
        const listarPlanosDisponiveis = async () => {
            try {
                const planosDisponiveis = await planosCobrancaService.listarAtivos();
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

    const handleChange = (
        campo: keyof Paciente,
        valor: string
    ) => {
        setPaciente(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    async function handleSelecionarPlanoCobranca(id_plano_cobranca: string) {
        setPacientePlano((prev) => ({ ...prev, id_plano_cobranca }));

        if (!id_plano_cobranca) return;

        try {
            const [planoSelecionado] = await planosCobrancaService.buscarPorId(id_plano_cobranca);
            if (!planoSelecionado) return;

            setValor(mascaraMoney(planoSelecionado.valor_padrao != null ? String(planoSelecionado.valor_padrao) : ""));
            setPacientePlano((prev) => ({
                ...prev,
                quantidade_contratada_sessoes: planoSelecionado.quantidade_padrao_sessoes ?? 0
            }));
        } catch (error) {
            console.error("Erro ao buscar valores padrão do plano de cobrança:", error);
        }
    }

    function validar(): string | null {
        if (!paciente.nome_completo?.trim()) return "Informe o nome completo do paciente.";
        if (!paciente.data_nascimento) return "Informe a data de nascimento.";
        if (!paciente.telefone_principal?.trim()) return "Informe o telefone principal.";
        if (!pacientePlano.id_plano_cobranca) return "Selecione um plano de cobrança antes de salvar.";
        if (!pacientePlano.data_inicio) return "Informe a data de início do plano.";
        if (!valor || Number(valor.replace(/\./g, '').replace(',', '.')) <= 0) return "Informe o valor contratado do plano.";
        if (!pacientePlano.quantidade_contratada_sessoes) return "Informe a quantidade de sessões contratadas.";
        return null;
    }

    const handleSalvarCliente = async () => {
        const erro = validar();
        if (erro) {
            toast.error(erro);
            return;
        }

        try {
            setSalvando(true);

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
                valor_contratado: Number(valor.replace(/\./g, '').replace(',', '.')) || 0,
                quantidade_contratada_sessoes: Number(pacientePlano.quantidade_contratada_sessoes || 0),
                data_inicio: pacientePlano.data_inicio ? new Date(pacientePlano.data_inicio).toISOString() : undefined,
                data_fim: pacientePlano.data_fim ? new Date(pacientePlano.data_fim).toISOString() : undefined,
                status: pacientePlano.status || "ativo"
            };

            if (isEdicao && pacientePlano.id_paciente_plano) {
                await pacientePlanoService.atualizar(pacientePlano.id_paciente_plano, payloadPacientePlano);
                toast.success("Paciente e plano atualizados com sucesso!");
            } else {
                const [pacientePlanoInserido] = await pacientePlanoService.inserir(payloadPacientePlano as Omit<PacientePlano, "id_paciente_plano">);
                toast.success("Paciente e plano salvos com sucesso!");

                if (pacientePlanoInserido) {
                    try {
                        await gerarFinanceiroPorContratacaoPacote(pacientePlanoInserido);
                    } catch (erroFinanceiro) {
                        console.error("Erro ao gerar financeiro do pacote:", erroFinanceiro);
                        toast.error("Paciente salvo, mas houve um erro ao gerar a cobrança do pacote. Lance manualmente em Financeiro.");
                    }
                }
            }

            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar paciente:", error);
            toast.error("Não foi possível salvar o paciente. Erro: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setSalvando(false);
        }
    }

    const handleExcluir = async () => {
        if (!idPaciente) return;

        const confirmou = await confirmar({
            title: "Excluir paciente?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning"
        });

        if (!confirmou) return;

        try {
            setExcluindo(true);
            await pacientesService.excluir(idPaciente);
            toast.success("Paciente excluído com sucesso.");
            navigate("/pacientes");
        } catch (error) {
            console.error("Erro ao excluir paciente:", error);
            toast.error(
                isErroChaveEstrangeira(error)
                    ? "Não é possível excluir: existem agendamentos, planos ou lançamentos financeiros vinculados a este paciente."
                    : "Não foi possível excluir o paciente."
            );
        } finally {
            setExcluindo(false);
        }
    };

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
                <SkeletonFormPaciente />
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
                        onChange={(e) => handleSelecionarPlanoCobranca(e.target.value)}
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
                        onChange={(nextValue) => setValor(nextValue)}
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
                {isEdicao && (
                    <Button variant="danger" icon="delete" onClick={handleExcluir} disabled={salvando || excluindo}>
                        Excluir
                    </Button>
                )}
                <Button variant="warning" onClick={() => navigate(-1)} disabled={salvando || excluindo}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSalvarCliente()} disabled={salvando || excluindo}>{isEdicao ? "Confirmar" : "Salvar"}</Button>
            </div>
        </>
            )}
            <Loading loading={salvando || excluindo} />
        </div>
    )
}