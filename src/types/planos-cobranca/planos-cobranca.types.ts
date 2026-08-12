export interface PlanosCobranca {
    id_plano_cobranca?: string;
    nome: string;
    forma_cobranca: string;
    valor_padrao: number;
    quantidade_padrao_sessoes: number;
    ativo: boolean;
    id_usuario: string;
}