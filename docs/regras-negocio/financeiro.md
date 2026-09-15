# Financeiro

Arquivos: `src/pages/financeiro/`, `src/services/apis-supabase/financeiro/financeiro.service.ts`, `src/services/financeiro/gerarFinanceiro.ts` (regra de negócio/orquestração, separado do CRUD cru), `src/types/financeiro/financeiro.types.ts`, `src/utils/financeiroFormat.ts` (rótulos amigáveis e cores).

## Campo `origem` — de onde veio o lançamento

Valores exatos: `MANUAL` | `AGENDA_AVULSO` | `AGENDA_MENSAL` | `PACOTE`. Usado tanto para exibir rótulo amigável quanto para a lógica de não-duplicação (contagem de ciclos Mensal já cobrados filtra por `origem=eq.AGENDA_MENSAL`).

## Campo `status`

`Pendente` (padrão ao criar) → `Pago` (exige `data_pagamento` preenchida) → `Cancelado`.

## Geração automática — 3 gatilhos diferentes, cada um numa regra do sistema

Toda a decisão fica em `src/services/financeiro/gerarFinanceiro.ts`, com funções exportadas nomeadas pelo gatilho (propositalmente não unificadas, pois o timing/regra de cada uma é fundamentalmente diferente):

### 1. `avaliarCobrancaPorSessaoRealizada(agendamento)` — chamada de `formulario-agenda` quando um agendamento transiciona para status `Realizado`, **antes** de salvar

Diferente do fluxo de Pacote (que gera direto), Avulso/Mensal passam por uma etapa de **avaliação prévia com confirmação**: a função só *avalia* se geraria cobrança (e quanto), sem inserir nada — retorna `null` (nada a gerar) ou `{ mensagemConfirmacao, confirmarEGerar }`. O `formulario-agenda` mostra um diálogo (`confirmar()`) com a mensagem antes de salvar a consulta; se a psicóloga **cancelar**, a operação inteira é abortada (nem a consulta é salva, nem a cobrança é gerada — ela pode reconsiderar e tentar de novo). Se confirmar, salva a consulta e só então chama `confirmarEGerar()`, com um toast de sucesso próprio ("Cobrança gerada com sucesso.") separado do toast de "Consulta atualizada com sucesso!".

- Busca o `paciente_plano` (por `id_paciente_plano` do agendamento, via `buscarPorIdPacientePlano` — **sem** filtrar por status ativo, porque o contrato pode já ter encerrado quando a sessão é processada) e o `planos_cobranca` associado, pra saber `forma_cobranca`.
- **`SESSAO`**: gera 1 lançamento (`origem=AGENDA_AVULSO`) vinculado a esse `id_agenda` específico, valor = `paciente_plano.valor_contratado`. Idempotente: checa antes se já existe lançamento pra aquele `id_agenda` (`financeiroService.buscarPorIdAgenda`).
- **`MENSAL`**: **recalcula sob demanda** — busca todas as sessões `Realizado` daquele `id_paciente_plano` (`agendaService.listarRealizadosPorPacientePlano`, ordenado por data), calcula quantos ciclos completos de `quantidade_contratada_sessoes` sessões existem (`Math.floor(total / tamanhoCiclo)`), compara com quantos lançamentos `AGENDA_MENSAL` já existem pra esse contrato, e gera só os ciclos que faltam. `referencia_inicio`/`referencia_fim` = data da primeira/última sessão daquele ciclo (fatiando a lista ordenada em blocos de `tamanhoCiclo`).
- **`PACOTE`**: não gera nada aqui (ver função separada abaixo).

**Limitação conhecida e aceita**: a contagem do ciclo Mensal é por **quantidade total** de sessões Realizado, não por sequência cronológica sem furos. Se a sessão 4 nunca virar Realizado mas a 5ª sim, o sistema já considera o ciclo de 4 completo (são 4 Realizado no total, mesmo que "fora de ordem"). Não desfaz cobrança já gerada se um status for revertido depois (ex: Realizado → Cancelado).

### 2. `gerarFinanceiroPorContratacaoPacote(pacientePlano)` — chamada de `formulario-paciente`, só no branch de **criação** de um `paciente_plano` novo (nunca em edição)

Só gera algo se o `planos_cobranca` vinculado for `forma_cobranca=PACOTE`. Gera 1 lançamento (`origem=PACOTE`) com valor = `valor_contratado`, `referencia_inicio/fim` = `data_inicio/data_fim` do contrato, `data_vencimento` = `data_inicio` (cobrado imediatamente, já que Pacote é pago antecipado).

**Limitação conhecida e aceita**: como editar o plano de um paciente já existente sempre faz `PATCH` in-place (nunca cria um `paciente_plano` novo — ver [pacientes.md](pacientes.md)), migrar um paciente existente para um plano Pacote **não** gera cobrança automática. Precisa lançamento manual nesse caso.

### Isolamento de erros

Em ambos os gatilhos, a chamada de geração fica num `try/catch` **separado** do salvamento principal (consulta/paciente). Se a geração falhar, a ação principal já foi salva com sucesso — o usuário recebe um toast de aviso pedindo para conferir/lançar manualmente, nunca uma mensagem de "não foi possível salvar".

## CRUD manual

Mesmo padrão de tela de Pacientes/Planos de Cobrança (`tela-principal`, `formulario-financeiro`, `visualizacao-financeiro`, rotas `/financeiro`, `/financeiro/formulario/:id?`, `/financeiro/visualizacao/:id`).

- Ao criar manualmente: seleciona um Paciente (combobox), o sistema resolve `id_paciente_plano` automaticamente a partir do plano **ativo** do paciente (mesmo padrão de auto-resolução da Agenda) — bloqueia com toast se não houver plano ativo. `origem` é sempre forçado a `MANUAL`. Descrição é pré-sugerida ("Lançamento - {nome}") mas editável.
- Ao editar um lançamento **automático** (`origem != MANUAL`): a origem é mostrada como texto somente leitura (contexto), mas o resto dos campos (status, valor, vencimento, pagamento, observações) continua editável — é assim que a profissional marca uma cobrança automática como paga.
- Combobox de Paciente é desabilitado em modo edição (trocar o paciente de um lançamento existente é uma operação estranha; cancelar e criar novo em vez disso).
- Campo Status = "Pago" exige `data_pagamento`; ao trocar para "Pago" com o campo vazio, é auto-preenchido com a data de hoje (editável).
- **Sem exclusão** (removido deliberadamente, mesma decisão da Agenda) — para invalidar um lançamento, usar o Status `Cancelado`. `financeiroService` não tem método `excluir`.

## Listagem

Como `financeiro` só guarda `id_paciente_plano` (não o nome do paciente diretamente), a tela busca `financeiro`, `paciente_plano` e `pacientes` em paralelo e casa os três em memória pra montar a coluna "Paciente" (mesmo padrão de join client-side usado no resto do projeto — sem embedding do PostgREST). Busca por texto filtra pela `descricao` (`ilike`).

## Proteção contra duplicidade (opcional, não implementada)

Tudo roda client-side sem transação/lock de banco. Para uma app de uso único o risco de duplicidade por concorrência é desprezível, mas se quiser uma rede de segurança extra no Supabase:

```sql
create unique index financeiro_avulso_unico on financeiro (id_agenda) where origem = 'AGENDA_AVULSO';
create unique index financeiro_mensal_unico on financeiro (id_paciente_plano, referencia_fim) where origem = 'AGENDA_MENSAL';
```
