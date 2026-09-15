# Dashboard

Arquivos: `src/pages/dashboard/`, `src/services/apis-supabase/dashboard/dashboard.service.ts`, `src/types/dashboard/dashboard.types.ts`, views em `docs/sql/views.sql`.

## Única página do projeto que depende de views SQL

Todo o resto do app faz queries flat + join no client (ver [padroes-tecnicos.md](padroes-tecnicos.md)). O Dashboard é a exceção: as agregações cruzam `financeiro` × `agenda` × `paciente_plano` × `planos_cobranca` × `pacientes`, e fazer isso no client exigiria buscar todo o histórico a cada carregamento. Em vez disso, 6 views (`vw_dashboard_*`) fazem a agregação no Postgres e são consumidas pelo `dashboardService` exatamente como qualquer outra "tabela" via `api()` — do ponto de vista do front, uma view é indistinguível de uma tabela somente-leitura.

**Todas as views são `security_invoker = true`** (Postgres 15+/Supabase) + filtro explícito `id_usuario = auth.uid()` dentro da própria view. Sem isso, a view rodaria com os privilégios de quem a criou e ignoraria a RLS das tabelas base (`docs/sql/polices.sql`). Se criar uma view nova para o Dashboard no futuro, repita esse padrão.

## As 6 views e o que cada uma decide

- **`vw_dashboard_resumo_financeiro`** (1 linha, mês vigente): `recebido` (pago com vencimento pago no mês), `pendente` (pendente com **vencimento no mês vigente**), `atrasado` (pendente com vencimento no passado, **de qualquer mês** — é um acumulado de inadimplência, não só do mês atual), `receita_prevista` = `recebido + pendente` (não soma `atrasado`, pois ele pode ser de meses anteriores — somar inflaria a previsão do mês), `consultas_realizadas` e `taxa_comparecimento` (`Realizado / (Realizado + Falta)`, só no mês vigente).
- **`vw_dashboard_receita_mensal`**: últimos 12 meses via `generate_series`, `LEFT JOIN` com financeiro pago — meses sem receita aparecem como `0`, não desaparecem (importante pro gráfico não distorcer a escala nem pular meses).
- **`vw_dashboard_distribuicao_planos`**: conta `paciente_plano` com `status='ativo'` por plano, `LEFT JOIN` a partir de `planos_cobranca` (planos sem paciente aparecem com `0`).
- **`vw_dashboard_agenda_hoje`** / **`vw_dashboard_proxima_consulta`**: agenda do dia e o próximo agendamento futuro (`hora_inicio >= now()`, excluindo `Cancelado`/`Realizado`/`Falta`).
- **`vw_dashboard_cobranca_vencida`**: uma linha por cobrança vencida — o indicador "quantos pacientes" é `new Set(linhas.map(l => l.id_paciente)).size` no front (evita contar 2x um paciente com múltiplas cobranças vencidas), não uma contagem de linhas.

## Limitação aceita: fuso horário do servidor

`CURRENT_DATE`/`now()` nas views usam o fuso do Postgres (normalmente UTC), não o de Brasília. Para uma psicóloga só, o risco de um agendamento próximo à meia-noite cair no "dia errado" no Dashboard é aceito — corrigir exigiria fixar o timezone da sessão do banco ou calcular os limites do dia no client.

## Gráfico de receita mensal

`grafico-receita-mensal/index.tsx` é um SVG customizado (sem lib de gráficos) — série única, sem legenda (o título do card já nomeia a série), barras com topo arredondado, tooltip só no hover. `mes_referencia` vem como string `"yyyy-MM-dd"` (date puro) — **nunca use `new Date(...)` nela** (mesma armadilha do fuso horário documentada em `padroes-tecnicos.md`); o mês é extraído direto da string (`slice(5,7)`). Já os campos `hora_inicio`/`hora_fim` do Dashboard são `timestamptz` completos — esses sim podem passar por `new Date(...)` com segurança.

## Reaproveitamento

`CORES_STATUS_AGENDA` (cores por `status_sessao`) foi extraído de `agenda/index.tsx` para `src/utils/agendaFormat.ts`, e é usado tanto na Agenda quanto na tabela "Agenda de Hoje" do Dashboard — evita duas cópias divergentes do mesmo mapa de cores.
