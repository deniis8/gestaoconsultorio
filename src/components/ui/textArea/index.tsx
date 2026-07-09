import type { ChangeEvent } from "react";
import styles from "./textArea.module.css";

type TextAreaProps = {
  name: string;
  placeholder?: string;
  id?: string;
  value?: string;
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextArea({
  name,
  placeholder,
  id,
  value,
  rows = 4,
  onChange,
}: TextAreaProps) {
  const textAreaId = id ?? name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.campo}>
      <label htmlFor={textAreaId} className={styles.label}>
        {name}
      </label>
      <textarea
        id={textAreaId}
        name={textAreaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={styles.textarea}
      />
    </div>
  );
}
