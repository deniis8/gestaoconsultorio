import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";

type ButtonIcon = "add" | "search" | "delete";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ButtonIcon;
};

export function Button({ children, className, icon, ...props }: ButtonProps) {
  const renderIcon = () => {
    switch (icon) {
      case "search":
        return <IoSearch />;
      case "delete":
        return <RiDeleteBin5Line />;
      case "add":
      default:
        return <IoMdAdd />;
    }
  };

  return (
    <button className={`${styles.button} ${className ?? ""}`.trim()} {...props}>
      {icon ? <span className={styles.icon} aria-hidden="true">{renderIcon()}</span> : null}
      {children}
    </button>
  );
}
