export const formatMoney = (valor: string): string => {
  // Converte para número caso receba uma string com pontos/vírgulas
  const numero = parseFloat(valor.replace(/[^\d,-]/g, '').replace(',', '.'));

  // Retorna 0,00 se o valor for inválido
  if (isNaN(numero)) return '0,00';

  // Formata usando pt-BR com exatamente 2 casas decimais, sem o símbolo da moeda
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
};
