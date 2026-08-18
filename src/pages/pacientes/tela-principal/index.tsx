import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { InputPesquisar } from "../../../components/ui/input-pesquisar";
import { Table } from "../../../components/ui/table";
import styles from "./pacientes.module.css";
import { useEffect, useState } from "react";
import { pacientesService } from "../../../services/pacientes/pacientes.service";
import { Paciente } from "../../../types/pacientes/pacientes.types";
import { SkeletonPacientes } from "../skeleton/skeleton";

/**
 * TODO - REFATORAÇÃO
 *
 * Este tipo foi criado especificamente para adaptar os dados de Paciente
 * ao formato esperado pela tabela.
 *
 * Futuramente, podemos avaliar se o componente Table pode receber
 * diretamente o objeto Paciente e permitir que cada coluna defina
 * como obter/exibir seu valor.
 *
 * Exemplo futuro:
 *
 * <Table
 *     data={pacientes}
 *     columns={[
 *         {
 *             key: "nome_completo",
 *             header: "Paciente"
 *         },
 *         {
 *             key: "data_nascimento",
 *             header: "Idade",
 *             render: (paciente) => calcularIdade(paciente.data_nascimento)
 *         }
 *     ]}
 * />
 *
 * Dessa forma, este tipo PacienteTableRow poderia deixar de existir.
 */
type PacienteTableRow = {
    paciente: string;
    telefone: string;
    email: string;
    idade: string | number;
    original: Paciente;
};

export function Pacientes() {
    const navigate = useNavigate();

    /**
     * TODO - REFATORAÇÃO
     *
     * Atualmente o estado começa como null:
     *
     *     Paciente[] | null
     *
     * Porém, já temos o estado loadingPacientes para indicar
     * se os dados ainda estão sendo carregados.
     *
     * Futuramente podemos simplificar para:
     *
     *     const [pacientes, setPacientes] = useState<Paciente[]>([]);
     *
     * Assim não precisaremos utilizar:
     *
     *     pacientes || []
     *
     * porque o valor inicial já será um array vazio.
     */
    const [pacientes, setPacientes] = useState<Paciente[] | null>(null);

    const [loadingPacientes, setLoadingPacientes] = useState(false);

    /**
     * Busca os pacientes quando o componente é carregado.
     *
     * TODO - REFATORAÇÃO
     *
     * Essa lógica de comunicação com a API pode ser retirada
     * deste componente e colocada em um custom hook.
     *
     * Exemplo futuro:
     *
     *     const { pacientes, loading } = usePacientes();
     *
     * Dessa forma, a página ficaria responsável apenas pela interface,
     * enquanto o hook ficaria responsável pelo carregamento dos dados.
     */
    useEffect(() => {
        async function fetchPacientes() {
            try {
                setLoadingPacientes(true);

                const pacientes = await pacientesService.listar();

                setPacientes(pacientes);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            } finally {
                setLoadingPacientes(false);
            }
        }

        fetchPacientes();
    }, []);

    /**
     * Transforma os objetos Paciente no formato utilizado pela tabela.
     *
     * TODO - REFATORAÇÃO
     *
     * Atualmente essa transformação acontece a cada renderização.
     *
     * Podemos futuramente utilizar useMemo:
     *
     *     const rows = useMemo(() => {
     *         return pacientes.map(...)
     *     }, [pacientes]);
     *
     * Porém, mais importante do que utilizar useMemo aqui é avaliar
     * se realmente precisamos criar o PacienteTableRow.
     *
     * Uma possível evolução seria fazer o Table trabalhar diretamente
     * com Paciente.
     */
    const rows: PacienteTableRow[] = (pacientes || []).map((paciente) => ({
        paciente: paciente.nome_completo || "",
        telefone: paciente.telefone_principal || "",
        email: paciente.email || "",

        /**
         * TODO - REFATORAÇÃO
         *
         * Esse cálculo de idade é simplificado e pode apresentar
         * um resultado incorreto caso o paciente ainda não tenha
         * feito aniversário no ano atual.
         *
         * Exemplo:
         *
         * Nascimento: 20/12/1990
         * Data atual: 18/08/2026
         *
         * O cálculo abaixo retorna 36, mas a idade correta ainda é 35.
         *
         * Futuramente criar uma função:
         *
         *     calcularIdade(dataNascimento)
         *
         * para centralizar essa regra.
         */
        idade: paciente.data_nascimento
            ? new Date().getFullYear() -
              new Date(paciente.data_nascimento).getFullYear()
            : "N/A",

        /**
         * Mantemos o objeto original porque o Table atualmente
         * trabalha com PacienteTableRow.
         *
         * TODO - REFATORAÇÃO
         *
         * Se o Table passar a trabalhar diretamente com Paciente,
         * este campo "original" também deixará de ser necessário.
         */
        original: paciente,
    }));

    /**
     * Executado quando uma linha da tabela é clicada.
     *
     * Atualmente apenas exibimos um alert.
     *
     * Futuramente provavelmente iremos navegar para a tela
     * de detalhes/edição do paciente.
     *
     * Exemplo:
     *
     *     navigate(`/pacientes/${item.original.id}`);
     *
     * TODO - REFATORAÇÃO
     *
     * Caso o Table passe a trabalhar diretamente com Paciente,
     * poderemos receber:
     *
     *     const handleRowClick = (paciente: Paciente) => {
     *         navigate(`/pacientes/${paciente.id}`);
     *     };
     */
    const handleRowClick = (item: PacienteTableRow) => {
        alert(`Paciente selecionado: ${item.paciente}`);
    };

    /**
     * TODO - REFATORAÇÃO
     *
     * O Header já utiliza children, o que é uma boa abordagem.
     *
     * Isso permite que cada página defina suas próprias ações
     * sem que o Header precise conhecer o componente Button.
     *
     * Não há necessidade de alterar isso agora.
     *
     * Caso várias páginas possuam exatamente o mesmo padrão,
     * podemos futuramente criar um PageHeader específico.
     */

    return loadingPacientes ? (
        /**
         * Enquanto os dados estão sendo carregados,
         * mostramos o Skeleton.
         */
        <SkeletonPacientes />
    ) : (
        <div className={styles["container-principal"]}>
            <Header
                title="Pacientes"
                subtitle="Gerencie seus pacientes e acompanhe histórico"
            >
                <Button
                    type="submit"
                    onClick={() => navigate("/pacientes/novo")}
                    icon="add"
                >
                    Novo Paciente
                </Button>
            </Header>

            <Card>
                <div className={styles["container-pesquisa"]}>
                    <InputPesquisar placeholder="Buscar paciente" />

                    <Table
                        columns={[
                            {
                                key: "paciente",
                                header: "Paciente",
                            },
                            {
                                key: "telefone",
                                header: "Telefone",
                            },
                            {
                                key: "email",
                                header: "E-mail",
                            },
                            {
                                key: "idade",
                                header: "Idade",
                            },
                        ]}
                        data={rows}
                        onRowClick={handleRowClick}
                    />
                </div>
            </Card>
        </div>
    );
}