import type { CSSProperties } from "react";

/**
 * Chip suave: fundo translúcido na cor do status + texto na própria cor,
 * em vez de pílula sólida com texto branco.
 */
export function estiloBadgeStatus(cor: string): CSSProperties {
  return {
    backgroundColor: `${cor}1F`,
    color: cor,
  };
}
