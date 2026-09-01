import { ChangeEvent } from "react";
import styles from "./input-valor.module.css";
import { formatMoney } from "../../../utils/moneyFormat";

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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const formatado = formatMoney(event.target.value);

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
