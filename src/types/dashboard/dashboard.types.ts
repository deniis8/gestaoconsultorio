export interface ResumoFinanceiroDashboard {
    recebido: number;
    pendente: number;
    atrasado: number;
    receita_prevista: number;
    consultas_realizadas: number;
    taxa_comparecimento: number;
}

export interface ReceitaMensalDashboard {
    mes_referencia: string;
    valor_recebido: number;
}

export interface DistribuicaoPlanoDashboard {
    id_plano_cobranca: string;
    nome_plano: string;
    forma_cobranca: string;
    quantidade_pacientes: number;
}

export interface AgendaHojeDashboard {
    id_agenda: string;
    hora_inicio: string;
    hora_fim: string;
    duracao_minutos: number;
    nome_paciente: string;
    tipo_consulta: string;
    status_sessao: string;
}

export interface ProximaConsultaDashboard {
    id_agenda: string;
    hora_inicio: string;
    hora_fim: string;
    nome_paciente: string;
    tipo_consulta: string;
    status_sessao: string;
}

export interface CobrancaVencidaDashboard {
    id_financeiro: string;
    descricao: string;
    valor: number;
    data_vencimento: string;
    id_paciente: string;
    nome_paciente: string;
}
