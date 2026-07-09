import { ReactNode } from "react";
import "./header.css";

type HeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <div className="container-principal">
      <div className="container-title">
        <h1 className="header-title">{title}</h1>
        {subtitle ? <h2 className="header-subtitle">{subtitle}</h2> : null}
      </div>
      {children ? <div className="children">{children}</div> : null}
    </div>
  );
}
