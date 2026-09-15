# Agenda

Arquivos: `src/pages/agendamentos/agenda/index.tsx` (calendário), `src/pages/agendamentos/formulario-agenda/index.tsx` (modal criar/editar), `src/services/apis-supabase/agenda/agenda.service.ts`, `src/types/agenda/agenda.types.ts`.

UI: `react-big-calendar` + `date-fns` (locale ptBR). Cadastro/edição é **modal sobreposto**, não rota dedicada (única exceção ao padrão de tela do projeto).

## Campos de data/hora

`hora_inicio` e `hora_fim` são colunas **`timestamptz`** (data+hora completos), não `time` puro. `data_agendamento` é uma coluna `date` separada, mantida em paralelo (um pouco redundante, mas intencional). No formulário, o usuário informa Data + Hora Início + Duração (minutos); a Hora Fim é **calculada no client** (`calcularHoraFim`), nunca digitada.

Construção de datas sempre via componentes numéricos (`montarDataHora`), nunca concatenação de string — ver [padroes-tecnicos.md](padroes-tecnicos.md#regras-e-armadilhas-já-corrigidas-não-reintroduzir).

## Status (`status_sessao`)

Valores exatos: `Agendado` | `Confirmado` | `Realizado` | `Cancelado` | `Falta`.

- Todo agendamento novo nasce como `Agendado`. O campo Status fica **oculto** no modo criação (forçado) e só aparece **editável no modo edição**.
- Marcar como **Realizado** é o gatilho que dispara a geração automática de cobrança no Financeiro (ver [financeiro.md](financeiro.md)). O disparo só ocorre na **transição** para Realizado (compara `statusOriginal` capturado ao carregar o registro vs. `statusSelecionado` no submit) — salvar de novo uma consulta que já estava Realizado (ex: só editando observações) não reprocessa o financeiro. Antes de salvar, se essa transição for gerar uma cobrança (Avulso ou Mensal completando ciclo), aparece um diálogo de confirmação com o valor e o paciente (`avaliarCobrancaPorSessaoRealizada`); cancelar aborta o salvamento inteiro (nem a consulta é atualizada).
- Cores no calendário: mapa fixo por status (`CORES_STATUS` em `agenda/index.tsx`).

## `id_paciente_plano` é fixado na criação e nunca migrado

Ao criar um agendamento, `id_paciente_plano` é resolvido automaticamente a partir do **plano ativo atual** do paciente selecionado (`pacientePlanoService.buscarPorIdPaciente`) e gravado na linha. **Esse valor nunca é re-resolvido depois** — nem ao editar a consulta, nem quando a sessão é marcada Realizado dias/semanas depois. Isso é proposital: se o paciente trocar de plano no meio do tratamento, sessões antigas continuam vinculadas ao contrato sob o qual foram de fato agendadas/realizadas, em vez de serem repricificadas retroativamente pelo plano atual.

Se o paciente não tiver plano ativo, a criação do agendamento é **bloqueada** com toast de erro (sem plano não há como gerar cobrança depois).

## Recorrência

Campo `frequencia` (`Sem recorrência` | `Semanal` | `Quinzenal` | `Mensal`) + `data_fim_recorrencia`, só visíveis/aplicáveis no **modo criação**. Ao escolher uma frequência, o sistema gera de fato **N linhas independentes** na tabela `agenda`, todas compartilhando o mesmo `id_grupo_recorrencia` (UUID gerado no client via `crypto.randomUUID()`), uma requisição em lote (`agendaService.inserirVarios`, POST com array — PostgREST insere tudo numa transação atômica).

- Cada ocorrência é calculada **a partir da data original** (`addDays`/`addMonths` sobre o `start`), nunca acumulando sobre a ocorrência anterior — evita perder dias em meses curtos (ex: dia 31 + 1 mês).
- Limite de segurança: **104 ocorrências** por série (evita loop/input absurdo). Se atingido, toast avisando que a série foi truncada.
- Editar uma ocorrência afeta **só aquela linha** — não existe edição em massa da série.
- Excluir: se a consulta pertence a uma série (`id_grupo_recorrencia` presente), o diálogo oferece "Excluir apenas esta" vs. "Excluir toda a série" (`confirmarComOpcoes` + `agendaService.excluirPorGrupoRecorrencia`). Consulta avulsa usa confirmação simples.

## Sem exclusão — usar status Cancelado

A Agenda **não tem** recurso de excluir consulta (removido deliberadamente). Para desmarcar/cancelar um atendimento, usar o Status `Cancelado` em vez de excluir — evita perder histórico e o risco de tentar excluir uma consulta que já gerou financeiro (que falharia por FK, já que `financeiro.id_agenda` referencia `agenda.id_agenda`). `agendaService` não tem métodos `excluir`/`excluirPorGrupoRecorrencia`.

## Fora de escopo (decisões deliberadas, não bugs)

- Sem verificação de conflito de horário entre agendamentos.
- `agendaService.listar()` não filtra por período — sempre busca a tabela inteira (aceitável na escala de uma única profissional).
