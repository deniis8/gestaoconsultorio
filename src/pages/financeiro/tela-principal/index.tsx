import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from "./financeiro.module.css";
import { useEffect, useState } from "react";
import { financeiroService } from "../../../services/apis-supabase/financeiro/financeiro.service";
import { pacientePlanoService } from "../../../services/apis-supabase/paciente-plano/paciente-plano.service";
import { pacientesService } from "../../../services/apis-supabase/pacientes/pacientes.service";
import type { Financeiro as FinanceiroModel } from "../../../types/financeiro/financeiro.types";
import { SkeletonFinanceiro } from "../skeleton/skeleton-principal/skeleton";
import { formatarOrigemFinanceiro, CORES_STATUS_FINANCEIRO } from "../../../utils/financeiroFormat";
import { formatSimpleDate } from "../../../utils/dataFormat";
import { mascaraMoney } from "../../../utils/moneyFormat";

type FinanceiroTableRow = {
    id_financeiro: string;
    paciente: string;
    descricao: string;
    origem: string;
    valor: string;
    vencimento: string;
    status: string;
};

export function Financeiro() {
    const navigate = useNavigate();
    const [financeiros, setFinanceiros] = useState<FinanceiroModel[]>([]);
    const [nomePorPacientePlano, setNomePorPacientePlano] = useState<Record<string, string>>({});
    const [loadingFinanceiro, setLoadingFinanceiro] = useState(true);
    const [termoPesquisado, setTermoPesquisado] = useState("");

    async function montarMapaPacientes() {
        const [pacientePlanos, pacientes] = await Promise.all([
            pacientePlanoService.listar(),
            pacientesService.listar()
        ]);

        const nomePorPaciente = new Map(pacientes.map((p) => [p.id_paciente, p.nome_completo || "Paciente"]));
        const mapa: Record<string, string> = {};
        pacientePlanos.forEach((pp) => {
            if (pp.id_paciente_plano) {
                mapa[pp.id_paciente_plano] = nomePorPaciente.get(pp.id_paciente ?? "") ?? "Paciente";
            }
        });
        setNomePorPacientePlano(mapa);
    }

    useEffect(() => {
        async function fetchFinanceiros() {
            try {
                setLoadingFinanceiro(true);
                const [lista] = await Promise.all([
                    financeiroService.listar(),
                    montarMapaPacientes()
                ]);
                setFinanceiros(lista);
            } catch (error) {
                console.error("Erro ao buscar lançamentos financeiros:", error);
            } finally {
                setLoadingFinanceiro(false);
            }
        }
        fetchFinanceiros();
    }, []);

    const handleSearch = async (termo: string) => {
        try {
            setLoadingFinanceiro(true);
            const lista = await financeiroService.buscarPorDescricao(termo);
            setFinanceiros(lista);
        } catch (error) {
            console.error("Erro ao buscar lançamentos financeiros:", error);
        } finally {
            setLoadingFinanceiro(false);
        }
    };

    const rows: FinanceiroTableRow[] = financeiros.map((financeiro) => ({
        id_financeiro: financeiro.id_financeiro ?? "",
        paciente: nomePorPacientePlano[financeiro.id_paciente_plano ?? ""] ?? "-",
        descricao: financeiro.descricao ?? "",
        origem: formatarOrigemFinanceiro(financeiro.origem),
        valor: mascaraMoney(financeiro.valor?.toString() ?? ""),
        vencimento: financeiro.data_vencimento ? formatSimpleDate(financeiro.data_vencimento) : "",
        status: financeiro.status ?? "",
    }));

    return (
        <div className={styles["container-principal"]}>
            <Header
                title="Financeiro"
                subtitle="Controle de pagamentos e receitas"
            >
                <Button type="submit" icon="add" onClick={() => navigate("/financeiro/formulario")}>
                    Novo Lançamento
                </Button>
            </Header>

            <Card>
                <div className={styles["container-pesquisa"]}>
                    <div className={styles["pesquisar"]}>
                        <InputPesquisar
                            placeholder="Buscar por descrição"
                            value={termoPesquisado}
                            onChange={(e) => setTermoPesquisado(e.target.value)}
                        />
                        <Button type="submit" icon="search" onClick={() => handleSearch(termoPesquisado)}>Buscar</Button>
                    </div>

                    {loadingFinanceiro ? (
                        <SkeletonFinanceiro />
                    ) : (
                        <Table
                            columns={[
                                { key: "paciente", header: "Paciente" },
                                { key: "descricao", header: "Descrição" },
                                { key: "origem", header: "Origem" },
                                { key: "valor", header: "Valor" },
                                { key: "vencimento", header: "Vencimento" },
                                {
                                    key: "status",
                                    header: "Status",
                                    render: (item) => (
                                        <span
                                            className={styles["status-badge"]}
                                            style={{ backgroundColor: CORES_STATUS_FINANCEIRO[item.status] ?? "#7E8A97" }}
                                        >
                                            {item.status}
                                        </span>
                                    )
                                },
                            ]}
                            data={rows}
                            onRowClick={(item) => navigate(`/financeiro/visualizacao/${item.id_financeiro}`)}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}
