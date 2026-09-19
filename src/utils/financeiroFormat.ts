import { mascaraMoney } from "./moneyFormat";

export const LABELS_ORIGEM_FINANCEIRO: Record<string, string> = {
  MANUAL: "Lançamento Manual",
  AGENDA_AVULSO: "Sessão Avulsa",
  AGENDA_MENSAL: "Mensalidade",
  PACOTE: "Pacote",
};

export const formatarOrigemFinanceiro = (origem?: string): string => {
  if (!origem) return "";
  return LABELS_ORIGEM_FINANCEIRO[origem] ?? origem;
};

export const formatarMoeda = (valor: number): string => {
  return `R$ ${mascaraMoney(valor.toString())}`;
};

export const CORES_STATUS_FINANCEIRO: Record<string, string> = {
  Pendente: "#B8863A",
  Pago: "#3F7A52",
  Cancelado: "#A6432F",
};
