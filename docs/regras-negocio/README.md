# Regras de negócio — Gestão Consultório

Este diretório documenta as regras de negócio e decisões de arquitetura do projeto, para que implementações futuras não precisem re-explorar todo o código para recuperar contexto.

Sistema de gestão para consultório de **psicologia**, uso de uma única profissional (não é multi-tenant). Stack: React 19 + TypeScript + Vite, Supabase (Postgres + Auth), sem backend próprio.

## Arquivos

- [padroes-tecnicos.md](padroes-tecnicos.md) — arquitetura, convenções de código, padrões de UI e armadilhas já corrigidas (ler antes de tocar em qualquer módulo).
- [dashboard.md](dashboard.md) — as 6 views SQL do dashboard e o que cada indicador significa (única página do projeto que usa views em vez de join no client).
- [pacientes.md](pacientes.md) — cadastro de pacientes e vínculo com plano de cobrança.
- [planos-cobranca.md](planos-cobranca.md) — tipos de plano (Avulso/Pacote/Mensal) e o que cada campo significa.
- [agenda.md](agenda.md) — agendamentos, recorrência, status e o gatilho de geração financeira.
- [financeiro.md](financeiro.md) — geração automática de cobranças e CRUD manual.
- [configuracoes-e-auth.md](configuracoes-e-auth.md) — login, logout, dados da profissional.

## Módulos ainda não implementados

- **Relatórios**: não implementado, sem previsão.

## Onde está o schema do banco

`docs/sql/schema.sql` — schema de referência (o comentário no topo do arquivo diz que não é executável, é só documentação; o usuário edita a estrutura direto no Supabase e às vezes atualiza esse arquivo depois, então trate como "provavelmente correto, mas confirme com o usuário se algo parecer estranho").
