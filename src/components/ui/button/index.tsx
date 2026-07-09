import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";

type ButtonIcon = "add" | "search" | "delete";

type ButtonType = "button" | "submit" | "reset" | "cancel";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children?: ReactNode;
  icon?: ButtonIcon;
  type?: ButtonType;
};

export function Button({ children, className, icon, type = "button", ...props }: ButtonProps) {
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

  const htmlType = type === "cancel" ? "button" : type;
  const buttonClass = [styles.button, type === "cancel" ? styles.cancel : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={htmlType} className={buttonClass} {...props}>
      {icon ? <span className={styles.icon} aria-hidden="true">{renderIcon()}</span> : null}
      {children}
    </button>
  );
}
