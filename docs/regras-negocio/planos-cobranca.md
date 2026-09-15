# Planos de Cobrança

Arquivos: `src/pages/planos-cobranca/`, `src/services/apis-supabase/planos-cobranca/planos-cobranca.service.ts`, `src/types/planos-cobranca/planos-cobranca.types.ts`.

Existem dois níveis de "plano":

- **`planos_cobranca`**: o *template/catálogo* de planos que a profissional oferece (ex: "Sessão Avulsa", "Pacote Trimestral", "Mensal 4x"). Tem `valor_padrao` e `quantidade_padrao_sessoes` como sugestão inicial.
- **`paciente_plano`**: o *contrato* de um paciente específico com um desses templates — pode ter `valor_contratado`/`quantidade_contratada_sessoes` diferentes do padrão do template (negociação individual). **É esse valor contratado, não o valor padrão do template, que é usado para gerar cobranças no Financeiro.**

Ao selecionar um plano de cobrança no cadastro/edição de paciente (`formulario-paciente`), `valor_contratado` e `quantidade_contratada_sessoes` são **pré-preenchidos** com `valor_padrao`/`quantidade_padrao_sessoes` do template escolhido (`handleSelecionarPlanoCobranca`, busca o plano por id e preenche os campos) — mas continuam editáveis, para permitir negociação individual. Trocar o plano selecionado depois sobrescreve esses campos de novo com os padrões do novo plano.

## `forma_cobranca` — os 3 tipos (valores exatos usados no banco/código: `SESSAO` | `PACOTE` | `MENSAL`)

| Tipo | Rótulo na UI | Quando cobra | Campo `quantidade` |
|---|---|---|---|
| `SESSAO` | "Por Sessão" | A cada atendimento marcado como **Realizado** na Agenda | Fixo em 1 (campo desabilitado, forçado ao salvar) — "por sessão" é 1 sessão |
| `PACOTE` | "Pacote" | Uma única vez, **antecipado**, no momento em que o `paciente_plano` é contratado (paciente novo) | Total de sessões do pacote |
| `MENSAL` | "Mensal" | Só ao completar um ciclo de N sessões Realizado | Tamanho do ciclo (N) |

Ver [financeiro.md](financeiro.md) para o detalhe de como cada tipo dispara a geração automática de cobrança.

## Regras da tela de cadastro de plano (template)

- Ao escolher "Por Sessão", o campo de quantidade de sessões é desabilitado e **zerado** ao salvar (não faz sentido ter uma quantidade fixa para cobrança por sessão).
- Toggle "Plano ativo": só planos ativos aparecem no combobox de contratação em Pacientes (`listarAtivos()`). Desativar um plano não afeta contratos (`paciente_plano`) já existentes.
- Validação mínima antes de salvar: nome, valor > 0, e quantidade de sessões > 0 (exceto para `SESSAO`).

## Exclusão

Botão "Excluir" no `formulario-cobranca` (modo edição), com confirmação. Se o plano já tiver sido contratado por algum paciente (`paciente_plano.id_plano_cobranca`), a exclusão falha por FK e mostra mensagem amigável — nesse caso, desativar o plano (toggle "Plano ativo") é a alternativa correta, não excluir.

## Listagem

Mostra rótulos amigáveis ("Por Sessão"/"Pacote"/"Mensal"), não o código bruto salvo no banco.
