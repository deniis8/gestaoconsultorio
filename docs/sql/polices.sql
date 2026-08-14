-- POLICES usuarios 
 CREATE POLICY "SELECT"
ON public.usuarios
FOR SELECT
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "UPDATE"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (
    id_usuario = auth.uid()
);


-- POLICES planos_cobranca
CREATE POLICY "SELECT"
ON public.planos_cobranca
FOR SELECT
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "INSERT"
ON public.planos_cobranca
FOR INSERT
TO authenticated
WITH CHECK (
    id_usuario = auth.uid()
);

CREATE POLICY "UPDATE"
ON public.planos_cobranca
FOR UPDATE
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "DELETE"
ON public.planos_cobranca
FOR DELETE
TO authenticated
USING (
    id_usuario = auth.uid()
);



-- POLICES pacientes
CREATE POLICY "SELECT"
ON public.pacientes
FOR SELECT
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "INSERT"
ON public.pacientes
FOR INSERT
TO authenticated
WITH CHECK (
    id_usuario = auth.uid()
);

CREATE POLICY "UPDATE"
ON public.pacientes
FOR UPDATE
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "DELETE"
ON public.pacientes
FOR DELETE
TO authenticated
USING (
    id_usuario = auth.uid()
);


-- POLICES paciente_plano
CREATE POLICY "SELECT"
ON public.paciente_plano
FOR SELECT
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "INSERT"
ON public.paciente_plano
FOR INSERT
TO authenticated
WITH CHECK (
    id_usuario = auth.uid()
);

CREATE POLICY "UPDATE"
ON public.paciente_plano
FOR UPDATE
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "DELETE"
ON public.paciente_plano
FOR DELETE
TO authenticated
USING (
    id_usuario = auth.uid()
);


-- POLICES financeiro
CREATE POLICY "SELECT"
ON public.financeiro
FOR SELECT
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "INSERT"
ON public.financeiro
FOR INSERT
TO authenticated
WITH CHECK (
    id_usuario = auth.uid()
);

CREATE POLICY "UPDATE"
ON public.financeiro
FOR UPDATE
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "DELETE"
ON public.financeiro
FOR DELETE
TO authenticated
USING (
    id_usuario = auth.uid()
);


-- POLICES agenda
CREATE POLICY "SELECT"
ON public.agenda
FOR SELECT
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "INSERT"
ON public.agenda
FOR INSERT
TO authenticated
WITH CHECK (
    id_usuario = auth.uid()
);

CREATE POLICY "UPDATE"
ON public.agenda
FOR UPDATE
TO authenticated
USING (
    id_usuario = auth.uid()
);

CREATE POLICY "DELETE"
ON public.agenda
FOR DELETE
TO authenticated
USING (
    id_usuario = auth.uid()
);