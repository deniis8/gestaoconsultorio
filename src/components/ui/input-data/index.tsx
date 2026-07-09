import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./input-data.module.css";

type InputDataProps = {
  name?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InputData({
  name,
  placeholder,
  type = "date",
  id,
  value,
  onChange,
}: InputDataProps) {
  const inputId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.campo}>
      {name ? (
        <label htmlFor={inputId} className={styles.label}>
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
        className={styles.input}
      />
    </div>
  );
}
