import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styles from "./input.module.css";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";


type ButtonIcon = "email" | "password";

type InputProps = {
  name?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  icon?: ButtonIcon;
  error?: boolean
};

export function Input({
  name,
  placeholder,
  type = "text",
  id,
  value,
  onChange,
  error = false,
  icon
}: InputProps) {
  const inputId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  const renderIcon = () => {
    switch (icon) {
      case "email":
        return <AiOutlineMail />;
      case "password":
        return <RiLockPasswordLine />;
      default:
        return null;
    }
  }

  return (
    <div className={styles.campo}>
      <label htmlFor={inputId} className={styles.label}>
        {name}
      </label>

      <div className={styles["input-container"]}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {renderIcon()}
          </span>
        )}

        <input
          type={type}
          id={inputId}
          name={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            ${styles.input}
            ${icon ? styles["input-with-icon"] : ""}
            ${error ? styles.error : ""}
          `}
        />
      </div>
    </div>
  );
}
