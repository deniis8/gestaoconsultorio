export interface Paciente {
    id_paciente?: string;
    nome_completo?: string;
    data_nascimento?: Date;
    cpf?: string;
    telefone_principal?: string;
    telefone_secundario?: string;
    email?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    complemento?: string;
    observacoes_administrativas?: string;
    id_usuario?: string;
    created_at?: Date;
}