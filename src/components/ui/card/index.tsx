import type { ReactNode } from "react";
import "./card.css";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={`card ${className ?? ""}`.trim()}>
      {title ? <h2 className="card-title">{title}</h2> : null}
      <div className="card-content">{children}</div>
    </div>
  );
}
