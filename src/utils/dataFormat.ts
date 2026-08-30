/**
 * Transforma uma string no formato AAAA-MM-DD em DD/MM/AAAA
 * @param dateString - Exemplo: "1992-04-12"
 * @returns String formatada: "12/04/1992"
 */
export const formatSimpleDate = (dateString: string): string => {
  if (!dateString) return '';

  // Divide a string para evitar problemas de fuso horário do Objeto Date
  const [year, month, day] = dateString.split('-');

  // Garante que a string possui os três compenentes necessários
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};
