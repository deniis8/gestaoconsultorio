import type { ReactNode } from "react";
import styles from "./card.module.css";

type CardProps = {
  title?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Card({ title, actions, children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {(title || actions) && (
        <div className={styles["card-header"]}>
          {title && <h2 className={styles["card-title"]}>{title}</h2>}
          {actions}
        </div>
      )}

      <div className={styles["card-content"]}>
        {children}
      </div>
    </div>
  );
}