import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./input.module.css";

type InputProps = {
  name?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean
};

export function Input({
  name,
  placeholder,
  type = "text",
  id,
  value,
  onChange,
  error = false
}: InputProps) {
  const inputId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.campo}>
      <label htmlFor={inputId} className={styles.label}>
        {name}
      </label>
      <input
        type={type}
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ""}`}
      />
    </div>
  );
}
