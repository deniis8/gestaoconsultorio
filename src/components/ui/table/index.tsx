import type { ReactNode } from "react";
import styles from "./table.module.css";

type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
};

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado",
}: TableProps<T>) {
  if (!data.length) {
    return <div className={styles.empty}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={styles.th}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={styles.tr}>
              {columns.map((column) => (
                <td key={String(column.key)} className={styles.td}>
                  {column.render ? column.render(item) : String(item[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
