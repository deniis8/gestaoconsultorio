-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.usuarios (
  id_usuario uuid NOT NULL DEFAULT auth.uid(),
  nome_completo character varying,
  crp character varying,
  email character varying UNIQUE,
  telefone character varying,
  sobre_voce text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario)
);
CREATE TABLE public.pacientes (
  id_paciente uuid NOT NULL DEFAULT gen_random_uuid(),
  nome_completo character varying,
  data_nascimento date,
  cpf character varying,
  telefone_principal character varying,
  telefone_secundario character varying,
  email character varying,
  numero character varying,
  bairro character varying,
  cidade character varying,
  estado character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id_usuario uuid DEFAULT auth.uid(),
  cep character varying,
  logradouro character varying,
  complemento character varying,
  observacoes_administrativas character varying,
  CONSTRAINT pacientes_pkey PRIMARY KEY (id_paciente),
  CONSTRAINT pacientes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.planos_cobranca (
  id_plano_cobranca uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying,
  forma_cobranca character varying,
  valor_padrao numeric,
  quantidade_padrao_sessoes smallint,
  ativo boolean,
  id_usuario uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT planos_cobranca_pkey PRIMARY KEY (id_plano_cobranca),
  CONSTRAINT planos_cobranca_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.paciente_plano (
  id_paciente_plano uuid NOT NULL DEFAULT gen_random_uuid(),
  id_paciente uuid,
  id_plano_cobranca uuid,
  valor_contratado numeric,
  quantidade_contratada_sessoes smallint,
  data_inicio date,
  data_fim date,
  status text,
  id_usuario uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT paciente_plano_pkey PRIMARY KEY (id_paciente_plano),
  CONSTRAINT paciente_plano_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente),
  CONSTRAINT paciente_plano_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario),
  CONSTRAINT paciente_plano_id_plano_cobranca_fkey FOREIGN KEY (id_plano_cobranca) REFERENCES public.planos_cobranca(id_plano_cobranca)
);
CREATE TABLE public.agenda (
  id_agenda uuid NOT NULL DEFAULT gen_random_uuid(),
  id_paciente_plano uuid,
  id_paciente uuid,
  data_agendamento date,
  hora_fim timestamp with time zone,
  tipo_consulta character varying,
  status_sessao character varying,
  frequencia character varying,
  data_fim_recorrencia date,
  id_grupo_recorrencia uuid,
  observacoes character varying,
  id_usuario uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  hora_inicio timestamp with time zone,
  CONSTRAINT agenda_pkey PRIMARY KEY (id_agenda),
  CONSTRAINT agenda_id_paciente_plano_fkey FOREIGN KEY (id_paciente_plano) REFERENCES public.paciente_plano(id_paciente_plano),
  CONSTRAINT agenda_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente),
  CONSTRAINT agenda_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.financeiro (
  id_financeiro uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id_paciente_plano uuid,
  id_agenda uuid,
  descricao text,
  origem character varying,
  valor numeric,
  referencia_inicio date,
  referencia_fim date,
  data_cobranca date,
  data_vencimento date,
  data_pagamento date,
  status character varying,
  observacoes character varying,
  id_usuario uuid DEFAULT auth.uid(),
  CONSTRAINT financeiro_pkey PRIMARY KEY (id_financeiro),
  CONSTRAINT financeiro_id_paciente_plano_fkey FOREIGN KEY (id_paciente_plano) REFERENCES public.paciente_plano(id_paciente_plano),
  CONSTRAINT financeiro_id_agenda_fkey FOREIGN KEY (id_agenda) REFERENCES public.agenda(id_agenda),
  CONSTRAINT financeiro_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);