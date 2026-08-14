GRANT SELECT, INSERT, UPDATE, DELETE
ON public.agenda
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.financeiro
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.paciente_plano
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.pacientes
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.planos_cobranca
TO authenticated;

GRANT SELECT, UPDATE
ON public.usuarios
TO authenticated;