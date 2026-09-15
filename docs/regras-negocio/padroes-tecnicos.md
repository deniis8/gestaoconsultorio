# Padrões técnicos e convenções

## Stack e bibliotecas

- React 19 + TypeScript + Vite. Roteamento: `react-router-dom` v7 (`createBrowserRouter`, centralizado em `src/App.tsx`).
- Supabase: SDK (`@supabase/supabase-js`) usado **só para autenticação** (`src/services/auth/supabase.ts`, `src/services/auth/authService.ts`). Todo dado de negócio (pacientes, agenda, financeiro, etc.) passa por um wrapper `fetch` cru contra a REST API do PostgREST: `src/services/api/api.ts` (`api<T>(endpoint, options)`), usando os nomes de tabela em `src/services/api/endpoints.ts`.
- Sem lib de formulário (nada de react-hook-form/zod/yup/formik). Formulários são 100% controlados manualmente com `useState`.
- Sem gerenciador de estado global (Redux/Zustand/Context). Estado é local por componente; o único hook compartilhado é `useAuth()` (`src/hooks/useAuth.ts`), que expõe `{ user, loading }` a partir da sessão do Supabase.
- UI própria em `src/components/ui/*` (Button, Input, InputData, InputValor, Combobox, TextArea, Table, Card, Label, Toggle, InputPesquisar) + CSS Modules. Sem Tailwind/MUI/AntD/shadcn.
- Notificações: `react-hot-toast`. Confirmações: `sweetalert2` via `confirmar()` (booleano) e `confirmarComOpcoes()` (3 opções: confirm/deny/cancel) em `src/components/layout/mensagem/index.tsx`.
- Loading: `Loading` (overlay, `src/components/layout/loading`) para ações assíncronas (salvar/excluir); `react-loading-skeleton` para o carregamento inicial de página (um componente `SkeletonX` por módulo, em `pages/<modulo>/skeleton/`).
- Calendário: `react-big-calendar` + `date-fns` (locale `ptBR`), usado só na Agenda.

## Padrão de módulo (repetido em Pacientes, Agenda, Planos de Cobrança, Financeiro)

```
src/types/<entidade>/<entidade>.types.ts        # interface simples, campos opcionais
src/services/apis-supabase/<entidade>/<entidade>.service.ts
                                                 # classe com listar/buscarPorId/buscarPorNome (ou buscarPorDescricao)/
                                                 # inserir/atualizar/excluir, chamando api<T>(ENDPOINTS.x, ...),
                                                 # exporta uma instância singleton (ex: `export const pacientesService = new PacientesService()`)
src/pages/<modulo>/
  tela-principal/index.tsx           # listagem: Header + Card + InputPesquisar + Table, botão "Novo X"
  formulario-<nome>/index.tsx        # criar/editar (rota /modulo/formulario/:id?)
  visualizacao-<nome>/index.tsx      # view-only + botão Editar (rota /modulo/visualizacao/:id)
  skeleton/{skeleton-principal,skeleton-formulario,skeleton-visualizar}/skeleton.tsx
```

Exceção: **Agenda** não segue o padrão de rotas dedicadas — o cadastro/edição é um modal sobreposto na própria tela de calendário (`src/pages/agendamentos/agenda/index.tsx` + `formulario-agenda/index.tsx`), decisão deliberada por ser mais natural para UX de calendário.

## Regras e armadilhas já corrigidas (não reintroduzir)

- **Nunca envie `id_usuario` manualmente** nos payloads de insert. A coluna tem `DEFAULT auth.uid()` no banco; nenhum service do projeto envia esse campo.
- **Nunca busque "o usuário atual" com `.listar()[0]`.** Sempre resolva pelo id da sessão: `const { user } = useAuth(); usuariosService.buscarPorId(user.id)`. (Bug real já corrigido em Configurações — ver [configuracoes-e-auth.md](configuracoes-e-auth.md).)
- **Ids de rota**: sempre `useParams()`, nunca `window.location.pathname.split("/").pop()` (bug real já corrigido em `visualizacao-pacientes` e `visualizacao-cobranca`).
- **Datas**: monte `Date` a partir de componentes numéricos (`new Date(ano, mes-1, dia, hora, minuto)`), nunca concatenando string ISO manualmente (interpretaria horário local como UTC). Serialize para colunas `timestamptz` com `.toISOString()`. Para exibir datas (`date` puro, formato `yyyy-MM-dd`), use `formatSimpleDate` (`src/utils/dataFormat.ts`) que faz split de string em vez de `new Date(...)`, evitando o bug clássico de "data volta um dia" em fuso negativo (Brasil é UTC-3). Para formatar timestamps completos, use `date-fns/format`, nunca `.toISOString().slice(...)`.
- **Botões de salvar/excluir**: sempre com estado `salvando`/`excluindo` + `disabled` durante a ação + overlay `Loading`, para evitar duplo-clique gerando registros duplicados. Padrão: `try { setSalvando(true); ... } catch { toast.error(...) } finally { setSalvando(false) }`.
- **Erros de efeito colateral não devem se misturar com o erro da ação principal.** Ex.: se salvar um agendamento tem sucesso mas a geração automática de financeiro falha, isso precisa de um `try/catch` **separado**, com toast próprio — nunca reportar "não foi possível salvar X" quando X já foi salvo com sucesso e só um efeito colateral falhou.
- **Sem embedding do PostgREST** (`?select=*,tabela(...)`) em nenhum lugar do projeto. Joins são sempre feitos no client: busca-se as listas separadamente e casa-se por id em memória (ver `visualizacao-pacientes` e a listagem do Financeiro).
- **Exclusão com erro de chave estrangeira**: use `isErroChaveEstrangeira(error)` (`src/utils/apiErrorFormat.ts`, checa código Postgres `23503` no texto do erro) para mostrar uma mensagem amigável específica em vez do erro genérico quando o registro tem dependências (ex.: excluir paciente com agendamentos vinculados, excluir plano já contratado). Só existe recurso de excluir em Pacientes e Planos de Cobrança (botão só em modo edição, com `confirmar()` antes, navega para a listagem em vez de `navigate(-1)`). **Agenda e Financeiro não têm exclusão** (removida deliberadamente) — o cancelamento é feito via campo Status (`Cancelado`), para não arriscar perder histórico.
- **Botões dentro de `<form>`**: sempre `type="button"` explícito em botões que não devem submeter (ex.: "Esqueci minha senha" no Login) — o padrão HTML de `<button>` sem `type` dentro de um form é `submit`.
- **`<Link>` do react-router com `onClick` assíncrono é perigoso**: o `Link` navega imediatamente de forma síncrona, antes do `onClick` assíncrono terminar. Se a navegação precisa esperar uma confirmação/ação assíncrona (ex.: logout), use um elemento comum (`<a>`/`<button>`) com `preventDefault()` e navegue manualmente só depois da ação concluir. Bug real já corrigido no logout do menu (`src/components/layout/menu/index.tsx`).
- **Filtros "ativos"**: planos de cobrança inativos não devem aparecer em comboboxes de seleção para novos contratos (`planosCobrancaService.listarAtivos()`), mas um contrato já existente com plano hoje inativo precisa continuar aparecendo na edição (marcado como "(inativo)") para não ficar em branco.
