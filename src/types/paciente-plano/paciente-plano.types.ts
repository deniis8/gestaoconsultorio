export interface PacientePlano {
    id_paciente_plano?: string;
    id_paciente?: string;
    id_plano_cobranca?: string;
    valor_contratado?: number;
    quantidade_contratada_sessoes?: number;
    data_inicio?: Date | string;
    data_fim?: Date | string;
    status?: string;
    id_usuario?: string;
}