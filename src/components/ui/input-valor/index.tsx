import { ChangeEvent } from "react";
import styles from "./input-valor.module.css";

type InputValorProps = {
  name?: string;
  placeholder?: string;
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function InputValor({
  name,
  placeholder = "R$ 0,00",
  id,
  value = "",
  onChange,
}: InputValorProps) {
  const inputId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  function formatCurrency(valor: string) {
    const numeros = valor.replace(/\D/g, "");

    const numero = Number(numeros) / 100;

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
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
      />
    </div>
  );
}