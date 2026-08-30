export const formatCPF = (value: string): string => {
  // 1. Remove tudo o que não for número (letras, espaços, etc.)
  const digits = value.replace(/\D/g, '');

  // 2. Limita o máximo de caracteres para 11 (tamanho do CPF)
  const limitedDigits = digits.slice(0, 11);

  // 3. Aplica os pontos e hífen dinamicamente conforme o usuário digita
  return limitedDigits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
};
