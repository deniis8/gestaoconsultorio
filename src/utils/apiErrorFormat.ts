export function isErroChaveEstrangeira(error: unknown): boolean {
  const mensagem = error instanceof Error ? error.message : String(error);
  return mensagem.includes("23503");
}
