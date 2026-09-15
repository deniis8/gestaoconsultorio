import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import styles from "./visualizacao-pacientes.module.css";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { Header } from "../../../components/layout/header";
import { formatSimpleDate } from "../../../utils/dataFormat";
import { formatCPF } from "../../../utils/cpfFormat";
import { PacientePlano } from "../../../types/paciente-plano/paciente-plano.types";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { PlanosCobranca } from "../../../types/planos-cobranca/planos-cobranca.types";
import { planosCobrancaService } from "../../../services/apis-supabase/planos-cobranca/planos-cobranca.service";
import { mascaraMoney } from "../../../utils/moneyFormat";
import { SkeletonVisualizarPaciente } from "../skeleton/skeleton-visualizar/skeleton";

export function VisualizacaoPacientes() {

    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [pacientePlano, setPacientePlano] = useState<PacientePlano | null>(null);
    const [planosCobranca, setPlanosCobranca] = useState<PlanosCobranca | null>(null);
    const [loadingPaciente, setLoadingPaciente] = useState(false);
    const { id_paciente: idPaciente = "" } = useParams();

    useEffect(() => {
        async function carregarDadosPaciente() {
            try {
                setLoadingPaciente(true);

                const [pacienteCarregado, planosPacienteCarregado] = await Promise.all([
                    pacientesService.buscarPorId(idPaciente),
                    pacientePlanoService.buscarPorIdPaciente(idPaciente)
                ]);

                if (pacienteCarregado.length > 0) {
                    setPaciente(pacienteCarregado[0]);
                }

                const planoPaciente = planosPacienteCarregado[0] ?? null;
                setPacientePlano(planoPaciente);

                if (planoPaciente?.id_plano_cobranca) {
                    const planosCobrancaCarregados = await planosCobrancaService.buscarPorId(planoPaciente.id_plano_cobranca);
                    setPlanosCobranca(planosCobrancaCarregados[0] ?? null);
                } else {
                    setPlanosCobranca(null);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do paciente:", error);
            } finally {
                setLoadingPaciente(false);
            }
        }

        if (idPaciente) {
            carregarDadosPaciente();
        }
    }, [idPaciente])

    return (
        loadingPaciente ? (
            <SkeletonVisualizarPaciente />) : (
            <div className={styles['container-principal']}>
                <div>
                    <Header
                        title="Paciente"
                        subtitle="Informações do paciente"
                    >
                    </Header>
                </div>
                <Card title="Dados pessoais"
                    actions={
                        <Button
                            variant="secondary"
                            icon="edit"
                            onClick={() => navigate(`/pacientes/formulario/${paciente?.id_paciente}`)}
                        >
                            Editar
                        </Button>
                    }
                >
                    <div className={styles.informacoes}>
                        <Label name="Nome do Paciente" value={paciente?.nome_completo ?? ""} />
                        <Label name="Data de Nascimento" value={formatSimpleDate(paciente?.data_nascimento?.toString() ?? "")} />
                        <Label name="CPF" value={formatCPF(paciente?.cpf ?? "")} />
                        <Label name="Telefone Principal" value={paciente?.telefone_principal ?? ""} />
                        <Label name="Telefone Secundário" value={paciente?.telefone_secundario ?? ""} />
                        <Label name="Email" value={paciente?.email ?? ""} />
                        <Label name="CEP" value={paciente?.cep ?? ""} />
                        <Label name="Logradouro" value={paciente?.logradouro ?? ""} />
                        <Label name="Número" value={paciente?.numero ?? ""} />
                        <Label name="Complemento" value={paciente?.complemento ?? ""} />
                        <Label name="Bairro" value={paciente?.bairro ?? ""} />
                        <Label name="Cidade" value={paciente?.cidade ?? ""} />
                        <Label name="Estado" value={paciente?.estado ?? ""} />
                    </div>
                </Card>
                <Card title="Plano do Paciente">
                    <Label name="Plano de Cobrança" value={planosCobranca?.nome ?? ""} />
                    <Label name="Data de Início" value={pacientePlano?.data_inicio ? formatSimpleDate(String(pacientePlano.data_inicio)) : ""} />
                    <Label name="Data de Término" value={pacientePlano?.data_fim ? formatSimpleDate(String(pacientePlano.data_fim)) : ""} />
                    <Label name="Valor Contratado" value={pacientePlano?.valor_contratado != null ? mascaraMoney(pacientePlano.valor_contratado.toString()) : ""} />
                    <Label name="Sessões Contratadas" value={pacientePlano?.quantidade_contratada_sessoes != null ? String(pacientePlano.quantidade_contratada_sessoes) : ""} />
                    <Label name="Status" value={pacientePlano?.status ?? ""} />
                </Card>

                <Card title="Observações">
                    <div className={styles.informacoes}>
                        <Label name="Observações Administrativas" value={paciente?.observacoes_administrativas ?? ""} />
                    </div>
                </Card>
            </div>
        )
    )
}