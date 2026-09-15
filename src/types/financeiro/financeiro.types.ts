export interface Financeiro {
    id_financeiro?: string;
    id_paciente_plano?: string;
    id_agenda?: string;
    descricao?: string;
    origem?: string;
    valor?: number;
    referencia_inicio?: string;
    referencia_fim?: string;
    data_cobranca?: string;
    data_vencimento?: string;
    data_pagamento?: string;
    status?: string;
    observacoes?: string;
}
