import type { ChangeEvent, InputHTMLAttributes } from "react";
import styles from "./input-pesquisar.module.css";
import { CiSearch } from "react-icons/ci";

type InputPesquisarProps = InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function InputPesquisar({
  placeholder = "Pesquisar",
  value,
  onChange,
  className,
  ...props
}: InputPesquisarProps) {
  return (
    <div className={`${styles.container} ${className ?? ""}`.trim()}>
      <span className={styles.icon} aria-hidden="true">
        <CiSearch />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        {...props}
      />
    </div>
  );
}
