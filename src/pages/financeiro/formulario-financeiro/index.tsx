import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Combobox } from "../../../components/ui/combobox";
import { Input } from "../../../components/ui/input-comum";
import { InputData } from "../../../components/ui/input-data";
import { InputValor } from "../../../components/ui/input-valor";
import { TextArea } from "../../../components/ui/textArea";
import { Label } from "../../../components/ui/label";
import { Loading } from "../../../components/layout/loading";
import { confirmar } from "../../../components/layout/mensagem";
import styles from "./formulario-financeiro.module.css";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { financeiroService } from "../../../services/apis-supabase/financeiro/financeiro.service";
import { mascaraMoney } from "../../../utils/moneyFormat";
import { formatarOrigemFinanceiro } from "../../../utils/financeiroFormat";
import { SkeletonFormFinanceiro } from "../skeleton/skeleton-formulario/skeleton";

const statusOptions = [
    { label: "Pendente", value: "Pendente" },
    { label: "Pago", value: "Pago" },
    { label: "Cancelado", value: "Cancelado" },
];

export function FormularioFinanceiro() {
    const navigate = useNavigate();
    const { id_financeiro: idFinanceiro } = useParams();
    const isEdicao = Boolean(idFinanceiro);

    const [loadingFinanceiro, setLoadingFinanceiro] = useState(isEdicao);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    const [pacientes, setPacientes] = useState<{ label: string; value: string }[]>([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");
    const [idPacientePlano, setIdPacientePlano] = useState("");
    const [origemOriginal, setOrigemOriginal] = useState<string | undefined>(undefined);

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [dataVencimento, setDataVencimento] = useState("");
    const [dataPagamento, setDataPagamento] = useState("");
    const [status, setStatus] = useState("Pendente");
    const [observacoes, setObservacoes] = useState("");

    useEffect(() => {
        async function fetchPacientes() {
            try {
                const pacientes = await pacientesService.listar();
                setPacientes(
                    pacientes.map((paciente) => ({
                        label: paciente.nome_completo || "Paciente sem nome",
                        value: paciente.id_paciente ?? ""
                    }))
                );
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            }
        }
        fetchPacientes();
    }, []);

    useEffect(() => {
        if (!isEdicao || !idFinanceiro) return;

        async function carregarFinanceiro() {
            try {
                setLoadingFinanceiro(true);
                const [registro] = await financeiroService.buscarPorId(idFinanceiro!);

                if (!registro) {
                    toast.error("Lançamento não encontrado.");
                    navigate(-1);
                    return;
                }

                if (registro.id_paciente_plano) {
                    const [pacientePlano] = await pacientePlanoService.buscarPorIdPacientePlano(registro.id_paciente_plano);
                    setPacienteSelecionado(pacientePlano?.id_paciente ?? "");
                    setIdPacientePlano(registro.id_paciente_plano);
                }

                setDescricao(registro.descricao ?? "");
                setValor(mascaraMoney(registro.valor != null ? String(registro.valor) : ""));
                setDataVencimento(registro.data_vencimento ?? "");
                setDataPagamento(registro.data_pagamento ?? "");
                setStatus(registro.status ?? "Pendente");
                setObservacoes(registro.observacoes ?? "");
                setOrigemOriginal(registro.origem);
            } catch (error) {
                console.error("Erro ao carregar lançamento:", error);
                toast.error("Não foi possível carregar o lançamento.");
                navigate(-1);
            } finally {
                setLoadingFinanceiro(false);
            }
        }

        carregarFinanceiro();
    }, [isEdicao, idFinanceiro, navigate]);

    useEffect(() => {
        if (isEdicao || !pacienteSelecionado) return;

        async function resolverPlanoAtivo() {
            try {
                const planos = await pacientePlanoService.buscarPorIdPaciente(pacienteSelecionado);

                if (planos.length === 0) {
                    toast.error("Este paciente não possui um plano de cobrança ativo.");
                    setIdPacientePlano("");
                    return;
                }

                setIdPacientePlano(planos[0].id_paciente_plano ?? "");

                setDescricao((atual) => {
                    if (atual) return atual;
                    const nomePaciente = pacientes.find((p) => p.value === pacienteSelecionado)?.label;
                    return nomePaciente ? `Lançamento - ${nomePaciente}` : atual;
                });
            } catch (error) {
                console.error("Erro ao buscar plano do paciente:", error);
                toast.error("Não foi possível verificar o plano de cobrança do paciente.");
                setIdPacientePlano("");
            }
        }

        resolverPlanoAtivo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdicao, pacienteSelecionado]);

    function handleStatusChange(novoStatus: string) {
        setStatus(novoStatus);
        if (novoStatus === "Pago" && !dataPagamento) {
            setDataPagamento(format(new Date(), "yyyy-MM-dd"));
        }
    }

    function validar(): string | null {
        if (!pacienteSelecionado) return "Selecione um paciente.";
        if (!isEdicao && !idPacientePlano) return "Paciente sem plano de cobrança ativo.";
        if (!descricao.trim()) return "Informe uma descrição.";
        if (!valor || Number(valor.replace(/\./g, '').replace(',', '.')) <= 0) return "Informe o valor da cobrança.";
        if (!dataVencimento) return "Informe a data de vencimento.";
        if (status === "Pago" && !dataPagamento) return "Informe a data de pagamento.";
        return null;
    }

    const handleSalvar = async () => {
        const erro = validar();
        if (erro) {
            toast.error(erro);
            return;
        }

        try {
            setSalvando(true);
            const valorNumerico = Number(valor.replace(/\./g, '').replace(',', '.')) || 0;

            const payload = {
                id_paciente_plano: idPacientePlano,
                descricao: descricao.trim(),
                valor: valorNumerico,
                data_vencimento: dataVencimento,
                data_pagamento: status === "Pago" ? dataPagamento : undefined,
                status,
                observacoes: observacoes || undefined
            };

            if (isEdicao && idFinanceiro) {
                await financeiroService.atualizar(idFinanceiro, payload);
                toast.success("Lançamento atualizado com sucesso!");
            } else {
                await financeiroService.inserir({
                    ...payload,
                    origem: "MANUAL",
                    data_cobranca: format(new Date(), "yyyy-MM-dd")
                });
                toast.success("Lançamento salvo com sucesso!");
            }

            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar lançamento:", error);
            toast.error("Não foi possível salvar o lançamento. Erro: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluir = async () => {
        if (!idFinanceiro) return;

        const confirmou = await confirmar({
            title: "Excluir lançamento?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning"
        });

        if (!confirmou) return;

        try {
            setExcluindo(true);
            await financeiroService.excluir(idFinanceiro);
            toast.success("Lançamento excluído com sucesso.");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao excluir lançamento:", error);
            toast.error("Não foi possível excluir o lançamento.");
        } finally {
            setExcluindo(false);
        }
    };

    const carregandoAcao = salvando || excluindo;
    const tituloFinanceiro = isEdicao ? "Editar Lançamento" : "Novo Lançamento";
    const subtituloFinanceiro = isEdicao
        ? "Altere os dados do lançamento financeiro."
        : "Registre uma cobrança manual para um paciente.";

    return (
        <div className={styles["container-principal"]}>
            <Header
                title={tituloFinanceiro}
                subtitle={subtituloFinanceiro}
            >
                <Button type="submit" icon="back" onClick={() => navigate(-1)}>Voltar</Button>
            </Header>

            {loadingFinanceiro ? (
                <SkeletonFormFinanceiro />
            ) : (
                <>
                    <Card title="Dados do Lançamento">
                        <Combobox
                            label="Paciente *"
                            name="paciente"
                            placeholder="Selecione o paciente"
                            value={pacienteSelecionado}
                            options={pacientes}
                            onChange={(event) => setPacienteSelecionado(event.target.value)}
                            disabled={pacientes.length === 0 || isEdicao}
                        />

                        {isEdicao && origemOriginal && origemOriginal !== "MANUAL" && (
                            <Label name="Origem" value={formatarOrigemFinanceiro(origemOriginal)} />
                        )}

                        <Input
                            name="Descrição *"
                            placeholder="Ex: Sessão avulsa - Nome do paciente"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />

                        <div className={styles["linha-campo"]}>
                            <InputValor
                                name="Valor (R$) *"
                                value={valor}
                                onChange={(nextValue) => setValor(nextValue)}
                            />
                            <Combobox
                                label="Status *"
                                name="status"
                                placeholder="Selecione o status"
                                value={status}
                                options={statusOptions}
                                onChange={(event) => handleStatusChange(event.target.value)}
                            />
                        </div>

                        <div className={styles["linha-campo"]}>
                            <InputData
                                name="Data de Vencimento *"
                                value={dataVencimento}
                                onChange={(e) => setDataVencimento(e.target.value)}
                            />
                            <InputData
                                name="Data de Pagamento"
                                value={dataPagamento}
                                onChange={(e) => setDataPagamento(e.target.value)}
                            />
                        </div>

                        <TextArea
                            name="Observações"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />
                    </Card>

                    <div className={styles["linha-botao"]}>
                        {isEdicao && (
                            <Button variant="danger" icon="delete" onClick={handleExcluir} disabled={carregandoAcao}>
                                Excluir
                            </Button>
                        )}
                        <Button variant="warning" onClick={() => navigate(-1)} disabled={carregandoAcao}>Cancelar</Button>
                        <Button variant="success" onClick={handleSalvar} disabled={carregandoAcao}>
                            {isEdicao ? "Salvar Alterações" : "Salvar Lançamento"}
                        </Button>
                    </div>
                </>
            )}

            <Loading loading={carregandoAcao} />
        </div>
    );
}
