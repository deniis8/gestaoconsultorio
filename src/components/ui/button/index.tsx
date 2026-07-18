import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

type ButtonIcon = "add" | "search" | "delete" | "back" | "edit";

type ButtonType = "button" | "submit" | "reset" | "cancel" | "edit";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children?: ReactNode;
  icon?: ButtonIcon;
  type?: ButtonType;
};

export function Button({
  children,
  className,
  icon,
  type = "button",
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

  // O atributo HTML aceita apenas button, submit ou reset
  const htmlType: "button" | "submit" | "reset" =
    type === "submit"
      ? "submit"
      : type === "reset"
      ? "reset"
      : "button";

  const buttonClass = [
    styles.button,
    type === "cancel" && styles.cancel,
    type === "edit" && styles.edit,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={htmlType} className={buttonClass} {...props}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon()}
        </span>
      )}
      {children}
    </button>
  );
}