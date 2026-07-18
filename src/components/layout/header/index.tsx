import { ReactNode } from "react";
import styles from "./header.module.css";

type HeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <div className={styles["container-principal"]}>
      <div className={styles["container-title"]}>
        <h1 className={styles["header-title"]}>{title}</h1>
        {subtitle ? <h2 className={styles["header-subtitle"]}>{subtitle}</h2> : null}
      </div>
      {children ? <div className={styles["children"]}>{children}</div> : null}
    </div>
  );
}
