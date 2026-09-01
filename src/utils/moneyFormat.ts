export const mascaraMoney = (valor: string): string => {
  // Remove espaços
  let limpo = valor.replace(/\s/g, '');
  
  // Se tem AMBOS ponto e vírgula, remove pontos (são separadores de milhar PT-BR)
  if (limpo.includes('.') && limpo.includes(',')) {
    limpo = limpo.replace(/\./g, '');
  }
  
  // Converter vírgula para ponto para parseFloat funcionar corretamente
  const numero = parseFloat(limpo.replace(',', '.'));

  // Retorna 0,00 se o valor for inválido
  if (isNaN(numero)) return '0,00';

  // Formata usando pt-BR com exatamente 2 casas decimais, sem o símbolo da moeda
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
};

export const formatMoney = (valor: string): string => {
  let valorNumerico = valor.replace(/\D/g, '');

  if (valorNumerico.length === 0) {
    return '';
  }

  // Remove zeros à esquerda
  valorNumerico = valorNumerico.replace(/^0+(?!$)/, '');

  // Valores menores que R$ 1,00
  if (valorNumerico.length <= 2) {
    return `0,${valorNumerico.padStart(2, '0')}`;
  }

  // Separa reais e centavos
  let inteiro = valorNumerico.slice(0, -2);
  const decimal = valorNumerico.slice(-2);

  // Aplica separador de milhar
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${inteiro},${decimal}`;
}
