import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./input-data.module.css";

type InputDataProps = {
  name?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  id?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InputData({
  name,
  placeholder,
  type = "date",
  id,
  value,
  disabled = false,
  onChange,
}: InputDataProps) {
  const inputId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.campo}>
      {name ? (
        <label htmlFor={inputId}>
          {name}
        </label>
      ) : null}
      <input
        type={type}
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        step={type === "time" ? 60 : undefined}
        className={styles.input}
      />
    </div>
  );
}
