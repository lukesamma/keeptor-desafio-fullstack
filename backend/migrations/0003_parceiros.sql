-- ---------------------------------------------------------------------------
-- 0003_parceiros.sql: cadastro de parceiros (desafio Keeptor)
--
-- Decisões de modelagem: docs/ADR-001-modelagem-parceiros.md
-- ---------------------------------------------------------------------------

-- Mantém updated_at coerente sem depender do client.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.parceiro (
    id                           uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social                 text            NOT NULL,
    nome_fantasia                text            NOT NULL,
    cnpj                         char(14)        NOT NULL,
    inscricao_estadual           text,
    telefone                     varchar(11)     NOT NULL,
    email                        text            NOT NULL,
    data_inicio_relacionamento   date            NOT NULL,
    limite_credito               numeric(15, 2)  NOT NULL DEFAULT 0,
    ativo                        boolean         NOT NULL DEFAULT true,
    municipio_id                 integer         NOT NULL REFERENCES public.municipio (id),
    cep                          char(8)         NOT NULL,
    bairro                       text            NOT NULL,
    logradouro                   text            NOT NULL,
    numero                       text            NOT NULL,
    complemento                  text,
    created_at                   timestamptz     NOT NULL DEFAULT now(),
    updated_at                   timestamptz     NOT NULL DEFAULT now(),

    CONSTRAINT parceiro_razao_social_nao_vazia
        CHECK (length(trim(razao_social)) > 0),
    CONSTRAINT parceiro_nome_fantasia_nao_vazio
        CHECK (length(trim(nome_fantasia)) > 0),
    CONSTRAINT parceiro_cnpj_formato
        CHECK (cnpj ~ '^[0-9]{14}$'),
    CONSTRAINT parceiro_cnpj_unico
        UNIQUE (cnpj),
    CONSTRAINT parceiro_telefone_formato
        CHECK (telefone ~ '^[0-9]{10,11}$'),
    CONSTRAINT parceiro_email_formato
        CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    CONSTRAINT parceiro_limite_credito_nao_negativo
        CHECK (limite_credito >= 0),
    CONSTRAINT parceiro_cep_formato
        CHECK (cep ~ '^[0-9]{8}$'),
    CONSTRAINT parceiro_bairro_nao_vazio
        CHECK (length(trim(bairro)) > 0),
    CONSTRAINT parceiro_logradouro_nao_vazio
        CHECK (length(trim(logradouro)) > 0),
    CONSTRAINT parceiro_numero_nao_vazio
        CHECK (length(trim(numero)) > 0)
);

COMMENT ON TABLE public.parceiro IS
    'Empresas parceiras (cliente, fornecedor ou representante). Um endereço por registro.';
COMMENT ON COLUMN public.parceiro.cnpj IS 'CNPJ com 14 dígitos, sem máscara; único no sistema.';
COMMENT ON COLUMN public.parceiro.municipio_id IS 'Município IBGE; a UF é obtida via municipio.uf_id.';
COMMENT ON COLUMN public.parceiro.limite_credito IS 'Valor em reais; formulário vazio grava 0.';

CREATE INDEX IF NOT EXISTS parceiro_municipio_id_idx
    ON public.parceiro (municipio_id);

CREATE INDEX IF NOT EXISTS parceiro_created_at_idx
    ON public.parceiro (created_at DESC);

DROP TRIGGER IF EXISTS parceiro_set_updated_at ON public.parceiro;
CREATE TRIGGER parceiro_set_updated_at
    BEFORE UPDATE ON public.parceiro
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security: dados de negócio só para sessão autenticada.
ALTER TABLE public.parceiro ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS parceiro_select_authenticated ON public.parceiro;
CREATE POLICY parceiro_select_authenticated
    ON public.parceiro
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS parceiro_insert_authenticated ON public.parceiro;
CREATE POLICY parceiro_insert_authenticated
    ON public.parceiro
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS parceiro_update_authenticated ON public.parceiro;
CREATE POLICY parceiro_update_authenticated
    ON public.parceiro
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE 'GRANT SELECT, INSERT, UPDATE ON TABLE public.parceiro TO authenticated';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        EXECUTE 'GRANT ALL ON TABLE public.parceiro TO service_role';
    END IF;
END
$$;
