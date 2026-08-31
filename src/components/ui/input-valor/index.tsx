import { ChangeEvent } from "react";
import styles from "./input-valor.module.css";

type InputValorProps = {
  name?: string;
  placeholder?: string;
  id?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export function InputValor({
  name,
  placeholder = "0,00",
  id,
  value = "",
  disabled = false,
  onChange,
}: InputValorProps) {
  const inputId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  function formatCurrency(valor: string) {
    // Remove tudo o que não for dígito numérico
    const numeros = valor.replace(/\D/g, "");

    // Se o campo for esvaziado, retorna string vazia para limpar o input
    if (!numeros) return "";

    // Aplica a lógica de centavos dividindo por 100
    const numero = Number(numeros) / 100;

    // Formata usando pt-BR com 2 casas decimais obrigatórias, sem o símbolo da moeda
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const formatado = formatCurrency(event.target.value);

    onChange?.(formatado);
  }

  return (
    <div className={styles.campo}>
      {name && (
        <label htmlFor={inputId}>
          {name}
        </label>
      )}

      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={styles.input}
        disabled={disabled}
      />
    </div>
  );
}
