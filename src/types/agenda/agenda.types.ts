export interface Agenda {
    id_agenda: string;
    id_paciente_plano: string;
    id_paciente: string | Date;
    data_agendamento?: string | Date;
    hora_inicio?: string | Date;
    hora_fim?: string | Date;
    tipo_consulta?: string;
    status_sessao?: string;
    frequencia?: string;
    data_fim_recorrencia?: string | Date;
    id_grupo_recorrencia?: string;
    observacoes?: string;
    id_usuario?: string;
}