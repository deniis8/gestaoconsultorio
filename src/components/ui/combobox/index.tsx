import type { ChangeEvent } from "react";
import styles from "./combobox.module.css";

export type ComboboxOption = {
  label: string;
  value: string;
};

type ComboboxProps = {
  name?: string;
  label?: string;
  options: ComboboxOption[];
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  disabled?: boolean;
};

export function Combobox({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
  id,
  disabled = false,
}: ComboboxProps) {
  const selectId = id ?? name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.campo}>
      {label && (
        <label htmlFor={selectId}>
          {label}
        </label>
      )}

      <select
        id={selectId}
        name={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={styles.select}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
