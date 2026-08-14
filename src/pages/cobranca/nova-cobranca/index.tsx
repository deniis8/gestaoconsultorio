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
import { planosCobrancaService } from "../../../services/planos-cobranca/planos-cobranca.service";
import { PlanosCobranca } from "../../../types/planos-cobranca/planos-cobranca.types";

export function NovoPlanoCobranca() {

    const navigate = useNavigate();
    const [tipoCobranca, setTipoCobranca] = useState<"SESSAO" | "PACOTE" | "MENSAL">("SESSAO");
    const [valor, setValor] = useState("");
    const [ativo, setAtivo] = useState(true);

    const [planosCobranca, setPlanosCobranca] = useState<PlanosCobranca>({
        nome: "",
        forma_cobranca: "",
        valor_padrao: 0,
        quantidade_padrao_sessoes: 0,
        ativo: true
    });

    function handleChange(
        campo: keyof PlanosCobranca,
        valor: string | boolean
    ) {
        const normalizedValue =
            campo === "valor_padrao" && typeof valor === "string"
                ? parseFloat(valor.replace(/[^0-9,.-]/g, "").replace(",", ".")) || 0
                : campo === "quantidade_padrao_sessoes" && typeof valor === "string"
                ? parseInt(valor, 10) || 0
                : campo === "ativo" && typeof valor === "boolean"
                ? (valor ? "S" : "N")
                : valor;

        setPlanosCobranca(prev => ({
            ...prev,
            [campo]: normalizedValue
        }));
    }

    async function handleSalvarPlano() {
        try {
            const novoPlano = await planosCobrancaService.inserir({
                nome: planosCobranca.nome || "",
                forma_cobranca: planosCobranca.forma_cobranca || "",
                valor_padrao: planosCobranca.valor_padrao || 0,
                quantidade_padrao_sessoes: planosCobranca.quantidade_padrao_sessoes || 0,
                ativo: planosCobranca.ativo !== undefined ? planosCobranca.ativo : true
            });
            console.log(novoPlano);
            toast.success("Plano salvo com sucesso!");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar plano:", error);
            toast.error("Não foi possível salvar o plano. Erro: " + (error instanceof Error ? error.message : String(error)));
        }
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
                    <Input
                        name="Nome do Plano *"
                        placeholder="Ex: Sessão Avulsa, Pacote Trimestral, mensal 4x..."
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />
                </div>
            </Card>

            <Card>
                <span>Forma de Cobrança</span>
                <div className={styles["formas-cobranca"]}>
                    <button
                        className={`${styles["cobranca-sessao"]} ${tipoCobranca === "SESSAO" ? styles["cobranca-sessao-selecionado"] : ""}`}
                        onClick={() => {
                            setTipoCobranca("SESSAO");
                            handleChange("forma_cobranca", "SESSAO");
                        }}
                    >
                        <div className={styles["cobranca-item"]}>
                            <div className={styles["cobranca-sessao-ico"]}>
                                <SlEnergy />
                            </div>
                            <span className={styles["cobranca-sessao-nome"]}>Por Sessão</span>
                            <span className={styles["cobranca-sessao-descricao"]}>Cobrado a cada sessão realizada</span>
                        </div>
                    </button>
                    <button
                        className={`${styles["cobranca-pacote"]} ${tipoCobranca === "PACOTE" ? styles["cobranca-pacote-selecionado"] : ""}`}
                        onClick={() => {
                            setTipoCobranca("PACOTE");
                            handleChange("forma_cobranca", "PACOTE");
                        }}
                    >
                        <div className={styles["cobranca-item"]}>
                            <div className={styles["cobranca-pacote-ico"]}>
                                <BsBoxSeam />
                            </div>
                            <span className={styles["cobranca-pacote-nome"]}>Pacote</span>
                            <span className={styles["cobranca-pacote-descricao"]}>Cobrado uma única vez no pacote</span>
                        </div>
                    </button>
                    <button
                        className={`${styles["cobranca-mensal"]} ${tipoCobranca === "MENSAL" ? styles["cobranca-mensal-selecionado"] : ""}`}
                        onClick={() => {
                            setTipoCobranca("MENSAL");
                            handleChange("forma_cobranca", "MENSAL");
                        }}
                    >
                        <div className={styles["cobranca-item"]}>
                            <div className={styles["cobranca-mensal-ico"]}>
                                <LuCalendarDays />
                            </div>
                            <span className={styles["cobranca-mensal-nome"]}>Mensal</span>
                            <span className={styles["cobranca-mensal-descricao"]}>Cobrado ao fechar o ciclo mensal</span>
                        </div>
                    </button>
                </div>
            </Card>

            <Card>
                <div className={styles["inputs-valor"]}>
                    <InputValor
                        name="Valor do Plano (R$) *"
                        value={valor}
                        onChange={(value) => {
                            setValor(value);
                            handleChange("valor_padrao", value);
                        }}
                    />
                    <Input
                        name="Sessões no Pacote *"
                        disabled={tipoCobranca === "SESSAO"}
                        onChange={(e) => handleChange("quantidade_padrao_sessoes", e.target.value)}
                    />
                </div>
            </Card>

            <Card >
                <div className={styles["card-toggle"]}>
                    <Label name="Plano ativo" value="Apenas planos ativos aparecem para seleção no cadastro de pacientes" />
                    <Toggle
                        checked={ativo}
                        onChange={(value) => {
                            setAtivo(value);
                            handleChange("ativo", value);
                        }}
                    />
                </div>
            </Card>

            <div className={styles['linha-botao']}>
                <Button variant="warning" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button variant="success" onClick={() => handleSalvarPlano()}>Salvar</Button>
            </div>
        </div>
    )
}