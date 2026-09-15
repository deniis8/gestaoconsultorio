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

/**
 * Calcula a idade a partir de uma data de nascimento no formato AAAA-MM-DD.
 * Considera mês/dia (não é só "ano atual - ano de nascimento").
 * @param dataNascimento - Exemplo: "1992-04-12"
 */
export const calcularIdade = (dataNascimento: string): number | null => {
  if (!dataNascimento) return null;

  const [anoNascimento, mesNascimento, diaNascimento] = dataNascimento.split('-').map(Number);
  if (!anoNascimento || !mesNascimento || !diaNascimento) return null;

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();

  let idade = anoAtual - anoNascimento;
  const aniversarioJaOcorreuEsteAno =
    mesAtual > mesNascimento || (mesAtual === mesNascimento && diaAtual >= diaNascimento);

  if (!aniversarioJaOcorreuEsteAno) idade--;

  return idade;
};
