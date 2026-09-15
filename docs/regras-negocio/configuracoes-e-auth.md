# Configurações e Autenticação

Arquivos: `src/pages/configuracoes/`, `src/pages/login/`, `src/components/layout/menu/index.tsx`, `src/services/auth/`, `src/hooks/useAuth.ts`.

## Sistema é de uso único (uma profissional só)

A tabela `usuarios` conceitualmente guarda uma única linha (a psicóloga), com `id_usuario` = uuid da sessão Supabase Auth (`DEFAULT auth.uid()`). **Nunca buscar via `usuariosService.listar()[0]`** — sempre resolver pelo id da sessão autenticada: `const { user } = useAuth(); usuariosService.buscarPorId(user.id)`. (Isso já foi um bug real: as duas telas de Configurações buscavam "o primeiro usuário da tabela" sem filtrar pela sessão.)

## Login (`src/pages/login/index.tsx`)

- Campos dentro de um `<form onSubmit={...}>` de verdade (Enter funciona). Botão "Esqueci minha senha" é `type="button"` explícito (não é um recurso implementado, só não deve disparar submit).
- Botão de entrar e os inputs desabilitam durante `loadingLogin`; `handleLogin` tem guarda contra chamada duplicada.
- E-mail é `trim()`ado antes de enviar ao Supabase.
- Enquanto `useAuth()` ainda está resolvendo a sessão (`loading=true`) ou já existe usuário autenticado, a tela renderiza só um `Loading`, nunca o formulário (evita "flash" do formulário de login pra quem já está logado, antes do redirect pro Dashboard).

## Logout (`src/components/layout/menu/index.tsx`)

**Não usar `<Link>` do react-router com `onClick` assíncrono aqui.** O item "Sair" é um `<a>` comum com `onClick` que chama `event.preventDefault()` e só then dispara `handleLogout` (confirmação via `confirmar()` → `logout()` do Supabase → `navigate('/')`). Isso corrige um bug real: com `<Link to="/" onClick={handleLogout}>`, o `Link` navegava pra `"/"` **imediatamente**, de forma síncrona, antes do usuário nem responder o diálogo de confirmação — como a tela de Login redireciona pro Dashboard sempre que detecta sessão ativa, e o logout real (assíncrono) ainda não tinha acontecido, o usuário era jogado de volta pro Dashboard em vez de deslogar.

## Configurações (`src/pages/configuracoes/`)

- `ConfiguracoesVisualizacao`: view-only + botão Editar. Redireciona pra `/` se `!user` (com `return` logo após — não continua tentando buscar dados de qualquer forma).
- `ConfiguracoesEdicao`: formulário simples (nome, CRP, telefone, sobre você — e-mail é somente leitura). Tem estado `salvando` + `Loading` overlay + botão desabilitado durante o submit.
- Nenhum campo é marcado como obrigatório na UI (sem `*`) — diferente de Pacientes/Agenda/Financeiro, aqui não há validação de campo obrigatório antes de salvar, isso é intencional (dados de perfil, não regra de negócio crítica).
