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

export const CORES_STATUS_FINANCEIRO: Record<string, string> = {
  Pendente: "#E0A800",
  Pago: "#2FA84F",
  Cancelado: "#D9534F",
};
