import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

type ButtonIcon = "add" | "search" | "delete" | "back" | "edit";

type ButtonType = "button" | "submit" | "reset";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children?: ReactNode;
  icon?: ButtonIcon;
  type?: ButtonType;
  variant?: ButtonVariant
};

export function Button({
  children,
  className,
  icon,
  variant = "primary",
  ...props
}: ButtonProps) {
  const renderIcon = () => {
    switch (icon) {
      case "search":
        return <IoSearch />;
      case "delete":
        return <RiDeleteBin5Line />;
      case "back":
        return <FaArrowAltCircleLeft />;
      case "add":
        return <IoMdAdd />;
      case "edit":
        return <FaPencil />;
      default:
        return null;
    }
  };

  const buttonClass = [
    styles.button,
    variant === "secondary" && styles.secondary,
    variant === "danger" && styles.danger,
    variant === "warning" && styles.warning,
    variant === "success" && styles.success,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} {...props}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon()}
        </span>
      )}
      {children}
    </button>
  );
}