-- ============================================================
-- Views do Dashboard
--
-- Todas criadas com security_invoker = true para que a RLS das
-- tabelas base (id_usuario = auth.uid(), ver polices.sql) continue
-- valendo quando a view é consultada via PostgREST — sem isso, a
-- view rodaria com os privilégios de quem a criou, ignorando a RLS.
-- O filtro "id_usuario = auth.uid()" é repetido explicitamente em
-- cada view como reforço (defense in depth).
--
-- Limitação aceita: CURRENT_DATE/now() usam o fuso do servidor
-- Postgres (normalmente UTC), não o fuso de Brasília.
-- ============================================================

-- 1) Resumo financeiro do mês vigente
CREATE VIEW public.vw_dashboard_resumo_financeiro
WITH (security_invoker = true) AS
WITH base AS (
    SELECT
        COALESCE(SUM(f.valor) FILTER (
            WHERE f.status = 'Pago'
              AND f.data_pagamento >= date_trunc('month', CURRENT_DATE)
              AND f.data_pagamento < date_trunc('month', CURRENT_DATE) + interval '1 month'
        ), 0) AS recebido,
        COALESCE(SUM(f.valor) FILTER (
            WHERE f.status = 'Pendente'
              AND f.data_vencimento >= date_trunc('month', CURRENT_DATE)
              AND f.data_vencimento < date_trunc('month', CURRENT_DATE) + interval '1 month'
        ), 0) AS pendente,
        COALESCE(SUM(f.valor) FILTER (
            WHERE f.status = 'Pendente'
              AND f.data_vencimento < CURRENT_DATE
        ), 0) AS atrasado
    FROM public.financeiro f
    WHERE f.id_usuario = auth.uid()
),
agenda_mes AS (
    SELECT
        COUNT(*) FILTER (WHERE a.status_sessao = 'Realizado') AS realizadas,
        COUNT(*) FILTER (WHERE a.status_sessao IN ('Realizado', 'Falta')) AS base_comparecimento
    FROM public.agenda a
    WHERE a.id_usuario = auth.uid()
      AND a.data_agendamento >= date_trunc('month', CURRENT_DATE)
      AND a.data_agendamento < date_trunc('month', CURRENT_DATE) + interval '1 month'
)
SELECT
    base.recebido,
    base.pendente,
    base.atrasado,
    base.recebido + base.pendente AS receita_prevista,
    agenda_mes.realizadas AS consultas_realizadas,
    COALESCE(ROUND(100.0 * agenda_mes.realizadas / NULLIF(agenda_mes.base_comparecimento, 0), 0), 0) AS taxa_comparecimento
FROM base, agenda_mes;

GRANT SELECT ON public.vw_dashboard_resumo_financeiro TO authenticated;


-- 2) Receita recebida nos últimos 12 meses (meses sem receita aparecem como 0)
CREATE VIEW public.vw_dashboard_receita_mensal
WITH (security_invoker = true) AS
SELECT
    to_char(meses.mes_referencia, 'YYYY-MM-DD') AS mes_referencia,
    COALESCE(SUM(f.valor), 0) AS valor_recebido
FROM generate_series(
    date_trunc('month', CURRENT_DATE) - interval '11 months',
    date_trunc('month', CURRENT_DATE),
    interval '1 month'
) AS meses(mes_referencia)
LEFT JOIN public.financeiro f
    ON f.id_usuario = auth.uid()
   AND f.status = 'Pago'
   AND f.data_pagamento >= meses.mes_referencia
   AND f.data_pagamento < meses.mes_referencia + interval '1 month'
GROUP BY meses.mes_referencia
ORDER BY meses.mes_referencia;

GRANT SELECT ON public.vw_dashboard_receita_mensal TO authenticated;


-- 3) Quantidade de pacientes (contrato ativo) por plano de cobrança
CREATE VIEW public.vw_dashboard_distribuicao_planos
WITH (security_invoker = true) AS
SELECT
    pc.id_plano_cobranca,
    pc.nome AS nome_plano,
    pc.forma_cobranca,
    COUNT(pp.id_paciente_plano) AS quantidade_pacientes
FROM public.planos_cobranca pc
LEFT JOIN public.paciente_plano pp
    ON pp.id_plano_cobranca = pc.id_plano_cobranca
   AND pp.status = 'ativo'
   AND pp.id_usuario = auth.uid()
WHERE pc.id_usuario = auth.uid()
GROUP BY pc.id_plano_cobranca, pc.nome, pc.forma_cobranca
ORDER BY quantidade_pacientes DESC;

GRANT SELECT ON public.vw_dashboard_distribuicao_planos TO authenticated;


-- 4) Agenda de hoje
CREATE VIEW public.vw_dashboard_agenda_hoje
WITH (security_invoker = true) AS
SELECT
    a.id_agenda,
    a.hora_inicio,
    a.hora_fim,
    ROUND(EXTRACT(EPOCH FROM (a.hora_fim - a.hora_inicio)) / 60)::int AS duracao_minutos,
    p.nome_completo AS nome_paciente,
    a.tipo_consulta,
    a.status_sessao
FROM public.agenda a
JOIN public.pacientes p ON p.id_paciente = a.id_paciente
WHERE a.id_usuario = auth.uid()
  AND a.data_agendamento = CURRENT_DATE
ORDER BY a.hora_inicio;

GRANT SELECT ON public.vw_dashboard_agenda_hoje TO authenticated;


-- 5) Próxima consulta (a partir de agora, ignorando canceladas/já concluídas)
CREATE VIEW public.vw_dashboard_proxima_consulta
WITH (security_invoker = true) AS
SELECT
    a.id_agenda,
    a.hora_inicio,
    a.hora_fim,
    p.nome_completo AS nome_paciente,
    a.tipo_consulta,
    a.status_sessao
FROM public.agenda a
JOIN public.pacientes p ON p.id_paciente = a.id_paciente
WHERE a.id_usuario = auth.uid()
  AND a.hora_inicio >= now()
  AND a.status_sessao NOT IN ('Cancelado', 'Realizado', 'Falta')
ORDER BY a.hora_inicio
LIMIT 1;

GRANT SELECT ON public.vw_dashboard_proxima_consulta TO authenticated;


-- 6) Cobranças vencidas (pendentes com vencimento no passado)
CREATE VIEW public.vw_dashboard_cobranca_vencida
WITH (security_invoker = true) AS
SELECT
    f.id_financeiro,
    f.descricao,
    f.valor,
    f.data_vencimento,
    p.id_paciente,
    p.nome_completo AS nome_paciente
FROM public.financeiro f
JOIN public.paciente_plano pp ON pp.id_paciente_plano = f.id_paciente_plano
JOIN public.pacientes p ON p.id_paciente = pp.id_paciente
WHERE f.id_usuario = auth.uid()
  AND f.status = 'Pendente'
  AND f.data_vencimento < CURRENT_DATE
ORDER BY f.data_vencimento;

GRANT SELECT ON public.vw_dashboard_cobranca_vencida TO authenticated;
