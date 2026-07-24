import styles from "./toggle.module.css";

type ToggleProps = {
  id?: string;
  name?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

export function Toggle({
  id,
  name,
  label,
  checked = false,
  disabled = false,
  onChange,
}: ToggleProps) {
  return (
    <label className={styles.container}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />

      <span className={styles.toggle}>
        <span className={styles.thumb}></span>
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}