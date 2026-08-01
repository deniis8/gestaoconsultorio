export interface Paciente {
    id_paciente: string;
    nome_completo: string;
    data_nascimento: Date;
    cpf: string;
    telefone_principal: string;
    telefone_secundario: string;
    email: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    observacoes: string;
    id_usuario: string;
    created_at: Date;
}