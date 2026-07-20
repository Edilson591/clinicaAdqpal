--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountType" AS ENUM (
    'CHECKING',
    'SAVINGS',
    'CASH',
    'CREDIT_CARD',
    'INVESTMENT'
);


ALTER TYPE public."AccountType" OWNER TO postgres;

--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED',
    'CONFIRMED',
    'IN_PROGRESS',
    'CANCELED',
    'NO_SHOW'
);


ALTER TYPE public."AppointmentStatus" OWNER TO postgres;

--
-- Name: AppointmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentType" AS ENUM (
    'IN_PERSON',
    'ONLINE',
    'HOME_CARE'
);


ALTER TYPE public."AppointmentType" OWNER TO postgres;

--
-- Name: CategoryType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CategoryType" AS ENUM (
    'INCOME',
    'EXPENSE',
    'BOTH'
);


ALTER TYPE public."CategoryType" OWNER TO postgres;

--
-- Name: EmployeeStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EmployeeStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'ON_LEAVE',
    'TERMINATED'
);


ALTER TYPE public."EmployeeStatus" OWNER TO postgres;

--
-- Name: NotaFiscalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotaFiscalStatus" AS ENUM (
    'PENDENTE',
    'EMITIDA',
    'CANCELADA',
    'PROCESSANDO',
    'ERRO'
);


ALTER TYPE public."NotaFiscalStatus" OWNER TO postgres;

--
-- Name: PatientHistoryType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PatientHistoryType" AS ENUM (
    'CONSULTA',
    'EXAME',
    'PRESCRICAO',
    'OBSERVACAO',
    'SOLICITACAO'
);


ALTER TYPE public."PatientHistoryType" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'PIX',
    'BANK_TRANSFER',
    'INSURANCE',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);


ALTER TYPE public."TransactionStatus" OWNER TO postgres;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionType" AS ENUM (
    'INCOME',
    'EXPENSE',
    'TRANSFER'
);


ALTER TYPE public."TransactionType" OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_realtime_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_realtime_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_realtime_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_realtime_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_realtime_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    -- Reset the role on every FOR..LOOP batch execution.
                    -- The first batch of 10 rows is pre-fetched using the current connection role (PG internal behaviour)
                    -- then we have to reset it again otherwise it would use the role defined in the `set_config` above
                    -- to fetch the remaining rows when rows>10, which could be a user-defined role that lacks execution grants.
                    -- The flow is:
                    --   1. run batch with conn role
                    --   2. set_config working_role
                    --   3. execute walrus
                    --   4. reset role (revert)
                    --   5. repeat
                    perform set_config('role', null, true);

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_realtime_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_realtime_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_realtime_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_realtime_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_realtime_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) OWNER TO supabase_realtime_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_realtime_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_realtime_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_realtime_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_realtime_admin;

--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) OWNER TO supabase_realtime_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_realtime_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_realtime_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_realtime_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordResetToken" (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id text NOT NULL,
    user_id text NOT NULL,
    patient_id text NOT NULL,
    scheduled_at timestamp(3) without time zone NOT NULL,
    status public."AppointmentStatus" DEFAULT 'SCHEDULED'::public."AppointmentStatus" NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    medico text,
    address text,
    meeting_link text,
    room_id text,
    specialty_id text,
    type public."AppointmentType" DEFAULT 'IN_PERSON'::public."AppointmentType" NOT NULL
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    user_id text NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    entity_id text,
    before jsonb,
    after jsonb,
    ip text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: doctor_specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_specialties (
    "doctorId" text NOT NULL,
    "specialtyId" text NOT NULL
);


ALTER TABLE public.doctor_specialties OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id text NOT NULL,
    name text NOT NULL,
    cpf text,
    email text,
    phone text,
    "position" text NOT NULL,
    department text,
    hire_date timestamp(3) without time zone,
    salary numeric(10,2),
    status public."EmployeeStatus" DEFAULT 'ACTIVE'::public."EmployeeStatus" NOT NULL,
    date_of_birth timestamp(3) without time zone,
    gender text,
    street text,
    street_number text,
    city text,
    state text,
    zip_code text,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: empresa_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_config (
    id text NOT NULL,
    "razaoSocial" text NOT NULL,
    cnpj text NOT NULL,
    "inscricaoMunicipal" text NOT NULL,
    "municipioCodigo" text NOT NULL,
    "nfeLogin" text NOT NULL,
    "nfeSenha" text NOT NULL,
    "nfeAmbiente" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.empresa_config OWNER TO postgres;

--
-- Name: financial_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_accounts (
    id text NOT NULL,
    name text NOT NULL,
    type public."AccountType" NOT NULL,
    bank text,
    initial_balance numeric(10,2) DEFAULT 0 NOT NULL,
    currency text DEFAULT 'BRL'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    color text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    pluggy_account_id text
);


ALTER TABLE public.financial_accounts OWNER TO postgres;

--
-- Name: financial_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_categories (
    id text NOT NULL,
    name text NOT NULL,
    type public."CategoryType" NOT NULL,
    color text,
    icon text,
    parent_id text,
    is_default boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.financial_categories OWNER TO postgres;

--
-- Name: medical_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records (
    id text NOT NULL,
    appointment_id text,
    patient_id text NOT NULL,
    diagnosis text,
    prescription text,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.medical_records OWNER TO postgres;

--
-- Name: notas_fiscais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notas_fiscais (
    id text NOT NULL,
    numero text NOT NULL,
    patient_id text NOT NULL,
    appointment_id text,
    transaction_id text,
    created_by text NOT NULL,
    servico text NOT NULL,
    valor numeric(10,2) NOT NULL,
    status public."NotaFiscalStatus" DEFAULT 'PENDENTE'::public."NotaFiscalStatus" NOT NULL,
    data_emissao timestamp(3) without time zone,
    pdf_url text,
    observacoes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notas_fiscais OWNER TO postgres;

--
-- Name: patient_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_history (
    id text NOT NULL,
    patient_id text NOT NULL,
    doctor_id text NOT NULL,
    appointment_id text,
    type public."PatientHistoryType" NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    attachments text[] DEFAULT ARRAY[]::text[],
    deleted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.patient_history OWNER TO postgres;

--
-- Name: patient_registration_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_registration_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_registration_seq OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    cpf text,
    date_of_birth timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    additional_info text,
    city text,
    state text,
    street text,
    street_number text,
    zip_code text,
    agreement text,
    gender text,
    registration_number text
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: pluggy_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pluggy_items (
    id text NOT NULL,
    pluggy_item_id text NOT NULL,
    connector_name text NOT NULL,
    connector_logo text,
    status text DEFAULT 'UPDATED'::text NOT NULL,
    last_sync timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pluggy_items OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specialties (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.specialties OWNER TO postgres;

--
-- Name: sus_procedures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sus_procedures (
    id text NOT NULL,
    codigo text NOT NULL,
    nome text NOT NULL,
    modalidade text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sus_procedures OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id text NOT NULL,
    account_id text NOT NULL,
    category_id text NOT NULL,
    patient_id text,
    appointment_id text,
    created_by text NOT NULL,
    type public."TransactionType" NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text NOT NULL,
    status public."TransactionStatus" DEFAULT 'PENDING'::public."TransactionStatus" NOT NULL,
    payment_method public."PaymentMethod" DEFAULT 'OTHER'::public."PaymentMethod" NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    paid_at timestamp(3) without time zone,
    reference text,
    is_recurring boolean DEFAULT false NOT NULL,
    recurring_group_id text,
    installment_number integer,
    total_installments integer,
    transfer_to_account_id text,
    tags text[] DEFAULT ARRAY[]::text[],
    attachment_url text,
    deleted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    cnpj text,
    cpf text,
    role_id integer NOT NULL,
    username text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_realtime_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordResetToken" (id, token, "userId", "expiresAt", "usedAt", "createdAt") FROM stdin;
cmp1hycw6000110nhhc9ccv1q	8083017a-c23c-4d57-ad6d-94ae3f33efea	fe0aea74-6d6b-4a20-ad6d-bd187de98bbe	2026-05-11 18:19:50.918	\N	2026-05-11 23:35:15.224
cmpluno3o0001p1t772raewp0	d53ee57d-8de6-44ee-96c3-9ad90ca0f807	638370af-4975-4c8b-ae04-6710da636090	2026-05-26 00:10:50.996	\N	2026-05-25 23:40:51.012
cmqgk99690001v97rjcd7wipe	2ae49eba-3e8b-4bd5-aeb9-8943a2b179c0	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	2026-06-16 12:00:33.76	\N	2026-06-16 11:30:33.775
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d8c7f9d3-8b46-4193-8788-792c08330a40	e6b3fbc6c1811831707feff3e5d86690fa97d9599c4dc83a81f80d8d10037f97	2026-05-02 17:25:42.875318+00	000_init		\N	2026-05-02 17:25:42.875318+00	0
0d271797-9e5b-4794-9f75-1bf3d1fb781d	8f002ce26244f428c3369682e2ea426b28dcba1ad2c387c803089131724f6a14	2026-05-02 17:29:13.312305+00	20260502172912_init	\N	\N	2026-05-02 17:29:12.748789+00	1
2ab06808-96b2-4114-b604-2820c2455847	4b59df8c970aa15f55d62ca717937a7772783f4014e2a4e30b059d445a594c8c	2026-05-02 21:35:07.48901+00	20260502213506_fixed_notas	\N	\N	2026-05-02 21:35:06.800887+00	1
940db34c-bee7-43dc-895c-226be29b0b51	7f68bda5fdb6e72dbd823e0082cb09e05092053438028d4e3289eb6a87d023ac	2026-05-08 19:37:57.682766+00	20260508193756_reset_password_migrate	\N	\N	2026-05-08 19:37:56.932501+00	1
2990c2ce-0db5-4fd0-bd59-5c80c551d433	5558a72973856b50677bf73155483fdccd427beecf113504fffc2594c7129095	2026-05-08 19:44:23.216335+00	20260508194421_reset_password_migrate	\N	\N	2026-05-08 19:44:22.266429+00	1
096f0dea-36d5-48f0-bc18-434e326809e0	ec7c681ece96d6805bb7cd606ca65ae3bbe91e176ffb81a234bc4123e6998943	2026-05-11 23:35:34.30452+00	20260511233533_passoword_reset_migrate	\N	\N	2026-05-11 23:35:33.644771+00	1
0f8c20da-561c-4555-a6d4-452b74ff61cd	064ab7ee639b6aca8bffda60f5d80932a96a7779e5deb9168d874753298180eb	2026-05-25 17:32:16.072315+00	20260525173214_create_audit_logs	\N	\N	2026-05-25 17:32:15.321522+00	1
5386acdc-bee2-46bb-a463-02dfd61ef408	9134c1e61041ebddd96a60008a1d1dd28d08003a03574e73a4833d5a1db2d389	\N	20260716173128_make_patient_registration_required	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260716173128_make_patient_registration_required\n\nDatabase error code: 23502\n\nDatabase error:\nERROR: column "registration_number" of relation "patients" contains null values\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23502), message: "column \\"registration_number\\" of relation \\"patients\\" contains null values", detail: None, hint: None, position: None, where_: None, schema: Some("public"), table: Some("patients"), column: Some("registration_number"), datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(6279), routine: Some("ATRewriteTable") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260716173128_make_patient_registration_required"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20260716173128_make_patient_registration_required"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226	2026-07-16 17:53:04.18352+00	2026-07-16 17:51:29.647458+00	0
1f3f5282-3866-49e9-ab12-97f2d0a48050	7d380bb0416b39b9b4439e5d3691d9e4a0d39c07b4205928831b9096f4cf5de7	2026-06-05 17:40:43.572312+00	20260605173742_add_sus_procedures	\N	\N	2026-06-05 17:40:42.910637+00	1
4be3b587-f414-4443-865c-9efbd8f1ceff	9d4541591060d32c206aa80580f17f0356fc7be0a40be25dffba7e218446ab99	\N	20260716171108_add_patient_registration	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260716171108_add_patient_registration\n\nDatabase error code: 22003\n\nDatabase error:\nERROR: setval: value 0 is out of bounds for sequence "patient_registration_seq" (1..9223372036854775807)\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E22003), message: "setval: value 0 is out of bounds for sequence \\"patient_registration_seq\\" (1..9223372036854775807)", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("sequence.c"), line: Some(989), routine: Some("do_setval") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260716171108_add_patient_registration"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20260716171108_add_patient_registration"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226	2026-07-16 17:50:06.835114+00	2026-07-16 17:44:45.356876+00	0
4dcd71b5-3ca6-4902-9d51-50b6fc452d5b	408eb98ee394326c8e6060909072144cba5c018ea11fb8475d3e02f048096a40	2026-07-16 17:51:29.380316+00	20260716171108_add_patient_registration	\N	\N	2026-07-16 17:51:28.647384+00	1
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, user_id, patient_id, scheduled_at, status, notes, created_at, updated_at, medico, address, meeting_link, room_id, specialty_id, type) FROM stdin;
a61b8f3e-ffbb-4692-985f-fa717e7be05a	83f24610-5266-4ef7-a2de-31660e96680b	688651c2-66a5-4f5e-a1e2-5f5be063befd	2026-07-13 17:45:00	COMPLETED	Ultrassonografia Ombro direito e Joelho esquerdo	2026-07-08 15:57:51.182	2026-07-16 12:31:27.176	\N	\N	\N	Sala 1	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	IN_PERSON
43e57fdf-ac24-41c1-a932-4caebcc6e647	83f24610-5266-4ef7-a2de-31660e96680b	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	2026-07-13 18:15:00	COMPLETED	Ultrassonografia joelho esquerdo	2026-07-08 15:59:06.447	2026-07-16 12:31:31.739	\N	\N	\N	Sala 1	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	IN_PERSON
62d91c12-c10c-4d04-ac2f-8e6ebfe24c5d	83f24610-5266-4ef7-a2de-31660e96680b	55283cbf-de1f-494e-8016-cff02dce6b1f	2026-07-13 17:00:00	COMPLETED	Ultrassonografia Joelho Esquerdo	2026-07-08 15:54:20.954	2026-07-16 12:30:51.288	\N	rua sem saida, 2313 — são miguel dos campos alagoas, AL	\N	Sala 1	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	IN_PERSON
cf5485bb-6336-4377-8b31-19cafcb36696	83f24610-5266-4ef7-a2de-31660e96680b	5442c855-819c-4fc0-882b-46ee4fca19bd	2026-07-13 17:15:00	COMPLETED	Ultrassonografia joelho direto	2026-07-08 15:55:23.06	2026-07-16 12:30:59.624	\N	\N	\N	Sala 1	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	IN_PERSON
9cc8aa71-8660-446d-926d-13f348496f72	83f24610-5266-4ef7-a2de-31660e96680b	4af17c3f-fd13-4940-93b7-22b102ff45e4	2026-07-13 17:30:00	COMPLETED	Ultrassonografia Joelho esquerdo	2026-07-08 15:55:56.919	2026-07-16 12:31:21.757	\N	\N	\N	Sala 1	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	IN_PERSON
c86895de-1e44-476f-bb4d-7518ed718698	83f24610-5266-4ef7-a2de-31660e96680b	04dc240c-a11e-4935-830e-6ebc2c3329cb	2026-07-13 18:30:00	COMPLETED	Ultrassonografia joelho esquerdo	2026-07-08 16:00:51.605	2026-07-16 12:31:36.591	\N	\N	\N	Sala 1	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	IN_PERSON
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity, entity_id, before, after, ip, user_agent, created_at) FROM stdin;
fa2f791a-4fb2-48e2-a9b3-e25e776355c4	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:38:21.115
629fd177-6653-4b5e-ac17-6f0d60781c39	system	LOGOUT	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:46:00.204
9ada539b-5e78-4c83-9b00-f2c3e93f7c4b	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:46:44.223
c22fa0b8-a069-4b30-9422-a8529218ed62	system	LOGOUT	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:47:07.318
3712e476-8a43-4ee6-884e-95d0d0e2bccf	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:47:54.933
fe9eb55f-7778-4898-8372-1ce57db510ec	system	LOGOUT	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:49:38.101
18e0bbba-f028-4583-8a0c-2dc0f9a958c1	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:49:53.53
470b3973-cb15-40ac-b22c-e65ea8290445	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:50:06.883
c9285b19-c7f6-4f8e-826d-d64a3c7e1000	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	6ab3cab1-75d1-4c34-8263-ebde05358272	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:52:35.761
c55887c7-c138-478f-91e9-6fac4727d6ff	638370af-4975-4c8b-ae04-6710da636090	UPDATE	PATIENT	6ab3cab1-75d1-4c34-8263-ebde05358272	{"id": "6ab3cab1-75d1-4c34-8263-ebde05358272", "cpf": "23423423456", "city": "32423'", "name": "twsetrwe", "email": "23423@gmail.com", "phone": "234234234", "state": "AL", "gender": "masculino", "street": "asdasd", "zipCode": "23423423", "agreement": "234234", "createdAt": "2026-04-16T19:07:10.986Z", "updatedAt": "2026-04-16T19:07:10.986Z", "dateOfBirth": "2026-04-16T19:06:39.213Z", "streetNumber": "34", "additionalInfo": "234234"}	{"id": "6ab3cab1-75d1-4c34-8263-ebde05358272", "cpf": "23423423456", "city": "32423'", "name": "twsetrwe", "email": "teste263@gmail.com", "phone": "234234234", "state": "AL", "gender": "masculino", "street": "asdasd", "zipCode": "23423423", "agreement": "234234", "createdAt": "2026-04-16T19:07:10.986Z", "updatedAt": "2026-05-25T17:52:44.213Z", "dateOfBirth": "2026-04-16T19:06:39.213Z", "streetNumber": "34", "additionalInfo": "234234"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:52:44.463
60c545a4-7e95-4c08-a481-59099bc29d74	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	6ab3cab1-75d1-4c34-8263-ebde05358272	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:52:44.711
e854c14f-b0d0-4f53-9995-9921d88c11f7	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	6ab3cab1-75d1-4c34-8263-ebde05358272	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:52:44.893
09de9694-5a57-4534-86b4-7c31552cbf21	638370af-4975-4c8b-ae04-6710da636090	CREATE	PATIENT	d6b43d42-78fb-4806-9071-a5c55c5453bf	null	{"name": "teste teste"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 17:54:07.028
54874adb-0ef3-4de8-8171-743ace8af9a6	638370af-4975-4c8b-ae04-6710da636090	CREATE	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	{"name": "teste"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:27:02.913
e35005da-e4ad-4eb6-9df0-4c505e3d3002	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:27:21.65
f6271be6-291c-47d2-a74c-3c248244df7b	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:28:41.313
cc0f51a5-ec95-4c7e-a5a4-7bdc7e5064d1	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:34:04.502
1065ee90-6065-4b60-bf6f-984e21d6a120	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:34:13.614
714e29e1-cf42-4f8f-a443-3c48df45847a	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:47:23.201
d59b4427-d87e-4af9-a59c-5d01a3d3fb97	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:47:25.142
c993cbc9-b9d3-4d74-a15e-1cf1e7fe0812	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:52:26.877
d93d4ada-9c01-4f47-8cac-c9f986001dc3	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	27584772-b675-488f-9bf5-f26f0cf42cba	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:52:30.314
3a3759fe-bd88-4fd0-9e4d-038734965aba	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	6ab3cab1-75d1-4c34-8263-ebde05358272	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:54:25.814
330f68b9-1e9b-4a7f-a3e1-ad881d31912b	638370af-4975-4c8b-ae04-6710da636090	CREATE	PATIENT	a1f3aa94-7e52-445f-9e1b-fa4ed7686d17	null	{"name": "testes efe"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:54:43.809
05fad5f7-1e9e-4c1c-b3eb-fd0f931da655	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	a1f3aa94-7e52-445f-9e1b-fa4ed7686d17	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:54:57.685
1a2a92db-f271-463e-a188-64f1645e8cc3	638370af-4975-4c8b-ae04-6710da636090	UPDATE	PATIENT	a1f3aa94-7e52-445f-9e1b-fa4ed7686d17	{"id": "a1f3aa94-7e52-445f-9e1b-fa4ed7686d17", "cpf": "12312312315", "city": "São Paulo", "name": "testes efe", "email": "adasd@gmail.com", "phone": "11934924201", "state": "SP", "gender": "prefiro_nao_informar", "street": "asdasd", "zipCode": "", "agreement": "werwe", "createdAt": "2026-05-25T18:54:43.470Z", "updatedAt": "2026-05-25T18:54:43.470Z", "dateOfBirth": "2026-05-25T18:54:43.602Z", "streetNumber": "323", "additionalInfo": "ewrwer"}	{"id": "a1f3aa94-7e52-445f-9e1b-fa4ed7686d17", "cpf": "12312312315", "city": "São Paulo", "name": "testes efe", "email": "adasd@gmail.com", "phone": "11934924201", "state": "SP", "gender": "prefiro_nao_informar", "street": "asdasd", "zipCode": "34534-534", "agreement": "werwe", "createdAt": "2026-05-25T18:54:43.470Z", "updatedAt": "2026-05-25T18:55:14.015Z", "dateOfBirth": "2026-05-25T18:54:43.602Z", "streetNumber": "323", "additionalInfo": "ewrwer"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:55:14.279
8caf54ef-81ca-4190-9cfe-a9b55ad99eba	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:59.319
38489197-eb3f-4948-9029-10e9bacc9722	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:09:35.097
db1f5357-ee38-4b3a-965c-637819a228e0	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:09:05.502
63ffe0d9-9187-4baf-beef-fb20ef514375	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:17:19.126
657074e7-14ac-48be-bb73-67d680c8685e	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:17:22.551
52fe3647-400b-43e8-8317-2c9c2e262e59	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:21:39.888
7eb7c8a0-b018-4fc1-9631-9476e506d272	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	a1f3aa94-7e52-445f-9e1b-fa4ed7686d17	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:55:14.576
bebe5fe0-571e-4468-92ca-e7bb2f62f49a	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	a1f3aa94-7e52-445f-9e1b-fa4ed7686d17	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 18:55:15.536
70a5d018-4a68-43de-8c2d-db689a767ef0	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	b50581f9-dc6d-417b-85b3-0cb7b9889780	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:41.734
3f9515f4-bec9-45c7-ac55-28ccf02314be	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	f76a5e22-cab3-482a-bfdd-465d4fb483cc	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:42.185
589ce511-00d8-4c7b-9475-f38a0bcac887	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	b50581f9-dc6d-417b-85b3-0cb7b9889780	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:47.703
3f3317bd-7d93-4067-a254-f140917c6538	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	b50581f9-dc6d-417b-85b3-0cb7b9889780	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:48.083
4611daa8-b02a-4aed-826c-7a749dc123ac	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	b50581f9-dc6d-417b-85b3-0cb7b9889780	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:48.085
119ad4b6-474a-4e32-89ee-90be81e18803	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:08:59.029
3bc0460d-9463-4fb9-addb-52831259b690	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:09:05.624
90cf2081-c651-43fe-921a-054868f876f0	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5a20447b-abd8-4726-9467-cb79f97e3f20	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:13:16.815
4d23c848-aeac-4f04-bf01-5ce9c5ba014a	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:13:17.099
3954cc65-9016-4050-8c19-adb4707976dd	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	5a20447b-abd8-4726-9467-cb79f97e3f20	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:13:26.026
acc2c4a7-6eec-4287-a746-6c5921c1f2f8	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5a20447b-abd8-4726-9467-cb79f97e3f20	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:13:26.503
784e10df-35e5-44c9-8e2c-39a5c4b0b9bf	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5a20447b-abd8-4726-9467-cb79f97e3f20	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:13:26.517
2b7f3605-dfc7-44db-a6a6-aa7518b54420	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:17:19.428
95743df2-946f-4181-8771-ee6bf4b3f62b	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:17:22.138
bc8b9685-2421-4fa1-a4b4-8051a1fed177	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:17:22.553
a129689f-38a0-47f1-9340-d0e5d6a62a98	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	{"id": "5e155a87-cd51-4e53-b165-5b72f1b5290f", "notes": "Paciente compareceu à consulta. Exame físico sem alterações significativas. Retorno em 30 dias.", "patient": {"id": "192a4dd2-2740-4930-9ecb-c5faaf453869", "name": "Ana Paula Souza", "email": "ana.souza@email.com", "phone": "11992011001"}, "createdAt": "2026-04-16T13:43:22.977Z", "diagnosis": "Lombalgia crônica", "patientId": "192a4dd2-2740-4930-9ecb-c5faaf453869", "updatedAt": "2026-05-25T19:17:21.877Z", "prescription": "Prescrição: Losartana 50mg 1x/dia", "appointmentId": "163125a4-d7fe-4378-8f29-a090540db70f"}	{"id": "5e155a87-cd51-4e53-b165-5b72f1b5290f", "notes": "Paciente compareceu à consulta. Exame físico sem alterações significativas. Retorno em 30 dias.", "patient": null, "createdAt": "2026-04-16T13:43:22.977Z", "diagnosis": "Lombalgia crônica", "patientId": "192a4dd2-2740-4930-9ecb-c5faaf453869", "updatedAt": "2026-05-25T19:21:38.222Z", "prescription": "Prescrição: Losartana 50mg 1x/dia", "appointmentId": "163125a4-d7fe-4378-8f29-a090540db70f"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:21:38.475
d8496db6-da35-480f-a1dd-4710d7012062	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:21:39.061
513ee177-552f-48ae-a3c6-00e926f30eb2	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:28:31.528
2f9d718b-88f7-4874-ae03-ee12a71cb5e5	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:28:31.807
f3684631-34c2-4f96-8c75-f98189abb5ca	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:28:49.624
67d79572-c9c9-46c9-b644-403c36090c95	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	{"patient": {"id": "192a4dd2-2740-4930-9ecb-c5faaf453869", "name": "Ana Paula Souza", "email": "ana.souza@email.com", "phone": "11992011001"}, "diagnosis": "Lombalgia crônica"}	{"patient": null, "diagnosis": "Lombalgia crônica irradiando para mmii"}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:28:49.134
05070bb7-8572-42af-99de-d1891de3eca5	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:28:49.508
76b4c675-bfc2-41ce-b1e3-8696c4795522	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:36:59.152
df46d039-e7cc-4a1b-a137-770a970c5f1d	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:37:08.875
0f0cefba-4cb7-4659-98d7-62442ba07f50	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:37:00.165
1a81dd20-10ba-48e3-8f55-6b5dfdfa58c8	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	{"patient": null, "prescription": "Prescrição: Losartana 50mg 1x/dia"}	{"patient": null, "prescription": "Prescrição: Losartana 50mg 1x/dia todos os dias "}	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:37:38.237
d48bcfb3-2467-4978-aa9f-90e9fc922fba	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	5e155a87-cd51-4e53-b165-5b72f1b5290f	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 19:37:08.63
25bb9aca-6bc5-4455-8d1e-ffab601f16e4	system	LOGOUT	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 21:58:25.337
9bab0567-b08c-411e-a6e1-c3dd3742cfca	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:00:11.619
39a0121f-a0b3-474b-833f-be5302af2c94	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:00:58.927
f1cd2299-94f3-4c54-afd4-d860e6876319	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:02:51.968
4ce6d4ad-2b5e-4496-bd0e-a82328c767c0	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:03:41.636
ece295a6-048c-4caf-be5f-9b8ba85ffd27	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:04:03.247
5dedaac7-b6b8-42a3-a5c8-b8edc5818481	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	6ccefa58-49c4-46d5-bbc4-e013d1385db9	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:04:20.327
4683ed9f-efa6-47b0-ba06-ddb38ff38216	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	6ccefa58-49c4-46d5-bbc4-e013d1385db9	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:04:20.815
c2d4e2af-e14e-40c9-9f31-9f1daf14f1f5	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:09:27.222
1d2eef70-f937-4c7b-94eb-a0faea43e10d	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	c05d9f36-8c3b-4bb0-88f7-c5e0df4d3d2f	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:09:41.435
0c352afd-d8b1-4e3b-9ed0-088a92cb5836	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	c05d9f36-8c3b-4bb0-88f7-c5e0df4d3d2f	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:09:41.971
7e5cc117-5a93-49c3-98ed-287c55822674	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:14:22.938
64df3209-bf08-44a8-9d75-61087b6aa1ed	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:14:36.739
d996a3bc-1f57-4d2d-b19a-0341d2cc65eb	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:14:56.519
118739e1-034a-4800-924f-2cb59e7d8839	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:15:31.689
d7ff8339-7193-4f74-ba32-5a73e97ea5ab	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:15:46.77
3335d41c-938f-48ce-bd34-ddc55f433f4e	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:16:10.539
4cb9f375-88e1-4659-91bd-d60eeb6cbe38	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:16:44.517
1c5fa95b-c286-4bcf-afa6-289cb5b7b05a	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:17:22.259
b8e9687d-dbbd-4e82-8993-2c5454aaef1f	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:18:28.219
e11a31de-17dc-4041-aa8d-f24f76892769	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:18:40.021
57762a5a-a022-40ee-a98d-e6e127a28396	system	LOGOUT	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:15:41.998
7b0baf37-77d2-4e9e-ad6a-df7eee35355b	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:42:19.993
fb7d46fc-b79c-44a5-8f5c-599ae057bef2	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-25 23:42:45.814
b08e4643-2422-4e13-b8f2-8c33d281ebcc	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:22:43.803
0d2fc007-1407-472e-a4dd-2373e63631e1	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:23:28.887
d96533d5-226c-4428-a6f6-ae131b7784f7	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:35:33.538
8f38c77e-757e-4327-aa5d-d0f4e23cdd88	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:42:10.38
1c3f7dab-f0e3-4da6-a566-c5c90e1340be	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:44:21.645
d1255d74-2404-4ac2-9bb5-48db6dc2159e	unknown	LOGIN_FAILED	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:47:50.025
15038c4e-a127-43de-8da4-fdf0db62f4a9	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:48:58.096
299ead98-92d5-442e-a908-cbad6b562b1b	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:49:40.779
597b7392-78ab-4916-810f-8c228e95fce9	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	2a24efa3-2541-4f2a-94ef-f0b90ad66ef7	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:50:27.188
28d5427c-4ba7-41ef-8818-c8b15857fd8a	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	2a24efa3-2541-4f2a-94ef-f0b90ad66ef7	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:50:27.59
046f0553-b734-4825-bcee-09657788a3a4	system	LOGOUT	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:50:12.457
1cb66872-a829-4f46-8df3-bd057460536b	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:50:59.338
0a6e3648-da33-4e23-87c0-498e9db710dd	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:51:21.866
7f9ef053-e359-4725-ac80-a0d2867ae71c	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:51:33.918
9ab57b84-31b8-4c75-8fcf-0a91ea9ebcb1	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	1f058cc1-2f64-40f2-a27e-3bd151183d10	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:51:53.52
ba056837-f43d-45a4-9abc-44b2edf06b9a	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	1f058cc1-2f64-40f2-a27e-3bd151183d10	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:51:54.003
23363536-82f8-469f-bb4a-8c0ed6e6e2ad	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:59:27.378
c934d1bc-d03d-41e8-a7b8-bb93a5e42911	system	LOGOUT	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:59:33.807
86ed0696-18fa-4f40-8989-9d019d711ee6	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 00:59:02.567
09f5a9ec-1165-4fec-b560-807f2e826d52	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:02:55.837
edd35e64-5d8e-42e2-a75a-6716e8f5200c	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:06:43.938
8951edb1-76f7-4841-b2e9-f9c357410ba6	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:11:13.999
0990009a-e62c-4921-afd3-750e84259d29	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:16:41.342
42fa4a86-1788-401e-9d20-888100554bfe	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:16:56.869
f91be4aa-6b45-47db-907b-d23a3180674d	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	1ff52c44-4064-4044-9933-87ec55631ace	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:17:11.544
7ef36cf7-3c3b-4702-8f02-260064119f0b	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	1ff52c44-4064-4044-9933-87ec55631ace	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:17:11.962
02aca983-dad2-4ce8-881c-80d44f850e3d	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 01:33:47.21
e82f28c3-27fa-4474-bc55-67a22db2cf25	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 14:22:02.3
12c7190a-cc43-4230-b73f-1d48d3b760b3	system	LOGOUT	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 14:22:23.522
68035410-11fe-4d74-9a3d-ef004998717e	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 23:47:22.284
bd536ea5-fcc5-403f-9143-ba66d81e39a6	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 23:48:04.78
1d1b4898-b12a-488e-9c7d-7b58a93e076e	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	11dd2092-c1f0-479c-a61f-f40f8b7a581b	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 23:48:18.608
524e34c9-ebb3-4ae7-95a7-6dc50946c81a	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	11dd2092-c1f0-479c-a61f-f40f8b7a581b	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 23:48:19.062
5eb8769e-b556-478c-a99f-8d5a0ca04a21	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 23:58:57.214
c21b8180-6635-4ad1-b0bf-a488d8723fda	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	cd1ca5e5-e119-473d-8e39-3221e3657932	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-26 23:59:07.835
a57de836-42e4-462f-ae9e-f75f16bf1321	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 00:43:08.066
8a2d46fb-0e59-479e-97ff-f38181fd7267	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	f54ae0a6-8556-4182-8e26-e2feaec645c5	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 00:43:18.495
df8a84de-7b48-4b65-8dc7-2ba8c561a122	system	LOGIN	USER	\N	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 00:49:37.761
e764ac59-af0c-48a1-9195-5c4624d848eb	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 00:49:50.762
0f1aa68a-7862-46c9-b118-d4212e32bb17	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	2389080b-694a-4ce1-a9e3-bcb745a62575	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 00:50:02.02
fe03d980-ce81-46ca-a133-4bb5fb4bf0d1	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	2389080b-694a-4ce1-a9e3-bcb745a62575	null	null	::ffff:172.18.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 00:50:02.496
d42b04e9-ed91-42d8-9fad-5b0d91b62e27	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:03:16.218
8fe5eb06-d69b-4067-8442-49593c483fda	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	d159a49f-47d2-42b0-865d-897d7d5c1760	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:03:25.254
ab773fd4-1362-4013-a0b6-f829fb43abae	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	d159a49f-47d2-42b0-865d-897d7d5c1760	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:03:25.802
22e18a22-4733-469a-a06c-b7b5a7d82a69	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:35:11.037
4d039e79-5281-4963-86b4-563150ef194e	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:55:18.8
72c5f43a-2b48-4e55-b314-4bcc758eb85b	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:55:31.588
442de761-5171-480a-9de7-04013d997cb7	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	b4802093-8c1d-4afb-93c3-13f42c414aaa	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:55:40.542
81263a54-6b00-45a6-a2a4-5888a96fc66f	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	b4802093-8c1d-4afb-93c3-13f42c414aaa	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 01:55:40.979
558d5a1b-ea52-4577-b467-29b5a4744265	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0000c801-e516-4988-a355-64108869c5b0	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:24:52.521
5a7dd082-f90a-4b32-8085-aa7a191ce349	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	ea1456a5-0501-4128-8653-9730ecf4fa88	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:25:04.364
da584230-6422-42b6-8d12-f007cdb1b0ee	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	ea1456a5-0501-4128-8653-9730ecf4fa88	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:25:04.816
9b9c1781-e89d-45ee-80f3-816882f22143	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	109ed11f-703d-423c-9e85-3354673e7799	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:26:57.909
dc506a7e-d4a7-4c8c-8b87-08d43b4499c7	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:26:58.298
8dc93ce2-929a-4458-bddd-e18f6c8c68d2	638370af-4975-4c8b-ae04-6710da636090	UPDATE	APPOINTMENT	2f5d2985-d528-46e0-a47a-66363481e574	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:27:25.225
eaccdba1-29f6-4a45-bdac-5979e7f0f82c	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	21ebb724-d679-4d44-b634-f1dd01715ad5	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:43:03.466
52844c27-4519-4176-9e65-de3737bef45c	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	12dc47c8-a9c2-4c1a-b514-9dfc11dfbe87	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:46:50.855
023c37d7-f0ef-4ca3-bd7f-11c550a60cac	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	12dc47c8-a9c2-4c1a-b514-9dfc11dfbe87	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:46:51.282
c481d57b-519a-4f14-939b-446e18dd4e60	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	21ebb724-d679-4d44-b634-f1dd01715ad5	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:48:18.747
885fcf60-50a9-46c2-b54e-ac72d902f21a	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	a5717c27-a044-411a-abe8-40368adb749b	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:48:34.682
0c6cd688-9bc6-4f7b-b039-8a25e3921c06	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	a5717c27-a044-411a-abe8-40368adb749b	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:48:35.142
43ab270b-d3d9-48af-8678-bba65c5aa350	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	c589d712-75d1-4f0d-b7cd-cc59142e09d1	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:50:14.626
a721fed9-8439-4bd4-9dde-a6096513c73c	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	c589d712-75d1-4f0d-b7cd-cc59142e09d1	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 11:50:15.062
04b969f0-8bf9-40ba-887f-63eceebe88e9	638370af-4975-4c8b-ae04-6710da636090	UPDATE	APPOINTMENT	2f5d2985-d528-46e0-a47a-66363481e574	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 12:40:14.227
ad785190-e734-4d05-b29f-ce68503e582f	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	80408431-f7c0-4dd7-b53a-ff246d213aa8	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 13:56:45.809
fa9b9cbc-a573-410e-bb41-a0d24524a025	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	80408431-f7c0-4dd7-b53a-ff246d213aa8	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 13:56:46.364
8b313c3c-ae94-45be-9ae6-e1fa9d15419c	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	7e6b2db5-a0c7-418c-86f3-9c7a9d2ec1c6	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 13:57:28.612
24154546-c4ee-46f6-8dbd-55506d249487	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	7e6b2db5-a0c7-418c-86f3-9c7a9d2ec1c6	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 13:57:29.045
69934d1e-b2fb-487f-8323-3e82b6e26740	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	21ebb724-d679-4d44-b634-f1dd01715ad5	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 13:56:26.305
920512cb-3627-4e4a-af32-ec8bb5d39b1e	638370af-4975-4c8b-ae04-6710da636090	CREATE	PATIENT	ca2aa910-ef07-485b-a802-6fa22b6889b8	null	{"name": "maria silva"}	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:20:16.627
a0b7f0b1-092e-4f1b-8733-7f29bc151e4e	638370af-4975-4c8b-ae04-6710da636090	CREATE	PATIENT	3e1f5180-76a2-4399-b68e-3eb6a1ea469a	null	{"name": "josefina dos santos"}	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:24:35.21
49a602a7-dc1b-4b1d-bbe9-7e73cfec708d	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	3e1f5180-76a2-4399-b68e-3eb6a1ea469a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:26:21.362
74bbbb1a-499f-422b-9113-ec41942caaf4	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	f95c68f2-c164-4045-9c57-6c6f8bdea5bb	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:26:30.676
b35c3e01-995c-4574-9f54-0de73ff649f3	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	f95c68f2-c164-4045-9c57-6c6f8bdea5bb	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:26:31.124
fac45993-7fa7-4507-9748-e8b21c2ad602	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	f3304178-d580-4eed-91a7-eecf49ad1d13	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:26:54.487
8ddede59-d2f2-4467-87af-76bf2d032ade	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	f3304178-d580-4eed-91a7-eecf49ad1d13	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 14:26:54.963
e4051784-fa96-4c94-a32f-6c0c1385ede5	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	3e1f5180-76a2-4399-b68e-3eb6a1ea469a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 15:12:12.579
9d67f572-f856-4ddb-84aa-8cd3559c3f5c	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	cc5bc5e5-5013-465f-9caa-90806aad2994	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 15:12:25.362
c5c1719f-b2af-4ba4-8f46-151586225e7d	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	cc5bc5e5-5013-465f-9caa-90806aad2994	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 15:12:27.017
c3c614db-acf4-4f1d-b73a-f256a19c2f3b	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	21ebb724-d679-4d44-b634-f1dd01715ad5	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 17:14:34.674
154e3eb8-04a1-4846-826f-2c024e5bb758	638370af-4975-4c8b-ae04-6710da636090	CREATE	APPOINTMENT	d73fcdec-5c17-4b3d-9a69-312b1754b2d8	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 17:14:49.394
5af2c257-3f77-4769-ad2d-d9537d374e25	638370af-4975-4c8b-ae04-6710da636090	EXPORT	APPOINTMENT	d73fcdec-5c17-4b3d-9a69-312b1754b2d8	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-27 17:14:49.909
5542faf1-594a-4532-9a4c-f06d790143cc	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:15:56.163
0c3be3c3-49ce-4406-b69e-a711d3190715	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0000c801-e516-4988-a355-64108869c5b0	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:16:43.402
868cfb00-8c73-456a-8341-73ccf88abc42	system	LOGOUT	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:17:16.903
3fca39a5-6788-4d24-9603-18810a3ba4c0	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:19:02.304
d262212f-38de-49ee-a0c3-34b907adea46	system	LOGOUT	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:19:05.254
2cf8f175-8cc2-42a6-a714-7a019c5ce37a	unknown	LOGIN_FAILED	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:19:15.347
dae24451-70ce-458f-93ff-b81a0588c708	unknown	LOGIN_FAILED	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:19:20.892
7d7fa4dc-d68b-46e7-9c70-c532e09a8ff3	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 14:23:55.558
69cbe8d5-a714-4091-9c49-b3a35ceb52af	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-05-29 14:32:11.942
236f83f3-3b00-41ed-876d-849876ac0c63	system	LOGOUT	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-05-29 14:32:18.842
2328e85c-d661-47a9-a71c-a11e4706eb04	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-05-29 14:32:53.138
03798186-6ce3-4b13-bb70-17fd19ece318	system	LOGOUT	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 21:30:54.205
bdeb0ae3-7436-4e61-af53-e9650d240fda	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 21:31:17.37
2a3b5540-debe-4a13-a412-5159345b11e3	system	LOGOUT	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 21:31:23.921
24916623-4e3e-488b-9356-528b4ca2a895	system	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-29 21:31:36.957
f37fa65b-79ec-411c-8134-87b501f47d60	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	177.37.133.7	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-31 14:10:13.592
08c73ec4-b6b4-47d4-b526-db9aad9caf6c	system	LOGOUT	USER	\N	null	null	177.37.133.7	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-31 14:21:08.857
a9a07af9-bdb8-477d-b890-5c44350c3b5c	unknown	LOGIN_FAILED	USER	\N	null	null	177.37.133.24	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-05-31 18:51:58.506
43afdf95-1824-4547-8525-7f68635e1b8d	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	177.37.133.24	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-05-31 18:56:36.438
afa4a404-89af-4350-99af-04c6ab7e5c3b	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:53:28.544
4eb8ba41-ffee-4495-ba0a-1a295d650498	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:54:01.719
abaf55df-bfec-49fd-bbe7-3fe34432d36c	unknown	LOGIN_FAILED	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:54:50.746
0bbcdf18-0bf6-4cfb-aa46-dc1bff3f4b18	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:56:13.961
779bbaf2-48f5-40a9-9e68-7c54a98c88c8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:56:28.283
dfc30ef9-350e-4460-8fd5-85ed5ddb5ce5	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:57:22.12
4f85ff1a-169a-4730-8ce3-b2d2c12765ee	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	2524577b-8d7b-42de-b1d3-27aa5c84322a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:57:36.693
88598f93-6745-4c1e-8a4e-6faed8fe8d58	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	2524577b-8d7b-42de-b1d3-27aa5c84322a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 21:57:38.447
7e4c3cdc-12dc-49f9-a15a-792ee54e98f6	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:21:04.809
d37596de-7b0b-45d3-ae62-acc3084b836d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:21:29.466
010d9b19-1bd2-43f5-aa44-1d369e676d40	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	bb1fc630-ea67-40d7-91e9-1e750ac74dd1	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:21:42.823
65d4de63-618b-4580-8b34-9b40259d42a8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:21:47.951
555b677d-1be2-4e36-abaf-0d2cc95cf3d9	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:22:05.135
446c69eb-8519-4ebb-bce5-e7c6793ae862	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:26:57.625
7aaa77fd-46ce-4783-ac0f-db56469d800d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 23:27:08.646
53839853-9b9f-487b-8dd1-b12baf7ecdf6	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-02 11:25:12.632
bec81f7c-f18c-4acf-80b8-09ee8d86bee2	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	190.15.107.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-02 11:25:31.103
27a20c7b-2daf-4a02-9554-9795971933a1	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	190.15.107.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-02 11:35:46.824
eeddc1d8-cf3f-494e-a743-632fb6970666	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 22:55:55.146
7feec82a-9875-4020-a718-fae7e216e3c6	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 22:56:06.031
79943835-f535-4aa7-84b7-500df5f65a7f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0000c801-e516-4988-a355-64108869c5b0	null	null	177.173.224.243	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-03 13:12:11.386
7e2adeeb-48c3-4d21-b3ee-d02adfb359e9	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	b825f4cd-ebee-4de3-809b-1b60e32480b5	null	null	177.173.224.243	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-03 13:12:33.932
6bd94372-8b4b-418b-927c-1461984af561	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	b825f4cd-ebee-4de3-809b-1b60e32480b5	null	null	177.173.224.243	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-03 13:12:34.487
26b972e2-35dd-49ab-9548-758c42d184f7	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 15:25:10.036
7ec21be9-467b-49f2-ab3f-ea51b4b5bc1c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 15:25:09.822
2548a743-e2d3-4845-a50d-d0118ee547b8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 15:37:35.155
ec0cebf7-ef7e-4be9-94c8-a07aa759e3ea	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 15:37:37.267
ce935f5b-a1e4-469c-ad36-89a2fb92e295	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 19:18:13.514
20f8c23b-2347-44a6-be47-5680e035cd5e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 22:56:42.816
fcd91ab4-c44a-4462-87d1-884be068297f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-04 22:56:43.822
a0778310-75b8-4ff6-abd8-b70b16ae9b02	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 12:10:29.489
1f908187-f16a-4e53-b497-b61efea00841	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 12:11:17.3
2917ffa8-f146-4b4d-b5a9-e16be27bbe18	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 13:06:20.459
eebe2ab6-5d6c-4df8-8244-b5beac942410	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 13:06:20.554
6abb4e76-5fd6-4c38-bf58-1c23b726d902	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:19:52.815
252d0c96-fc29-4015-aa15-867607d836c4	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:19:53.265
1293166e-d935-42a7-a2a4-7518285d0654	system	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:21:50.126
c7cdad67-4de0-498f-8f37-8092af93cac0	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:21:58.31
d401a9a4-bf60-4aa1-afe4-7d688697f5b5	system	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:25:51.708
5a735699-f7f6-49ff-9f0b-b9ee0720fa1a	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:28:05.979
04a5bb41-ac23-4cb2-81eb-a5b5d6802440	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:28:15.995
13061da6-3e58-4acd-b7f2-7205c7ccbb21	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:30:11.321
9ea07e63-74ae-4392-8250-3abf8b709a0c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	b1a359f5-e4e3-4b0a-92e1-d787c888a26b	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:31:13.546
6bcb45f3-de68-434d-bc53-a86374e3b65b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:31:17.884
409529e2-8a98-4d60-adf8-a745f88e6412	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:37:49.223
1e3cc2e6-9680-4d5c-8a1b-13a0d84e2eab	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 21:43:17.424
f425e9d5-7697-4361-93f0-bf82bcb43a97	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-05 22:00:36.052
3c9f9b74-545f-4db8-8928-4e40806e8c70	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-08 12:42:53.906
9ac717f9-3b5b-42d4-89b5-5d8d3c01cc7b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-08 15:51:55.068
6d5c25a3-7948-4216-81bb-c93d353a9aa3	system	LOGIN	USER	\N	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-08 19:08:22.63
abf3e7f0-c06c-45c2-9791-e003eaeec9bf	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-08 19:09:27.702
dc944f24-4f53-4d97-b900-4137c3cf496e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-08 19:21:37.743
c922e999-b255-4318-af14-0a7f73818668	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-08 23:14:30.623
cce5d3fc-52c9-4a0d-b006-f00716908cad	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-09 00:08:50.514
792d076e-c1e5-4d9e-9e4f-88672790d54b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 17:31:33.175
b91d4a1e-4621-4dbe-a1c3-ab7275d7ba59	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	9c124d45-783e-4fdf-96fa-43664349d0b0	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 17:31:43.128
510e2c49-58b1-4591-a127-2f99a69f4423	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	9c124d45-783e-4fdf-96fa-43664349d0b0	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 17:31:43.576
b857011c-ad3a-456b-a0fb-f22a0cb479b4	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 17:33:47.329
fee7fb3f-f43e-4cae-909d-6e309aa471c3	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	138.36.169.121	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-11 22:59:59.993
47849a24-8f8e-4583-9a76-5c9fd759b153	system	LOGIN	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 10:50:58.552
e7c923a5-059d-4355-90c5-22d850cc4d9d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	8e2d8d59-3e06-47f3-85c6-25ffbc564d37	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 10:51:23.485
da63ad44-9dd3-47ce-bce1-012c9cbc427c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0000c801-e516-4988-a355-64108869c5b0	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 10:51:44.219
42d2690f-994a-4eff-8a19-1c04db6ad725	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	23e1a6e2-6091-4412-ab80-9a9c773fad07	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 10:51:45.91
609e89a7-5f57-4967-b5a3-d43109de9be1	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	23e1a6e2-6091-4412-ab80-9a9c773fad07	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 10:51:46.409
5944743e-8c3c-4509-bf2d-228dc558b62b	system	LOGOUT	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 11:30:26.273
f0e5575c-f6be-4e72-af25-ad2b4e76a894	system	LOGIN	USER	\N	null	null	177.173.227.13	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 13:45:33.103
b02ab087-1537-4e3e-8479-815a1cd055c0	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	177.173.227.13	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 13:45:42.658
6f7dc2df-e229-4819-a5c8-36d7ede3c54e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	177.173.227.13	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 13:51:17.619
ca6c3a32-1cc8-450b-aae0-e4ae6b441339	system	LOGOUT	USER	\N	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 15:20:18.002
a6b3222b-8c21-4b58-a0d7-65de95e34422	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55fef75f-1c93-49cc-906b-5c93d187712e	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-16 15:20:08.396
1e5a5eba-8848-4348-8976-5f795cc68349	system	LOGIN	USER	\N	null	null	138.36.169.123	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-22 11:51:20.236
99311b07-91bf-45ae-849a-6e5ea45ae22a	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.123	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-22 11:51:29.324
ae45d825-157f-41ff-8580-ba6d58e2fb99	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	742f1dc0-8a19-4d0e-9891-188ed9e11d63	null	null	138.36.169.123	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-22 11:51:44.757
7662face-214f-4f43-a357-0fbd1cee5a6d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	742f1dc0-8a19-4d0e-9891-188ed9e11d63	null	null	138.36.169.123	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	2026-06-22 11:51:45.255
13057547-f146-4f13-983e-f29d8e48c7d0	system	LOGIN	USER	\N	null	null	177.173.234.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-23 12:28:33.119
41601a6b-b179-4a01-8e51-d0bc54cb4157	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	177.173.234.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-23 14:09:47.721
c09e0e5e-2f87-4852-9ae3-0ca4bc7f7e23	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	177.173.234.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-23 14:09:49.284
47eb63c0-ab97-43ea-9969-4dad3d61a269	system	LOGIN	USER	\N	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:52:04.35
8f9b9f8c-5099-4c0a-9fa2-ef5a3926aee2	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0fb33f8a-2dd8-4f1c-8dc3-6c3ffe2c540a	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:52:30.304
e1a29d43-e4d6-4ba8-b91b-2f4c12604f04	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	7064c5a0-ce71-4753-9205-ecd91652d2bd	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:52:57.703
04d89902-8cb1-4284-848a-c0c4741df749	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	7064c5a0-ce71-4753-9205-ecd91652d2bd	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:52:58.106
2cb2e269-9226-45cb-9464-e13c20f02159	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	07eb5cf3-624f-4aa7-a2fb-5edc28388512	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:53:12.909
25a0d244-f025-49f0-b42f-80156b908914	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	3e1f5180-76a2-4399-b68e-3eb6a1ea469a	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:53:13.331
48879a4a-8158-48c7-b682-725bd9c1f6bf	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	192a4dd2-2740-4930-9ecb-c5faaf453869	null	null	138.36.169.59	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-24 15:54:23.975
02812de4-7581-400c-b2e6-4b00897a2640	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0000c801-e516-4988-a355-64108869c5b0	null	null	177.173.239.139	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-26 12:26:54.898
8791cc5d-7bab-41fd-9125-03897e386b88	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	e7e9cbf5-0216-4e34-88c6-28b264bf8aa7	null	null	177.173.239.139	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-26 12:27:11.089
d2e6bf35-444d-4af4-959a-eb3bef7d0032	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	e7e9cbf5-0216-4e34-88c6-28b264bf8aa7	null	null	177.173.239.139	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36	2026-06-26 12:27:11.618
1a98b81d-b397-4be9-9333-ee0df5a0fef5	b029685a-43ec-41d3-a661-097dddaa18f4	CREATE	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	{"name": "EDILEUSA MATIAS DA SILVA"}	127.0.0.1	\N	2026-07-08 00:34:50.984
345295b6-1dbe-4d76-b780-8a769d825066	b029685a-43ec-41d3-a661-097dddaa18f4	CREATE	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	{"name": "CARLA MICHELLE SOUZA DA SILVA"}	127.0.0.1	\N	2026-07-08 00:35:17.271
6f2c9ec3-de76-492e-93ed-15167e2b482f	b029685a-43ec-41d3-a661-097dddaa18f4	CREATE	PATIENT	688651c2-66a5-4f5e-a1e2-5f5be063befd	null	{"name": "MARIA ELETE BARBOSA DA SILVA"}	127.0.0.1	\N	2026-07-08 00:35:46.695
6346052a-b09b-43da-b870-cc60fc28e8e1	b029685a-43ec-41d3-a661-097dddaa18f4	CREATE	PATIENT	04dc240c-a11e-4935-830e-6ebc2c3329cb	null	{"name": "MARIA RAFAELA DE SALES"}	127.0.0.1	\N	2026-07-08 00:36:19.399
c91bab22-24b2-475a-8fe3-eb43cec722d5	b029685a-43ec-41d3-a661-097dddaa18f4	CREATE	PATIENT	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	null	{"name": "MARCIANO ANTONIO PEREIRA DOS SANTOS"}	127.0.0.1	\N	2026-07-08 00:38:23.823
3216fd88-3160-4236-ae87-be474557e53e	b029685a-43ec-41d3-a661-097dddaa18f4	CREATE	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	{"name": "GERSON NUNES DE MEDEIROS"}	127.0.0.1	\N	2026-07-08 00:38:26.731
df297f6f-c58a-414e-8e43-70301a06fe90	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:01:40.575
a073c210-4614-4cf4-ba92-b0d1635afc32	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	a1f2b26e-e7e7-43e5-a85e-502d0d5e80bf	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:01:49.018
306d6ffa-256e-41f1-83f7-302dd30d4a16	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:01:49.454
0c0db62f-6f89-4ab2-b9fb-645da4dbc84f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:02:57.759
5978756e-759e-4721-b1e1-626a1eb02c40	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:02:58.303
be3a7df3-1b69-402f-ac56-0d11bb7db7ee	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:07:53.182
68e08232-3471-4809-827e-776dbe8b98d8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:08:58.631
e7b18fed-386a-4f64-b922-7d0e976abc31	system	CREATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	null	{"email": "email@gmail.com", "roleId": 3, "username": "testeLuiz"}	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:08:59.408
ab1668f1-211b-4e58-a276-b4ced750c663	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:09:32.782
170c1827-f233-40d7-8361-4f390e3d695d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:09:33.183
42e12c5f-3804-494e-9912-8edc9af7b17f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	{"username": "testeLuiz"}	{"username": "LuizPrazeres123"}	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:10:05.531
6338d2af-45b4-4db6-a919-fe1e7bf656ea	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:10:05.977
ca973eea-e6e2-40fe-b0f4-f204302cdae8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	{"username": "LuizPrazeres123"}	{"username": "Dr.LuizPrazeres"}	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:11:02.458
a7eaf7a8-d431-458b-a4a3-253a7eec5d6b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:11:02.866
62d9871c-0c0b-40ba-9fec-4c3b22f4bd63	system	LOGOUT	USER	\N	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:13:36.771
f384366d-9f51-402e-922b-8d1ee1b941f9	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	LOGIN	USER	\N	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:14:37.098
56ed53c8-d807-47e6-8200-a2c4a66164b3	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	8d6a1c8a-7d83-42c4-b511-f553f49c0c85	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:16:12.975
46077792-c90b-4678-9b6b-b3d092b95f43	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	8d6a1c8a-7d83-42c4-b511-f553f49c0c85	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	2026-07-08 01:19:00.436
fe469406-0c0d-490c-a707-665aecd80773	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	{"username": "Dr.LuizPrazeres"}	{"username": "Dr Luiz Prazeres"}	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:24:24.431
a42316c4-88b7-4e35-a23b-8f75c07d3417	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:24:25.04
28866558-7d0f-4ecc-a308-72748ec5ef37	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:24:31.548
4e30f899-56d2-4ff3-803b-31f9504a25c9	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:24:32.053
866e142d-6b99-4c9e-8397-e27f6f81fa03	system	LOGIN	USER	\N	null	null	138.36.169.108	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 01:27:45.009
292f48bd-cd6f-48d8-b6a2-87da07a784fe	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	USER	83f24610-5266-4ef7-a2de-31660e96680b	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:06:31.175
35fd4039-4af5-45d8-9745-9c4349743380	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	EMPLOYEE	4fc8e15d-bc97-44b1-9526-73ba8b665ca3	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:06:31.573
0e974c22-d001-430a-9036-3514192cadde	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:06:50.476
01558c1e-dd29-46c4-b621-76f8153f8418	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	e58d2aa4-0567-430f-8e65-5185dae587b5	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:08:56.223
842d8f67-b0f6-434d-bb36-67174b6b576f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	e58d2aa4-0567-430f-8e65-5185dae587b5	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:08:56.993
1231f1b4-2e1c-4ca3-8351-21192bcb1d9c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:12:06.885
80c65f20-5357-46bb-8729-3af0d46df5f8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:04:20.472
bab6f3ae-8060-4742-9136-88d3d6c30cd3	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:25:01.564
1cdfe5ae-a87d-4ea9-81ba-2c08d4ba9227	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	{"cpf": "083.610.314-99", "city": null, "phone": "(82) 9163-6096", "state": null, "gender": "F", "street": null, "zipCode": null, "streetNumber": null}	{"cpf": "08361031499", "city": "são miguel dos campos alagoas", "phone": "82991636096", "state": "AL", "gender": "feminino", "street": "rua sem saida", "zipCode": "", "streetNumber": "2313"}	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:25:14.119
d9e65dc2-cd9f-4617-b35c-d473dbe031a5	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:25:14.478
f557cd26-5eb9-43c2-9ff0-746e10f4f896	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:25:14.667
67661676-18eb-43ec-85a3-5f46f0fe430b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	e58d2aa4-0567-430f-8e65-5185dae587b5	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:25:32.594
deda49d8-9d4a-4800-8cd9-5ee4f49eb2cc	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	a6b4ec71-7bb8-42e1-8d09-3263f7a2d566	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:26:41.278
56c11237-1c86-469b-9101-f31defb02c80	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	a6b4ec71-7bb8-42e1-8d09-3263f7a2d566	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:26:41.779
0d1b866f-a139-4003-bd82-344ebb2be079	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	a6b4ec71-7bb8-42e1-8d09-3263f7a2d566	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:33:23.485
e7f1cb0e-cc62-48cb-95da-582f27f86700	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:33:27.747
c786e40c-bb9e-4c1f-8823-b94337b65abd	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	96696bbe-944a-4480-a769-6c479b248488	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:35:20.774
71f1dedf-2188-4295-8345-16613255731c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	96696bbe-944a-4480-a769-6c479b248488	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:35:21.883
4c35e2b8-e82c-4a1b-9c65-9799b362ee8b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:38:44.292
fc29bace-872f-4228-b322-2af932b93b26	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	f2fc1038-906f-460a-b3e8-45ae264eee4c	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:39:00.421
cdf6b274-08c7-43a9-990c-15324fd11499	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	f2fc1038-906f-460a-b3e8-45ae264eee4c	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:39:01.637
74d185d2-5611-4080-a80a-a833d5a2c170	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	9c9bec71-e00a-4f2a-aee3-c4ec88f33ab5	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:43:27.295
ec3cc657-b0e5-47dc-b225-d7fc739be49b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	9c9bec71-e00a-4f2a-aee3-c4ec88f33ab5	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:43:28.499
63b3ea02-e1f2-4a3a-8064-f8818055e033	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:49:03.386
56d1f6b9-b9b2-4299-b83c-863262820242	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	659faa3b-9d37-478e-a919-74c423c252dc	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:49:21.629
6e39326d-6155-4ee2-a509-0a3fa61183f2	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	659faa3b-9d37-478e-a919-74c423c252dc	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:49:22.029
56a16df7-aa7b-4dfe-bebd-001ebce8cd45	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:57:10.108
ac3e4dec-3629-4ed5-bd22-a3ff73d2ac66	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	a260563e-aa09-4f1c-a97a-433bcf76c73b	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:57:24.398
c60ca3b8-c9bc-4a3f-9f5c-7f8913d5192b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	a260563e-aa09-4f1c-a97a-433bcf76c73b	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 13:57:24.807
47771c6c-fd9d-446f-b55a-53a0ff377614	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 14:34:09.896
553629b1-d02f-4ce7-9c96-9395b2d6df63	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	55e0d2a7-bf71-49d5-9305-ad7cb0b78744	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 14:34:24.078
41f35d67-e528-4882-b463-2d0bdffadeac	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	55e0d2a7-bf71-49d5-9305-ad7cb0b78744	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 14:34:24.602
02c290ef-4f46-4455-96ae-a52682c6c450	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 14:48:25.696
dfa6081f-a16a-415f-bfbd-d0b334c37468	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	2bb1351d-26d2-4269-abc0-cbead090f163	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 14:51:06.703
d1c15a62-152d-46a1-a62b-42fba906b77a	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	2bb1351d-26d2-4269-abc0-cbead090f163	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 14:51:07.154
184bf6ba-170d-430c-bcd0-887e6c70bf1b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:27:09.881
b15d8b9a-2326-41e2-ac8f-929eed0960c0	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	37c3b689-5a80-4b9f-a683-1e3bf791a18e	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:28:40.977
996c0b2f-73a1-4d3b-b0f6-6d1d680baff7	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	37c3b689-5a80-4b9f-a683-1e3bf791a18e	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:28:41.523
5e14da45-b880-4e10-92a3-2239a7ecaf1f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:30:31.802
80529838-ae02-4fac-9498-f0eb9905a92f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:31:25.105
a8a75f98-b4e2-4fcf-8903-ce32821ed52c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	8c62bffe-3c1f-46fb-9881-505825c2d18d	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:31:36.533
9bd5b486-d9b5-440a-8454-68472868fec2	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	8c62bffe-3c1f-46fb-9881-505825c2d18d	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:31:38.775
91bd7579-7d20-4659-84c4-92bdeb8b5535	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	688651c2-66a5-4f5e-a1e2-5f5be063befd	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:32:26.522
2fa224fe-9dbf-4068-af94-3f59551b388d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	5f240ad4-8032-4371-be3b-f24b57370769	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:34:16.485
6d958e5b-6d93-44f9-a219-a7c85014a855	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	5f240ad4-8032-4371-be3b-f24b57370769	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:34:18.575
48d737fe-ebf3-4ea6-af6a-255d8f3e063c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	93794429-449e-49ca-b376-cd0af91e895b	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:35:06.251
4c115b06-4b50-40f1-ba2f-fb41f1aac779	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	93794429-449e-49ca-b376-cd0af91e895b	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:35:06.692
afd22f07-80a7-4c9e-ab7e-30e5e9475e1f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	04dc240c-a11e-4935-830e-6ebc2c3329cb	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:41:05.663
639886d6-0778-4c1d-b38e-9fcbedbed21f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	d1d8e643-9a99-4739-8c6a-3b05fce7f566	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:42:10.992
f4e4c6cc-fc32-4b7b-ac53-06f57d5e4746	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	d1d8e643-9a99-4739-8c6a-3b05fce7f566	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:42:11.5
136fb1f0-c557-4c3b-95ad-1c62966f7525	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:53:48.572
ab123030-0162-4847-a1de-601c64b1b740	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	62d91c12-c10c-4d04-ac2f-8e6ebfe24c5d	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:54:20.98
a5c81d99-4e53-4d1e-9c6e-2aa6da5ddd4b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	62d91c12-c10c-4d04-ac2f-8e6ebfe24c5d	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:54:21.563
697b1dde-7fb4-49fa-93be-acea04f0ff50	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:54:50.113
4dad2db3-92c3-48e4-a618-fb533b0ddfa8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	cf5485bb-6336-4377-8b31-19cafcb36696	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:55:23.082
87a79098-0170-4a29-99b6-b5bc80e375c9	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	cf5485bb-6336-4377-8b31-19cafcb36696	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:55:23.518
0846757d-5fcb-420b-b165-86a7d8f61556	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:55:28.714
5d547917-967a-42ff-af80-4e0cfdd2a359	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	9cc8aa71-8660-446d-926d-13f348496f72	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:55:56.942
97608fe4-a048-4f97-b71e-27018b4fc9a8	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	9cc8aa71-8660-446d-926d-13f348496f72	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:55:57.44
99da894e-8172-4089-88d4-e644665c0ac1	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	688651c2-66a5-4f5e-a1e2-5f5be063befd	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:56:25.729
58e42b2e-333a-449d-bfd6-d5597bc52718	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	688651c2-66a5-4f5e-a1e2-5f5be063befd	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:57:23.852
05c77c9d-4e3e-4439-babd-428d40ebbc40	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	a61b8f3e-ffbb-4692-985f-fa717e7be05a	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:57:51.202
4b3a7792-76ae-4afd-a0a8-1fed9c2f505d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	a61b8f3e-ffbb-4692-985f-fa717e7be05a	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:57:52.048
4285f4f2-c205-4847-9216-537f6a599765	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:58:36.603
eaf5f647-ecc7-483f-9578-71e6a3b0b198	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	43e57fdf-ac24-41c1-a932-4caebcc6e647	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:59:06.498
181202a4-7b09-4c83-a248-ab0cd80b5f81	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	43e57fdf-ac24-41c1-a932-4caebcc6e647	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 15:59:07.031
e24ca0be-f99c-47c6-9dc2-aa579e058d33	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	c86895de-1e44-476f-bb4d-7518ed718698	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:00:51.63
c0ff0c16-e23f-4aaf-945c-68a1b72405dd	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	04dc240c-a11e-4935-830e-6ebc2c3329cb	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:00:11.925
e881bde9-e95d-4f95-9e33-35d0c72119ce	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	c86895de-1e44-476f-bb4d-7518ed718698	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:00:52.134
9077a68c-0566-4dee-82c0-842a90045115	system	LOGIN	USER	\N	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:06:24.875
333a26b6-282f-4964-93ac-504d5f3267c7	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:12:04.676
b5cac5f9-43f1-4250-b2dc-a6aab59eaa01	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:20:12.506
92012931-f92e-49de-ae1f-9fc8a424651b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	CREATE	APPOINTMENT	09596aa8-8c5d-43b1-82fd-deca9b5a25f6	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:20:45.09
8a0645c7-70ac-4cd4-b1ad-b71d55ee0b6d	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	EXPORT	APPOINTMENT	09596aa8-8c5d-43b1-82fd-deca9b5a25f6	null	null	::ffff:172.20.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:20:45.614
2169eb80-5e06-4446-b3a1-d41a1531a073	system	LOGIN	USER	\N	null	null	45.164.55.75	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-08 16:26:01.859
177bfb76-b4c3-4511-bf96-c55dc19d6fc0	system	LOGIN	USER	\N	null	null	45.164.55.75	Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	2026-07-08 16:28:20.61
0d3c98ef-7174-4433-b562-ef1a877ce62e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	45.164.55.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-09 18:20:35.492
b2e6b55b-4537-450d-9813-c53df6272e4a	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	45.164.55.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-09 18:20:35.908
a975c155-7268-49ef-841b-4fe6de3b8936	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	{"patient": null, "diagnosis": null, "prescription": null, "appointmentId": null}	{"patient": null, "diagnosis": "", "prescription": "", "appointmentId": ""}	45.164.55.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-09 18:20:41.617
14952a90-888e-4f9b-9d6e-c28c2fc4cf7e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	45.164.55.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-09 18:20:41.851
a3234bb2-751f-4be1-86a1-cf0f35a81795	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	45.164.55.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-09 18:20:42.061
e72b4831-7b69-4dfa-8f50-4a2e14ce20a4	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	45.164.55.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-09 18:20:53.144
85b77cf9-d06b-4db3-b9c7-e387894d0a49	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 11:24:04.215
216aea05-cb2a-4806-bffe-4f3d17d8d38a	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 11:24:04.635
aae73388-aae5-41f2-a740-b9b1c404ae3e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 11:24:16.726
aa2141ef-31fd-4ff1-8f08-c5bd1bdea5e7	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 11:24:21.539
da41a2b3-15ae-4275-be41-f2fd36366aba	system	LOGOUT	USER	\N	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:44:17.787
3703ab75-7c28-4099-9d4c-5cf8659ee408	638370af-4975-4c8b-ae04-6710da636090	LOGIN	USER	\N	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:48:14.246
415e6d21-ba4d-434e-afd6-047bf60e3a52	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:49:12.825
26c7b9a6-6120-47ca-8b55-140388d20b49	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:49:13.267
322c47b7-5deb-45fd-b61f-d1a381e747cb	system	LOGIN	USER	\N	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:50:10.733
555f2e0a-e9b5-42e2-ba64-db083742a31c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	eadcd32c-8ed4-481f-82a2-445902edea83	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:50:37.864
e409b550-e95f-4df4-9cdf-28bca4fbf963	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:50:38.254
5bce8d30-453f-40a5-97bc-e25cd1d46f60	system	LOGOUT	USER	\N	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:50:58.003
d49a1231-a9e9-4e3e-83b4-7af76c0e1767	638370af-4975-4c8b-ae04-6710da636090	UPDATE	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	{"patient": null, "appointmentId": null}	{"patient": null, "appointmentId": ""}	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:51:15.534
26266882-8f81-46ff-be06-02a7f925393c	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:51:15.755
06dceb57-fcde-438c-9ca2-810218ce0a95	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:51:38.27
6f2bc4fd-4d2f-4f72-a2bb-008a4dcbc5d3	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:51:38.753
5b133a2a-3c93-4392-8c88-fbb361fbb055	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	618ea713-55cf-422e-8a00-1c979c0ddd55	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:52:21.671
f40e8238-00df-411b-b0f7-8288334e2238	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:52:22.11
0e6c183f-c5d8-4835-bbaa-255f2ff2f8f2	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	f9b47977-ba1f-4865-a395-f2d0553d0c2b	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:53:17.168
cab1cef1-b999-47d0-b6c6-f8f0e1dfea45	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	04dc240c-a11e-4935-830e-6ebc2c3329cb	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:53:18.02
e62bcdc3-e9ba-42e1-ad18-7f73ef655864	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	02e9a190-f4dc-4946-bd52-79fb3880dfbe	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:53:36.412
e2ef9085-af12-49ef-9074-9d303343a1ee	638370af-4975-4c8b-ae04-6710da636090	VIEW	PATIENT	688651c2-66a5-4f5e-a1e2-5f5be063befd	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:53:36.846
8bf1c659-fe39-4cf5-8f40-652d20513a29	system	LOGIN	USER	\N	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:56:45.115
5486cc8f-354d-4800-ad51-f58914e0ea2f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:57:00.215
576b0f56-407a-44c7-a09b-c3d8aac09306	system	LOGOUT	USER	\N	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 16:57:16.414
73939b8e-caf1-4801-922b-fa03cd16b6d7	638370af-4975-4c8b-ae04-6710da636090	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.37.133.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0	2026-07-13 16:51:15.973
5e9d7831-2d93-417a-a151-c05c57a96773	system	LOGIN	USER	\N	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 19:41:06.006
4e81161f-4bc0-4e81-a79d-d56e2ea18602	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 19:41:24.199
956ea66e-05b9-43ec-946e-c0f7c41fda1b	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	168.181.114.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-13 19:41:25.085
614c5de0-1a93-472e-b613-a43c4c9f9742	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	62d91c12-c10c-4d04-ac2f-8e6ebfe24c5d	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:30:51.317
9df8840c-6113-4245-8bd7-eccc32d6b972	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	cf5485bb-6336-4377-8b31-19cafcb36696	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:30:59.632
874d47d9-f2d9-477f-87dc-a33020e732f5	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	9cc8aa71-8660-446d-926d-13f348496f72	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:31:21.769
715e6841-ab37-408a-b0d0-ea7172d90595	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	a61b8f3e-ffbb-4692-985f-fa717e7be05a	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:31:27.186
7d81dda2-751d-4443-b813-e10957074306	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	43e57fdf-ac24-41c1-a932-4caebcc6e647	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:31:31.749
04eea168-bd2b-4040-8c45-33cb5fd8d96c	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	UPDATE	APPOINTMENT	c86895de-1e44-476f-bb4d-7518ed718698	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:31:36.598
474aa67a-1adb-4f35-945d-360aa8f186ce	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:32:06.614
d6f5482c-1e5e-40d1-a47a-9e61e6d5bb06	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:32:07.235
7e42bd09-a854-4d03-8e66-501187ebb0e4	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:32:17.128
55298711-2a57-4168-a8e3-f5ad7abdba59	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:32:31.569
19e2dcbf-84cf-4e3a-bcdf-0e7c50b9d5b0	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	177.173.224.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 12:41:59.215
77c32aff-b4dd-4791-9ae0-d436a11b883e	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.173.232.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 16:50:41.228
a918b232-0939-42d0-bf8c-36f7bdb66355	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	177.173.232.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 16:50:41.938
bdbab78b-62f8-4b64-b81d-bf1a92b58fe9	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	177.173.232.5	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 17:27:48.236
0a8ae4c9-7c24-4838-be2d-1df2eeefc0c2	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	MEDICAL_RECORD	d8dee3f8-660f-495f-b6b3-9f1a6239d66c	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 19:25:20.298
b56aa2bf-9405-4d98-b5f4-6c2df670465f	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	5442c855-819c-4fc0-882b-46ee4fca19bd	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 19:25:36.981
e8bede16-4f7d-4d0f-9f9d-486b4fb65110	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	55283cbf-de1f-494e-8016-cff02dce6b1f	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 19:25:38.58
7eec7d3b-0ce8-4c59-91f7-ffa882242376	b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	VIEW	PATIENT	4af17c3f-fd13-4940-93b7-22b102ff45e4	null	null	190.15.107.82	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-16 19:25:19.013
\.


--
-- Data for Name: doctor_specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_specialties ("doctorId", "specialtyId") FROM stdin;
b029685a-43ec-41d3-a661-097dddaa18f4	85565b86-1609-4c5e-a310-455a115c143f
b029685a-43ec-41d3-a661-097dddaa18f4	106934fa-b916-435c-8974-e13f07b34e41
edd3bab9-f9d9-4fad-afa9-b4c085f11001	9fcfc034-ac67-4306-8abc-e2c6766db694
edd3bab9-f9d9-4fad-afa9-b4c085f11001	41acdf20-340f-4c81-8705-ebd45b8c1363
b029685a-43ec-41d3-a661-097dddaa18f4	290b4375-e858-4a2b-b785-7127cc0632b8
edd3bab9-f9d9-4fad-afa9-b4c085f11001	9599efd6-7de9-433b-8e0c-e8bdb35e57c5
8d6a1c8a-7d83-42c4-b511-f553f49c0c85	b2510e0c-3e58-4ba4-8a8d-dd3abc5e38a8
8d6a1c8a-7d83-42c4-b511-f553f49c0c85	a2b91939-7bdc-4fcb-bce2-5493aa670907
8d6a1c8a-7d83-42c4-b511-f553f49c0c85	106934fa-b916-435c-8974-e13f07b34e41
83f24610-5266-4ef7-a2de-31660e96680b	85565b86-1609-4c5e-a310-455a115c143f
83f24610-5266-4ef7-a2de-31660e96680b	b2510e0c-3e58-4ba4-8a8d-dd3abc5e38a8
83f24610-5266-4ef7-a2de-31660e96680b	c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, name, cpf, email, phone, "position", department, hire_date, salary, status, date_of_birth, gender, street, street_number, city, state, zip_code, notes, created_at, updated_at) FROM stdin;
834a4dd8-c26f-42eb-a70a-457e90bae7cb	Vera Pacheco	60070080090	vera.rh@adqpal.com	(11) 96666-6006	Aux. Administrativo	Administrativo	2018-07-20 00:00:00	2200.00	ON_LEAVE	\N	F	Rua Pamplona	660	São Paulo	SP	01405-001	\N	2026-04-16 13:43:50.033	2026-04-16 13:43:50.033
dabefec2-4c07-4049-a146-36b622b1ae65	Wilson Cardoso	70080090001	wilson.rh@adqpal.com	(11) 97777-7007	Segurança	Operações	2020-11-05 00:00:00	2500.00	TERMINATED	\N	M	Av. Angélica	770	São Paulo	SP	01228-200	\N	2026-04-16 13:43:50.26	2026-04-16 13:43:50.26
5c01064e-8a43-449b-ac3e-00a8cbceab7a	Ximena Torres	80090000112	ximena.rh@adqpal.com	(11) 98888-8008	Recepcionista	Recepção	2023-08-14 00:00:00	2600.00	ACTIVE	\N	F	Rua Bela Cintra	880	São Paulo	SP	01415-001	\N	2026-04-16 13:43:50.489	2026-04-16 13:43:50.489
693d0bf6-2ae5-4127-acd2-98fa85bd9b5a	Robson Lima	30040050060	robson.rh@adqpal.com	11933333003	Técnico Lab.	Laboratório	2020-09-01 00:00:00	3200.00	ACTIVE	\N	feminino	Al. Santos	330	São Paulo	SP	01419-002	\N	2026-04-16 13:43:49.345	2026-04-16 17:43:28.537
82632451-e616-49f0-896d-ce2efe0f1781	Thiago Borges	50060070080	thiago.rh@adqpal.com	11955555005	Farmacêutico	Farmácia	2023-02-01 00:00:00	4100.00	ACTIVE	\N	masculino	Rua Frei Caneca	550	São Paulo	SP	01307-001	\N	2026-04-16 13:43:49.804	2026-04-16 17:44:54.134
99191eba-f344-44f4-845c-971b3bc739cd	Sandra Mello	40050060070	sandra.rh@adqpal.com	11944444004	Contadora	Financeiro	2019-01-10 00:00:00	5200.00	ACTIVE	2014-04-18 00:00:00	feminino	Rua da Consolação	440	São Paulo	SP	01302-001	\N	2026-04-16 13:43:49.574	2026-04-16 17:47:39.355
956360ae-1133-4766-b9dc-5c131f1d3a98	Júlia Ferreira	20030040050	julia.rh@adqpal.com	11922222002	Enfermeira	Enfermagem	2021-06-15 00:00:00	3500.00	ACTIVE	\N	feminino	Rua Oscar Freire	220	São Paulo	SP	01426-001	\N	2026-04-16 13:43:49.117	2026-04-16 17:55:11.164
aaa3bcad-57fb-40fa-ab5b-e65cb4c3a47c	Mariana Costa	10020030040	mariana.rh@adqpal.com	11911111001	Recepcionista	Recepção	2022-03-01 00:00:00	2800.00	ACTIVE	\N	feminino	Rua Haddock Lobo	110	São Paulo	SP	01414-001	\N	2026-04-16 13:43:48.769	2026-04-17 13:27:53.388
d222df53-a843-4e64-b455-b6494cb3cb2b	Jacinto	51651651651	jaci@gmail.com	82199565959	Recepcionista	Clinica	2026-04-18 00:00:00	1615.00	ACTIVE	2011-04-06 00:00:00	masculino	rua boa	23	São miguel dos campos	AL	57240042	O funcionário responsável por atendimento ao cliente.	2026-04-17 13:44:34.096	2026-04-17 13:44:34.096
4fc8e15d-bc97-44b1-9526-73ba8b665ca3	Dr Luiz Prazeres	@e:cKsSiyxZ6EhqupZyUIs/zQ==	@e:JmDezGwcuSkS7NfNPSjfwg==	@e:bG5WC3G/ZSXkvuvF9m78Qg==	Medico	Clinico Geral	2026-07-08 00:00:00	15000.00	ACTIVE	1965-02-19 00:00:00	masculino	@e:ABsBU7VCvS/oNeP1xeEMKw==	@e:8exFInhT0lXhmjJwE4uqZg==	@e:Eh6Y1YQNHf92Ke9uLRoLrGkZJgYKMpEBZAYP13ymYrg=	@e:q+HjkdmVdwq4jxKR7+BCjg==	\N	@e:TfDJWenHxG5RQi/fZ7q4/LpCJ/X72ZN72Ihhe2RdNV/V+5PBYezXd93OuQIHflQw	2026-07-08 01:07:53.166	2026-07-08 13:06:31.556
\.


--
-- Data for Name: empresa_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_config (id, "razaoSocial", cnpj, "inscricaoMunicipal", "municipioCodigo", "nfeLogin", "nfeSenha", "nfeAmbiente", "createdAt", "updatedAt") FROM stdin;
875b616f-5d40-4e21-8eba-b0b1f0694121	Clínica Saúde Integrada LTDA	59658303000149	212699	2707702	59658303000149	Suamae591	homologacao	2026-05-02 16:46:54.272	2026-05-02 16:46:54.272
\.


--
-- Data for Name: financial_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financial_accounts (id, name, type, bank, initial_balance, currency, is_active, is_default, color, created_at, updated_at, pluggy_account_id) FROM stdin;
31b211c4-5c51-42c1-b161-2fd935a76808	Conta Corrente Bradesco	CHECKING	Bradesco	15000.00	BRL	t	t	#CC092F	2026-04-16 13:43:31.082	2026-04-16 13:43:31.082	\N
56bf65e9-1fcd-495b-9a6e-62deb68ab013	Poupança Itaú	SAVINGS	Itaú	8000.00	BRL	t	f	#FF6200	2026-04-16 13:43:31.432	2026-04-16 13:43:31.432	\N
38091e79-5937-4e60-888e-34c3842e082a	Caixa / Dinheiro	CASH	\N	500.00	BRL	t	f	#22C55E	2026-04-16 13:43:31.66	2026-04-16 13:43:31.66	\N
857a5a1c-7562-42f0-9a78-e048c0d2f757	Cartão Nubank	CREDIT_CARD	Nubank	0.00	BRL	t	f	#8B5CF6	2026-04-16 13:43:31.887	2026-04-16 13:43:31.887	\N
896e7cd7-9f63-4cee-af3c-dafca79c1b2a	Conta Corrente Bradesco	CHECKING	Bradesco (Mock)	12450.75	BRL	t	f	\N	2026-04-16 17:38:52.225	2026-04-16 17:38:52.225	mock-acc-001
7ab19b8a-2b26-40c0-bd5a-c2e654afd000	Cartão de Crédito Nubank	CREDIT_CARD	Bradesco (Mock)	-1230.50	BRL	t	f	\N	2026-04-16 17:38:58.143	2026-04-16 17:38:58.143	mock-acc-002
\.


--
-- Data for Name: financial_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financial_categories (id, name, type, color, icon, parent_id, is_default, is_active, created_at, updated_at) FROM stdin;
06abb361-7494-45c3-aa2a-70a23cb5756d	Consultas Particulares	INCOME	#22C55E	stethoscope	\N	f	t	2026-04-16 13:43:32.236	2026-04-16 13:43:32.236
5de7d6fb-9c9b-496f-80eb-7397ea38d28f	Convênios / Planos	INCOME	#10B981	heart-pulse	\N	f	t	2026-04-16 13:43:32.582	2026-04-16 13:43:32.582
212570a1-d9c8-4679-8e04-fde6f9297e54	Exames	INCOME	#34D399	clipboard	\N	f	t	2026-04-16 13:43:32.809	2026-04-16 13:43:32.809
675caf3d-5483-49a2-99c5-d5adeb7989c2	Procedimentos	INCOME	#6EE7B7	activity	\N	f	t	2026-04-16 13:43:33.037	2026-04-16 13:43:33.037
aad83890-61d6-473b-b352-93b0e8523388	Aluguel	EXPENSE	#EF4444	home	\N	f	t	2026-04-16 13:43:33.268	2026-04-16 13:43:33.268
d159ffa4-c8c3-4057-b320-14ffc9a5d34e	Energia Elétrica	EXPENSE	#F97316	zap	\N	f	t	2026-04-16 13:43:33.498	2026-04-16 13:43:33.498
affcc6ba-fc4a-408d-beb6-5cf5b14b5460	Água	EXPENSE	#3B82F6	droplets	\N	f	t	2026-04-16 13:43:33.727	2026-04-16 13:43:33.727
5e13b743-02c3-4672-93b6-79b60292bb61	Internet / Telefone	EXPENSE	#8B5CF6	wifi	\N	f	t	2026-04-16 13:43:33.955	2026-04-16 13:43:33.955
a1cfb85e-baed-42e2-9640-0fdc86a0d8e0	Folha de Pagamento	EXPENSE	#EC4899	users	\N	f	t	2026-04-16 13:43:34.183	2026-04-16 13:43:34.183
50fafc31-2777-409d-9e73-98421fdb646d	Material Médico	EXPENSE	#F59E0B	package	\N	f	t	2026-04-16 13:43:34.411	2026-04-16 13:43:34.411
c3cbc9ec-364e-4980-bd78-109ed1376dfd	Material de Escritório	EXPENSE	#D97706	printer	\N	f	t	2026-04-16 13:43:34.639	2026-04-16 13:43:34.639
46771b68-b64d-40c9-9910-cc9e8501b6f3	Manutenção / Reparos	EXPENSE	#6B7280	wrench	\N	f	t	2026-04-16 13:43:34.868	2026-04-16 13:43:34.868
20404652-9925-4c91-9b8c-68970e264e55	Sistema / Software	EXPENSE	#64748B	monitor	\N	f	t	2026-04-16 13:43:35.096	2026-04-16 13:43:35.096
c0401b2f-b860-4c71-861c-218c76e05dfa	Impostos / Taxas	EXPENSE	#DC2626	landmark	\N	f	t	2026-04-16 13:43:35.326	2026-04-16 13:43:35.326
40c82366-fee4-4b39-bb0e-2410e67db24a	Importado (Pluggy)	BOTH	#94A3B8	link	\N	f	t	2026-04-16 13:43:35.556	2026-04-16 13:43:35.556
\.


--
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records (id, appointment_id, patient_id, diagnosis, prescription, notes, created_at, updated_at) FROM stdin;
eadcd32c-8ed4-481f-82a2-445902edea83	\N	5442c855-819c-4fc0-882b-46ee4fca19bd	\N	\N	@e:hsQDXPYvWcjzAX7rl9Sp0EN9OUuth4W0HfDbQyUreAS3eDMotwzHfOaEiS2qBVgzXMv7fvwVJdVNAzu+BmvaXw==	2026-07-08 00:34:52.03	2026-07-08 00:34:52.03
a1f2b26e-e7e7-43e5-a85e-502d0d5e80bf	\N	55283cbf-de1f-494e-8016-cff02dce6b1f	\N	\N	@e:hsQDXPYvWcjzAX7rl9Sp0EN9OUuth4W0HfDbQyUreAS3eDMotwzHfOaEiS2qBVgzXMv7fvwVJdVNAzu+BmvaXw==	2026-07-08 00:35:17.51	2026-07-08 00:35:17.51
02e9a190-f4dc-4946-bd52-79fb3880dfbe	\N	688651c2-66a5-4f5e-a1e2-5f5be063befd	\N	\N	@e:hsQDXPYvWcjzAX7rl9Sp0EN9OUuth4W0HfDbQyUreAS3eDMotwzHfOaEiS2qBVgzXMv7fvwVJdVNAzu+BmvaXw==	2026-07-08 00:35:47.06	2026-07-08 00:35:47.06
f9b47977-ba1f-4865-a395-f2d0553d0c2b	\N	04dc240c-a11e-4935-830e-6ebc2c3329cb	\N	\N	@e:hsQDXPYvWcjzAX7rl9Sp0EN9OUuth4W0HfDbQyUreAS3eDMotwzHfOaEiS2qBVgzXMv7fvwVJdVNAzu+BmvaXw==	2026-07-08 00:36:19.639	2026-07-08 00:36:19.639
618ea713-55cf-422e-8a00-1c979c0ddd55	\N	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	\N	\N	@e:hsQDXPYvWcjzAX7rl9Sp0EN9OUuth4W0HfDbQyUreAS3eDMotwzHfOaEiS2qBVgzXMv7fvwVJdVNAzu+BmvaXw==	2026-07-08 00:38:25.281	2026-07-08 00:38:25.281
d8dee3f8-660f-495f-b6b3-9f1a6239d66c	\N	4af17c3f-fd13-4940-93b7-22b102ff45e4	@e:fKc+kY3OALPcdFhN2bGA0w==	@e:fKc+kY3OALPcdFhN2bGA0w==	@e:hsQDXPYvWcjzAX7rl9Sp0EN9OUuth4W0HfDbQyUreAS3eDMotwzHfOaEiS2qBVgzXMv7fvwVJdVNAzu+BmvaXw==	2026-07-08 00:38:27.21	2026-07-13 16:51:15.518
\.


--
-- Data for Name: notas_fiscais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notas_fiscais (id, numero, patient_id, appointment_id, transaction_id, created_by, servico, valor, status, data_emissao, pdf_url, observacoes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: patient_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_history (id, patient_id, doctor_id, appointment_id, type, title, description, attachments, deleted_at, created_at, updated_at) FROM stdin;
b5c3da15-55cd-4f3c-bda8-549a8fe79179	5442c855-819c-4fc0-882b-46ee4fca19bd	b029685a-43ec-41d3-a661-097dddaa18f4	\N	OBSERVACAO	Cadastro inicial do paciente	@e:F5ogQqEpDeCoUzdYSV5Z57ExkIEzykKpDgtq0og9d6aptitxlJVUj5qTKCrUsr6yu/mNuDSD9EcK3nR/C59BNO6bzhv3+5nPt3KKbClSHC5MPhzmD5cp21xhBnW2s12cE0y3oaYg0HOuStsGAb4wE6bCXQyjRMbIu6H8naeazqFRtmXQCkfCiX6BL9I6aZ98lw7rqMTRExMPeA0O5LIa38vSWcAwiJlHovp/qX/r0ecMeGxx90kpoy/+RYOc0q4iPFaAeTVDYH+CIaFLdS+/m7IW45PhScEWVNYQvsiMuL32ljAk/rgUTRUcJwPNT8g/qu+otgrPQ0I1lpIYNPFP1tbARNzRTa2jn/yzuLGFXz403idGM9oizpzDNLGd7hJJRLQexoB0cxZhDRfCf5GTEecjDkpOd21eN4xipQsLXnM=	{}	\N	2026-07-08 00:34:50.984	2026-07-08 00:34:50.984
4beb369e-f540-4ce4-adce-3fbf9147e201	55283cbf-de1f-494e-8016-cff02dce6b1f	b029685a-43ec-41d3-a661-097dddaa18f4	\N	OBSERVACAO	Cadastro inicial do paciente	@e:F5ogQqEpDeCoUzdYSV5Z57ExkIEzykKpDgtq0og9d6YB3MHPsq4QVXddfSgrp3lOYhGzR/Br62jMthQysIOaiceyLNTXuJztbZ7V8QFPrbKvjZ1kkAoU6IziwAO+lJ555dhdw1gj9vto3HdMCsAjykFmDNAqcj84bluzqrPaF5nZLsaImZIedwuvaosEHXG55ISh6MgfDjrt6bZg2xTGaHIPQJS48rJ3etPmcqIV1aRzxeuoeOSAW3Jh66914qOJkhfUwE4zqlsx0uyI8NUkU64TShItcgpPybkY9ciLa9Ez2aEjXeDnDCg4U64adYkM4hM0GLS8oR3ZtqWrOurj5OVSMI4s8i1vjy6y5nI6mn9hD1rFDs1FWPJzHJWhKYW+AnQl9iKq9o6N1z5uHfelqQ==	{}	\N	2026-07-08 00:35:17.271	2026-07-08 00:35:17.271
8ec3ab85-b073-4965-b125-83cbd25a8236	688651c2-66a5-4f5e-a1e2-5f5be063befd	b029685a-43ec-41d3-a661-097dddaa18f4	\N	OBSERVACAO	Cadastro inicial do paciente	@e:F5ogQqEpDeCoUzdYSV5Z57ExkIEzykKpDgtq0og9d6YB3MHPsq4QVXddfSgrp3lOrZn604jKWoAB2ZoKVU3Yncenb35DqEEnftBysvOSDaoI4XRWs6E65yK4yt2pJc+G4JUUbHws5+mldA5+kPrxmqjKKqrhxspjl5uxSjTf5Pi7j00ABalxluI8MYUvXf2Md3qsQvIGFy2scST6IRKJYj7xYfQaPtyYHvjafSOWvsE7QGflgBS1zpss0j8xejn/pchgtzUqemefVOWPJ1E1igHmksTLdfRWuyZD8Ej078CK/OJoROoK/JD3drsuuO283ZPbJsWOElZOBh+EbMiJMpfPDkW9W1yMCJ8seQWmzgglj85YMpozRSImc63wVrr1wQtgsD4ECUH2lV8r5tjfeQ==	{}	\N	2026-07-08 00:35:46.696	2026-07-08 00:35:46.696
1389d2b7-80cc-43e0-8ebe-e035eeecfafd	04dc240c-a11e-4935-830e-6ebc2c3329cb	b029685a-43ec-41d3-a661-097dddaa18f4	\N	OBSERVACAO	Cadastro inicial do paciente	@e:F5ogQqEpDeCoUzdYSV5Z57ExkIEzykKpDgtq0og9d6YB3MHPsq4QVXddfSgrp3lO2YtB0+R5H1WYwV/b6BWo/ss0dWI8HTdjnItrpzPK1wNnUvMfC84vbCKhzZTz7CFIzki+52Bps9sHydHyjwifKf4l0zdNqyZSjl/9ciNoculw15HnmcmuZxpyuoCakpCB3xIGQj1qTRPlotoFbKbcB0prLVw8wuLn4X2x8XMKSn7ywqx2pzTWUW/08SYqHzT+yyGJ6LOCnDckgZSRbjZANRdNyUS/oXLKl6w05TMKvumQ9sAYgMwl7bvBhFjXt5F+di6h/C7qzoMxhdHGyr+Tp0++CIlFM7ZzbuNY3yipdE/URpNbtVYdrEnZ8e9SFEb0	{}	\N	2026-07-08 00:36:19.399	2026-07-08 00:36:19.399
c4aa104a-58b0-405f-b3d8-720b8b5f43b6	0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	b029685a-43ec-41d3-a661-097dddaa18f4	\N	OBSERVACAO	Cadastro inicial do paciente	@e:F5ogQqEpDeCoUzdYSV5Z57ExkIEzykKpDgtq0og9d6YB3MHPsq4QVXddfSgrp3lONiUvuvocdIV9Z89zax2nsBCqe/DNfSdaSyE0r+3OHjyZzQDhplvbKgy+rcBYLIzX4hSeZYU9IKEnOJ+6IJGJH3qvC6LHjEUwL/JVbxtWRXxbIpsSPoMROHGM2JgHureiqwIPjAsAm+h1inxM1DhVZOnl3QhTdOWG9Hsh5GpiY6m1kcE5yhL4mns2ck+cWsnHJh3IwTd3t0fXaeNVpoSc1QhECKIa/nAV9bFAOMtoo/nCAZkBLpkQgAY3N8IlvsF9lTq5UEBGlifo59lUqL2TvWwWmcPW9j+PsahVoHJUNycXOSQdlQ+wthhz+jYhN4SR	{}	\N	2026-07-08 00:38:24.83	2026-07-08 00:38:24.83
130a32a0-4489-428f-9049-b3af380ac88c	4af17c3f-fd13-4940-93b7-22b102ff45e4	b029685a-43ec-41d3-a661-097dddaa18f4	\N	OBSERVACAO	Cadastro inicial do paciente	@e:F5ogQqEpDeCoUzdYSV5Z57ExkIEzykKpDgtq0og9d6YB3MHPsq4QVXddfSgrp3lOb+7j/cTsu5oLQT8KpBK2Fp0OjWpW3hu5Iple87NO0tPdUBhTZ3PQzahqqPHyLfNVDjmiGQvXqeDqMwxt6WITxlbaulbMOBRVqgiwvl4SvEH2yRY21kXJUBMQM0/GvdTTCIr9JChuHqFx89qoUeNV9U+nGRfvHKkLLwAsrGCizILbsUcjsT6VFRqvpU6tNrivXOQLuE2Mx7qiVkX6l2VN6aIFzFKTofzauhMTpLk8seJxnEynHO/4CO6Poo94RP52s8a28C8mVhfmf/ICATVrS0MBOFb/vgPN1ZDzHWnmVCJb2Z35xphf88ufjK9RWdyzRnwQy464P6CXb001WKvVgRFHJ/zdKStJqP5dnJK1egB1Dk4QMroNUwRaicE5XKgRss46Afs8mpQgAq93OW55Ow==	{}	\N	2026-07-08 00:38:26.85	2026-07-08 00:38:26.85
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, name, email, phone, cpf, date_of_birth, created_at, updated_at, additional_info, city, state, street, street_number, zip_code, agreement, gender, registration_number) FROM stdin;
5442c855-819c-4fc0-882b-46ee4fca19bd	EDILEUSA MATIAS DA SILVA	@e:0PuBl0I0XRwUKGD0GoSMyRgv69kO8n6Xtbh476oZxG0=	@e:PNUUR6Rypp1d19p4SDg/9g==	@e:P9gWs+w9CzWMaQyF0P5VOA==	\N	2026-07-08 00:34:39.289	2026-07-08 00:34:39.289	@e:Vyrv0XjVbobtTzUA40WAjlBMCj9pURyuTzkvIIr8laBqsD7ILQoeK1su2OAEiGFy/WyH0elSSzAIutxsHIGRZwx95ImNok9adMzBrtNzCCmTbZtI1rvaaVP+c0kMpV2G5TyGpswYxQlv9QQ2J0+PtpI1vFQ8YXaJtcY0z+XEig3J7d12IZxWxev4IWSa6566W/MuKFK8fbLj9z7sFNmU+g==	\N	\N	\N	\N	\N	@e:3KQoawZg+ojWT4kDrVHDSA==	F	000001
55283cbf-de1f-494e-8016-cff02dce6b1f	CARLA MICHELLE SOUZA DA SILVA	@e:sRckT4ItWhDMVtsqTjEZaoq9IuvIeYDoY2eF4k+b+9w=	@e:TKT09SYEM5jI54yEu5K+Pg==	@e:f0XrdgaDdRZN0r+HUcdgQg==	1984-07-19 00:00:00	2026-07-08 00:35:03.899	2026-07-08 13:25:14.098	@e:JdxH54ezC0poY5rUg503cIebUkMj3kP7qDwJgX4wp2VtNTTfP8wTn8T16oATNK2jc6aa0LbmUDgOih2P647FbD0MqXpWRaRDUlGfT1UOeCnhJITv8rsHSpRREsSXjauh	@e:Eh6Y1YQNHf92Ke9uLRoLrGkZJgYKMpEBZAYP13ymYrg=	@e:q+HjkdmVdwq4jxKR7+BCjg==	@e:ABsBU7VCvS/oNeP1xeEMKw==	@e:ZY9VIHgeSl761IhEGnl+yw==	@e:fKc+kY3OALPcdFhN2bGA0w==	@e:3KQoawZg+ojWT4kDrVHDSA==	feminino	000002
688651c2-66a5-4f5e-a1e2-5f5be063befd	MARIA ELITE BARBOSA DA SILVA	@e:ssxD7EKYlJlKTbU6nU9RurBqAdDS2AEviOCjm2AjLMA=	@e:PNUUR6Rypp1d19p4SDg/9g==	@e:IpWrINjhjMKE0kcKbzSing==	1963-08-25 00:00:00	2026-07-08 00:35:31.649	2026-07-08 00:35:31.649	@e:JdxH54ezC0poY5rUg503cIebUkMj3kP7qDwJgX4wp2VtNTTfP8wTn8T16oATNK2jc6aa0LbmUDgOih2P647FbD0MqXpWRaRDUlGfT1UOeClOk9d64JRYWyRuZh85837MNISXxdS9VZvBFVHxUsi3FQ==	\N	\N	\N	\N	\N	@e:3KQoawZg+ojWT4kDrVHDSA==	F	000003
04dc240c-a11e-4935-830e-6ebc2c3329cb	MARIA RAFAELA DE SALES	@e:o8YnLI9PIMZMAOvpRcQa6owaSMSOJRDJ9QdhoOsGja8=	@e:PNUUR6Rypp1d19p4SDg/9g==	@e:WJfnXHbcwYxOlvkgXX7QxQ==	1990-11-01 00:00:00	2026-07-08 00:36:02.861	2026-07-08 00:36:02.861	@e:V/C14CYRv+jPnPS16V5irIGZ1+YXUra2+Ra/pv6F0zAgnr1Aol4cXAAFsm4c9QT6FX0zadi8ePVKUAivkeRVc4C8OY+ZC50qG+vvGkYvp4E=	\N	\N	\N	\N	\N	@e:3KQoawZg+ojWT4kDrVHDSA==	F	000004
0a66b534-ff0f-4dbe-8d11-c7c0f60239f3	MARCIANO ANTONIO PEREIRA DOS SANTOS	@e:6lNsg498tKV80Vl1r4f3PT/sHRoe+Ch0LqmR/qRdsdE=	@e:PNUUR6Rypp1d19p4SDg/9g==	@e:lM9G/4qdDU6PhdmpsLvV0Q==	1993-10-07 00:00:00	2026-07-08 00:38:23.58	2026-07-08 00:38:23.58	@e:98/ZaYkSAwOgMgTO73y6+rAweoSGtQTIFqGfRDicPrkNX/VRMwU5uESRfhL7VTwUmMmWVaJQX7LtcEjFKcN9vJGqoTooX+36WFa2yM2E0AmW6J3iu8IeYtkIXD0TY1Sq	\N	\N	\N	\N	\N	@e:3KQoawZg+ojWT4kDrVHDSA==	M	000005
4af17c3f-fd13-4940-93b7-22b102ff45e4	GERSON NUNES DE MEDEIROS	@e:WVriAnI3dUmcISDULH9wdFobpGA7dXyUxey+g4QYdMY=	@e:PNUUR6Rypp1d19p4SDg/9g==	@e:bU1yA+nfo+BACEOMsO6h5w==	1972-01-07 00:00:00	2026-07-08 00:38:26.51	2026-07-08 00:38:26.51	@e:yOw5jFujZ0hIh2K9ir1yprO+B/71CdkNaTOSfKyXBoGtyZzwAuPoqSUyTzmHr+0Jc8ISy6ilKXu9U4HvzN9i7phcb7dt3vywDzOkes+zvDsbv48LtpJl9OyxBPAYiCXyGEx8sptWNi8N4zfLqbvGK4c/38hbFpp7POHiK5+yHkkwuJ0NMqw+nlrRe5VwGSe6	\N	\N	\N	\N	\N	@e:3KQoawZg+ojWT4kDrVHDSA==	M	000006
\.


--
-- Data for Name: pluggy_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pluggy_items (id, pluggy_item_id, connector_name, connector_logo, status, last_sync, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	Administrador
2	Usuário
3	Médico
4	Enfermeiro
5	Recepcionista
6	Técnico de Laboratório
7	Contador
8	Farmacêutico
9	Suporte de TI
\.


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specialties (id, name) FROM stdin;
85565b86-1609-4c5e-a310-455a115c143f	Clínica Geral
9fcfc034-ac67-4306-8abc-e2c6766db694	Psicologia
a2b91939-7bdc-4fcb-bce2-5493aa670907	Fisioterapia
9599efd6-7de9-433b-8e0c-e8bdb35e57c5	Nutrição
106934fa-b916-435c-8974-e13f07b34e41	Cardiologia
290b4375-e858-4a2b-b785-7127cc0632b8	Dermatologia
2db14818-904f-421f-890f-8a62c6f852e3	Pediatria
32e75642-5198-413c-a55c-3148f7bae39c	Ortopedia
41acdf20-340f-4c81-8705-ebd45b8c1363	Neurologia
b2510e0c-3e58-4ba4-8a8d-dd3abc5e38a8	Ginecologia
c3f4d5e6-f7a8-49b0-91c2-d3e4f5a6b7c8	Ultrassonografia
\.


--
-- Data for Name: sus_procedures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sus_procedures (id, codigo, nome, modalidade, created_at, updated_at) FROM stdin;
9159df89-fdd0-4f81-a345-8ec8c664c93e	0205020119	ULTRASSONOGRAFIA DE PROSTATA (VIA TRANSRETAL)	Ultrassonografia	2026-06-05 21:37:22.863	2026-07-14 12:36:59.307
0258c50a-5b37-4007-9a64-664a2c79ec5d	0205020135	ULTRASSONOGRAFIA DE TORAX (EXTRACARDIACA)	Ultrassonografia	2026-06-05 21:37:23.088	2026-07-14 12:36:59.315
87392990-5753-4f34-aec5-4b2605a14e91	0205020151	ULTRASSONOGRAFIA OBSTETRICA C/ DOPPLER COLORIDO E PULSADO	Ultrassonografia	2026-06-05 21:37:23.313	2026-07-14 12:36:59.323
45af2d2b-c251-41bd-9f50-00c60eff2d7b	0205020160	ULTRASSONOGRAFIA PELVICA (GINECOLOGICA)	Ultrassonografia	2026-06-05 21:37:23.425	2026-07-14 12:36:59.326
40a85245-abc8-4b0d-8b85-736e339bb92d	0205020178	ULTRASSONOGRAFIA TRANSFONTANELA	Ultrassonografia	2026-06-05 21:37:23.538	2026-07-14 12:36:59.329
c265634a-f63b-4962-af8f-fa53c65309e0	0205020186	ULTRASSONOGRAFIA TRANSVAGINAL	Ultrassonografia	2026-06-05 21:37:23.65	2026-07-14 12:36:59.332
d0c13d46-9216-406d-8819-affaaa32acd6	0205020224	ELASTOGRAFIA HEPÁTICA ULTRASSÔNICA	Ultrassonografia	2026-06-05 21:37:23.874	2026-07-14 12:36:59.341
b41e4a15-b01f-4b35-8c5f-8ba03e6566b5	0206010010	TOMOGRAFIA COMPUTADORIZADA DE COLUNA CERVICAL C/ OU S/ CONTRASTE	Tomografia Computadorizada	2026-06-05 21:37:23.987	2026-07-14 12:36:59.344
3b6b4a65-fc53-48c9-8ce6-7e08d1d26b31	0206010028	TOMOGRAFIA COMPUTADORIZADA DE COLUNA LOMBO-SACRA C/ OU S/ CONTRASTE	Tomografia Computadorizada	2026-06-05 21:37:24.099	2026-07-14 12:36:59.347
ff877b97-4e3f-44cf-b751-830a74e59e49	0206010036	TOMOGRAFIA COMPUTADORIZADA DE COLUNA TORACICA C/ OU S/ CONTRASTE	Tomografia Computadorizada	2026-06-05 21:37:24.212	2026-07-14 12:36:59.35
e8541ce0-e81b-4c77-a6ca-f33d626cea34	0206010044	TOMOGRAFIA COMPUTADORIZADA DE FACE / SEIOS DA FACE / ARTICULACOES TEMPORO-MANDIBULARES	Tomografia Computadorizada	2026-06-05 21:37:24.324	2026-07-14 12:36:59.354
c0c72b18-4485-4a34-a976-4eca4a6a673a	0206010052	TOMOGRAFIA COMPUTADORIZADA DO PESCOCO	Tomografia Computadorizada	2026-06-05 21:37:24.436	2026-07-14 12:36:59.357
4a63e4b3-d235-4ed2-81dd-0c8fd02cbb7d	0206010060	TOMOGRAFIA COMPUTADORIZADA DE SELA TURCICA	Tomografia Computadorizada	2026-06-05 21:37:24.548	2026-07-14 12:36:59.361
33020a01-9574-4cf6-b679-5d5039b2e14d	0206010079	TOMOGRAFIA COMPUTADORIZADA DO CRANIO	Tomografia Computadorizada	2026-06-05 21:37:24.66	2026-07-14 12:36:59.364
f0d6e95f-43e6-4696-9eda-3651e5a89b5a	0206010087	TOMOMIELOGRAFIA COMPUTADORIZADA	Tomografia Computadorizada	2026-06-05 21:37:24.773	2026-07-14 12:36:59.369
4c18abbd-7de1-41df-8642-592f46dcbc5b	0206010095	TOMOGRAFIA POR EMISSÃO DE PÓSITRONS (PET-CT)	Tomografia Computadorizada	2026-06-05 21:37:24.885	2026-07-14 12:36:59.373
093f27be-8698-42b8-982a-60007dbeae48	0206020015	TOMOGRAFIA COMPUTADORIZADA DE ARTICULACOES DE MEMBRO SUPERIOR	Tomografia Computadorizada	2026-06-05 21:37:24.998	2026-07-14 12:36:59.376
92a6d29d-6b74-4e50-bfc1-971a8cf0981c	0206020023	TOMOGRAFIA COMPUTADORIZADA DE SEGMENTOS APENDICULARES - (BRACO, ANTEBRAÇO, MÃO, COXA, PERNA, PÉ)	Tomografia Computadorizada	2026-06-05 21:37:25.109	2026-07-14 12:36:59.379
2630ccd1-159b-4c8f-a00a-bbf3e18699ed	0206020031	TOMOGRAFIA COMPUTADORIZADA DE TORAX	Tomografia Computadorizada	2026-06-05 21:37:25.221	2026-07-14 12:36:59.383
8bff0eb8-ef14-48c8-b2d0-ed27e0fbebd8	0206020040	TOMOGRAFIA DE HEMITORAX, PULMÃO OU DO MEDIASTINO	Tomografia Computadorizada	2026-06-05 21:37:25.333	2026-07-14 12:36:59.386
3746bb78-6cd4-4609-81c5-8fa5f32eeacd	0206030010	TOMOGRAFIA COMPUTADORIZADA DE ABDOMEN SUPERIOR	Tomografia Computadorizada	2026-06-05 21:37:25.446	2026-07-14 12:36:59.389
ed66a116-6eb1-4e16-a5bf-46c399e3c34f	0206030029	TOMOGRAFIA COMPUTADORIZADA DE ARTICULACOES DE MEMBRO INFERIOR	Tomografia Computadorizada	2026-06-05 21:37:25.56	2026-07-14 12:36:59.393
86ce4427-ea0f-4d55-b369-6addbf13b096	0206030037	TOMOGRAFIA COMPUTADORIZADA DE PELVE / BACIA / ABDOMEN INFERIOR	Tomografia Computadorizada	2026-06-05 21:37:25.673	2026-07-14 12:36:59.396
91e7f5eb-2b99-44bd-baab-f2631e58e679	0207010013	ANGIORESSONANCIA CEREBRAL	Ressonância Magnética	2026-06-05 21:37:25.786	2026-07-14 12:36:59.409
1a985f59-a922-41d5-af1c-589c23da202a	0207010021	RESSONANCIA MAGNETICA DE ARTICULACAO TEMPORO-MANDIBULAR (BILATERAL)	Ressonância Magnética	2026-06-05 21:37:25.898	2026-07-14 12:36:59.412
e84b834d-e13b-4038-9bf9-1ddb936bdd3e	0207010030	RESSONANCIA MAGNETICA DE COLUNA CERVICAL/PESCOÇO	Ressonância Magnética	2026-06-05 21:37:26.011	2026-07-14 12:36:59.417
abc4bc9d-ac0e-469f-82f0-0876b34c73bb	0207010048	RESSONANCIA MAGNETICA DE COLUNA LOMBO-SACRA	Ressonância Magnética	2026-06-05 21:37:26.122	2026-07-14 12:36:59.42
1d9d00eb-ac95-4086-b3cb-5e855519499d	0207010056	RESSONANCIA MAGNETICA DE COLUNA TORACICA	Ressonância Magnética	2026-06-05 21:37:26.234	2026-07-14 12:36:59.423
e793920c-7e05-43f4-9b54-78951ed5f904	0207010064	RESSONANCIA MAGNETICA DE CRANIO	Ressonância Magnética	2026-06-05 21:37:26.346	2026-07-14 12:36:59.426
3af0b24d-8804-4de9-901c-9a763f9c135a	0207010072	RESSONANCIA MAGNETICA DE SELA TURCICA	Ressonância Magnética	2026-06-05 21:37:26.459	2026-07-14 12:36:59.43
2863de63-a2f1-421f-adbd-40e41d3b39a5	0207020019	RESSONANCIA MAGNETICA DE CORACAO / AORTA C/ CINE	Ressonância Magnética	2026-06-05 21:37:26.572	2026-07-14 12:36:59.433
514c752c-1b53-432b-8887-33bfbeb12256	0207020027	RESSONANCIA MAGNETICA DE MEMBRO SUPERIOR (UNILATERAL)	Ressonância Magnética	2026-06-05 21:37:26.685	2026-07-14 12:36:59.437
1286eb57-b719-4be8-b209-9467aac56bda	0207020035	RESSONANCIA MAGNETICA DE TORAX	Ressonância Magnética	2026-06-05 21:37:26.799	2026-07-14 12:36:59.44
a01a3e08-0066-43c5-97a6-bc80ba07540c	0207020060	RESSONÂNCIA MAGNÉTICA DA MAMA	Ressonância Magnética	2026-06-05 21:37:26.913	2026-07-14 12:36:59.444
ddd60550-b2ff-4e2c-873c-9070259e4d21	0207030014	RESSONANCIA MAGNETICA DE ABDOMEN SUPERIOR	Ressonância Magnética	2026-06-05 21:37:27.027	2026-07-14 12:36:59.447
1a0a6d1d-493f-456c-9c17-cc8ef972e70a	0207030022	RESSONANCIA MAGNETICA DE BACIA / PELVE / ABDOMEN INFERIOR	Ressonância Magnética	2026-06-05 21:37:27.141	2026-07-14 12:36:59.45
56f29388-db59-4db7-ae2b-cbf1784b0ff6	0205020097	ULTRASSONOGRAFIA MAMARIA BILATERAL	Ultrassonografia	2026-06-05 21:37:22.638	2026-07-14 12:36:59.298
4014d45f-084c-430e-bb8c-4fdcab81f458	0205020100	ULTRASSONOGRAFIA DE PROSTATA POR VIA ABDOMINAL	Ultrassonografia	2026-06-05 21:37:22.751	2026-07-14 12:36:59.303
6ffa60b1-4f19-4aa8-a98f-f9e79a67e715	0205020127	ULTRASSONOGRAFIA DE TIREOIDE	Ultrassonografia	2026-06-05 21:37:22.975	2026-07-14 12:36:59.311
bb337e56-ca9d-4fb3-99f8-268324694485	0205020143	ULTRASSONOGRAFIA OBSTETRICA	Ultrassonografia	2026-06-05 21:37:23.2	2026-07-14 12:36:59.319
b9d94bd1-14f1-4f88-b39c-3a90d067a25e	0205020194	MARCACAO DE LESAO PRE-CIRURGICA DE LESAO NAO PALPAVEL DE MAMA ASSOCIADA A ULTRASSONOGRAFIA	Ultrassonografia	2026-06-05 21:37:23.762	2026-07-14 12:36:59.337
ae332bd3-672e-4d73-b064-35a89cd0711e	0205020011	ECODOPPLER TRANSCRANIANO	Ultrassonografia	2026-06-05 21:37:21.607	2026-07-14 12:36:59.238
0e30bc06-d366-47b7-8602-4dc2ada6bf81	0205020020	PAQUIMETRIA ULTRASSÔNICA	Ultrassonografia	2026-06-05 21:37:21.844	2026-07-14 12:36:59.265
e831158a-c33d-4af7-ba2b-5c407ec65492	0205020038	ULTRASSONOGRAFIA DE ABDÔMEN SUPERIOR	Ultrassonografia	2026-06-05 21:37:21.959	2026-07-14 12:36:59.27
30095cf1-0379-4926-b13a-a214a4ab74fc	0205020046	ULTRASSONOGRAFIA DE ABDOMEN TOTAL	Ultrassonografia	2026-06-05 21:37:22.073	2026-07-14 12:36:59.274
7f09f05a-f05f-47c3-a880-88bfe80c0605	0205020054	ULTRASSONOGRAFIA DE APARELHO URINÁRIO	Ultrassonografia	2026-06-05 21:37:22.186	2026-07-14 12:36:59.279
aec2c5f9-9bbf-418e-9da3-6a3e033c41d4	0205020062	ULTRASSONOGRAFIA DE ARTICULACAO	Ultrassonografia	2026-06-05 21:37:22.299	2026-07-14 12:36:59.285
93c2c0c8-4bd4-40f3-84b7-fd2149b60361	0205020070	ULTRASSONOGRAFIA DE BOLSA ESCROTAL	Ultrassonografia	2026-06-05 21:37:22.412	2026-07-14 12:36:59.289
873e0e1d-5a08-4083-bcea-e7ca28f7f0c8	0205020089	ULTRASSONOGRAFIA DE GLOBO OCULAR / ORBITA (MONOCULAR)	Ultrassonografia	2026-06-05 21:37:22.525	2026-07-14 12:36:59.294
6ff27bf7-c7a3-4ef2-859f-f16db9d9a3b7	0206030045	CONTRASTE PARA TOMOGRAFIA COMPUTADORIZADA	Tomografia Computadorizada	2026-07-14 12:36:59.399	2026-07-14 12:36:59.399
8f85e358-c260-4ecd-a728-11a381e8bc0a	0206030053	CONTRASTE PARA RESSONÂNCIA MAGNÉTICA	Tomografia Computadorizada	2026-07-14 12:36:59.405	2026-07-14 12:36:59.405
dae357e0-50bc-4916-8c00-00d1c125e11c	0207030030	RESSONANCIA MAGNETICA DE MEMBRO INFERIOR (UNILATERAL)	Ressonância Magnética	2026-06-05 21:37:27.255	2026-07-14 12:36:59.454
2b3eac02-1c45-4774-a1a6-eb4b9ccea2c8	0207030049	RESSONANCIA MAGNETICA DE VIAS BILIARES/COLANGIORRESSONANCIA	Ressonância Magnética	2026-06-05 21:37:27.371	2026-07-14 12:36:59.458
ea39954c-fede-4551-9567-44e3c1ec5dd1	0207030057	RESSONÂNCIA MAGNÉTICA MULTIPARAMÉTRICA DA PRÓSTATA	Ressonância Magnética	2026-06-05 21:37:27.485	2026-07-14 12:36:59.462
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, account_id, category_id, patient_id, appointment_id, created_by, type, amount, description, status, payment_method, due_date, paid_at, reference, is_recurring, recurring_group_id, installment_number, total_installments, transfer_to_account_id, tags, attachment_url, deleted_at, created_at, updated_at) FROM stdin;
68a9bf8a-5954-4b15-9c86-a9525b29a812	31b211c4-5c51-42c1-b161-2fd935a76808	aad83890-61d6-473b-b352-93b0e8523388	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	3200.00	Aluguel sala clínica	CONFIRMED	BANK_TRANSFER	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:35.923	2026-04-16 13:43:35.923
527ca91f-e87f-4c60-9185-c40161d89a18	31b211c4-5c51-42c1-b161-2fd935a76808	d159ffa4-c8c3-4057-b320-14ffc9a5d34e	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	320.00	Energia elétrica	CONFIRMED	DEBIT_CARD	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.159	2026-04-16 13:43:36.159
1e825f89-8d0a-4f18-aaae-f6cc4af09e8b	31b211c4-5c51-42c1-b161-2fd935a76808	affcc6ba-fc4a-408d-beb6-5cf5b14b5460	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	85.00	Água e saneamento	CONFIRMED	DEBIT_CARD	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.275	2026-04-16 13:43:36.275
bc48d79c-1853-401a-ac8a-5e579d1bd105	31b211c4-5c51-42c1-b161-2fd935a76808	5e13b743-02c3-4672-93b6-79b60292bb61	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	230.00	Internet fibra + telefone	CONFIRMED	DEBIT_CARD	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.389	2026-04-16 13:43:36.389
028a27a3-cd7c-49fc-93d5-d979a9b640f3	31b211c4-5c51-42c1-b161-2fd935a76808	a1cfb85e-baed-42e2-9640-0fdc86a0d8e0	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Folha de pagamento	CONFIRMED	BANK_TRANSFER	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.505	2026-04-16 13:43:36.505
3b5b5220-92c0-4f7e-9928-1ee3591aceb2	857a5a1c-7562-42f0-9a78-e048c0d2f757	20404652-9925-4c91-9b8c-68970e264e55	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	150.00	Sistema ADQPAL / licenças	CONFIRMED	CREDIT_CARD	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.62	2026-04-16 13:43:36.62
1df0491c-3b6e-40b9-9a3a-77a81b64db2c	31b211c4-5c51-42c1-b161-2fd935a76808	c0401b2f-b860-4c71-861c-218c76e05dfa	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	480.00	Simples Nacional	CONFIRMED	BANK_TRANSFER	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.736	2026-04-16 13:43:36.736
4f571a2d-8e8a-42cb-8dec-43f868e3e87b	31b211c4-5c51-42c1-b161-2fd935a76808	aad83890-61d6-473b-b352-93b0e8523388	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	3200.00	Aluguel sala clínica	CONFIRMED	BANK_TRANSFER	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.853	2026-04-16 13:43:36.853
cc569db4-bc57-4095-8500-a4cd1cfa0360	31b211c4-5c51-42c1-b161-2fd935a76808	d159ffa4-c8c3-4057-b320-14ffc9a5d34e	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	320.00	Energia elétrica	CONFIRMED	DEBIT_CARD	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:36.968	2026-04-16 13:43:36.968
ac8a2516-7bc9-4233-a99d-ed997fa5f288	31b211c4-5c51-42c1-b161-2fd935a76808	affcc6ba-fc4a-408d-beb6-5cf5b14b5460	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	85.00	Água e saneamento	CONFIRMED	DEBIT_CARD	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.082	2026-04-16 13:43:37.082
4707fa93-e53d-4c90-8516-afbbe98a70ea	31b211c4-5c51-42c1-b161-2fd935a76808	5e13b743-02c3-4672-93b6-79b60292bb61	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	230.00	Internet fibra + telefone	CONFIRMED	DEBIT_CARD	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.197	2026-04-16 13:43:37.197
0878f059-aef6-413f-86fd-dc1731735ae4	31b211c4-5c51-42c1-b161-2fd935a76808	a1cfb85e-baed-42e2-9640-0fdc86a0d8e0	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Folha de pagamento	CONFIRMED	BANK_TRANSFER	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.311	2026-04-16 13:43:37.311
559ca8c0-514e-4caa-8983-228f0e8c62de	857a5a1c-7562-42f0-9a78-e048c0d2f757	20404652-9925-4c91-9b8c-68970e264e55	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	150.00	Sistema ADQPAL / licenças	CONFIRMED	CREDIT_CARD	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.428	2026-04-16 13:43:37.428
2f1bb5ee-2742-409a-abb3-b5aec9ae292a	31b211c4-5c51-42c1-b161-2fd935a76808	c0401b2f-b860-4c71-861c-218c76e05dfa	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	480.00	Simples Nacional	CONFIRMED	BANK_TRANSFER	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.544	2026-04-16 13:43:37.544
6dc173c6-278d-40a2-8433-a2fb9b43f3fb	31b211c4-5c51-42c1-b161-2fd935a76808	aad83890-61d6-473b-b352-93b0e8523388	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	3200.00	Aluguel sala clínica	CONFIRMED	BANK_TRANSFER	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.658	2026-04-16 13:43:37.658
14ba7212-964f-4aa2-af3a-243b03517da4	31b211c4-5c51-42c1-b161-2fd935a76808	d159ffa4-c8c3-4057-b320-14ffc9a5d34e	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	320.00	Energia elétrica	CONFIRMED	DEBIT_CARD	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.773	2026-04-16 13:43:37.773
0308c4b9-fa86-40c1-84e8-cddc0af8d67f	31b211c4-5c51-42c1-b161-2fd935a76808	affcc6ba-fc4a-408d-beb6-5cf5b14b5460	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	85.00	Água e saneamento	CONFIRMED	DEBIT_CARD	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:37.887	2026-04-16 13:43:37.887
81a3b0a6-b4da-472f-a666-e58e471f344a	31b211c4-5c51-42c1-b161-2fd935a76808	5e13b743-02c3-4672-93b6-79b60292bb61	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	230.00	Internet fibra + telefone	CONFIRMED	DEBIT_CARD	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:38.002	2026-04-16 13:43:38.002
75edaac8-5812-4452-9150-27de8b2b898d	31b211c4-5c51-42c1-b161-2fd935a76808	a1cfb85e-baed-42e2-9640-0fdc86a0d8e0	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Folha de pagamento	CONFIRMED	BANK_TRANSFER	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:38.117	2026-04-16 13:43:38.117
482ce4eb-2b41-43a3-9e2e-44913f40561b	857a5a1c-7562-42f0-9a78-e048c0d2f757	20404652-9925-4c91-9b8c-68970e264e55	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	150.00	Sistema ADQPAL / licenças	CONFIRMED	CREDIT_CARD	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:38.231	2026-04-16 13:43:38.231
2a6129e4-2475-4a35-9d37-7ec6f0eacfd9	31b211c4-5c51-42c1-b161-2fd935a76808	c0401b2f-b860-4c71-861c-218c76e05dfa	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	480.00	Simples Nacional	CONFIRMED	BANK_TRANSFER	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	t	\N	\N	\N	\N	{seed,fixo}	\N	\N	2026-04-16 13:43:38.346	2026-04-16 13:43:38.346
6e3010b1-2b18-42fb-8cb8-a3b55cad85d3	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	222.81	Consulta online	CONFIRMED	PIX	2026-04-15 13:00:00	2026-04-15 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:38.461	2026-04-16 13:43:38.461
2cc8c070-a487-4af7-9cb6-174d15abafe3	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	222.20	Consulta Unimed	CONFIRMED	INSURANCE	2026-04-13 13:00:00	2026-04-13 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:38.576	2026-04-16 13:43:38.576
180b0125-1e7e-43d4-b123-9e745a01c780	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	241.77	Eletrocardiograma	CONFIRMED	DEBIT_CARD	2026-04-13 13:00:00	2026-04-13 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:38.69	2026-04-16 13:43:38.69
e2652297-f000-411b-8f3b-1ec8912225fe	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	165.42	Consulta Unimed	CONFIRMED	INSURANCE	2026-04-11 13:00:00	2026-04-11 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:38.804	2026-04-16 13:43:38.804
c60838b7-4293-4b76-8459-cf673dad3636	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	105.43	Exame de sangue	CONFIRMED	PIX	2026-04-09 13:00:00	2026-04-09 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:38.92	2026-04-16 13:43:38.92
7118185e-1035-45d3-8acd-676111d512d3	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	419.09	Consulta particular	CONFIRMED	PIX	2026-04-09 13:00:00	2026-04-09 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.034	2026-04-16 13:43:39.034
4c78f4d7-a252-4109-9d15-40aaf28e301a	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	147.44	Consulta Unimed	CONFIRMED	INSURANCE	2026-04-07 13:00:00	2026-04-07 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.149	2026-04-16 13:43:39.149
6bde7eec-65c8-4532-9c6f-39bdd72feb46	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	425.65	Consulta particular	CONFIRMED	PIX	2026-04-05 13:00:00	2026-04-05 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.268	2026-04-16 13:43:39.268
2ebc3bde-7ade-4c0b-b872-92c323ccf3e9	857a5a1c-7562-42f0-9a78-e048c0d2f757	675caf3d-5483-49a2-99c5-d5adeb7989c2	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	645.17	Procedimento dermatológico	CONFIRMED	CREDIT_CARD	2026-04-03 13:00:00	2026-04-03 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.383	2026-04-16 13:43:39.383
7a2428a8-bef6-4537-b56c-2634e5d3ba92	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	121.75	Exame de sangue	CONFIRMED	PIX	2026-04-01 13:00:00	2026-04-01 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.498	2026-04-16 13:43:39.498
77f95a35-df64-4463-aa8c-5da12d4c1e83	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	250.71	Consulta Unimed	CONFIRMED	INSURANCE	2026-04-01 13:00:00	2026-04-01 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.613	2026-04-16 13:43:39.613
63a7dabb-9dc0-4423-b9c7-e0d730e3e4a0	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	225.19	Consulta particular	CONFIRMED	CASH	2026-03-30 13:00:00	2026-03-30 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.728	2026-04-16 13:43:39.728
876acac9-7e53-4f3a-ba55-1124607e1d79	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	281.63	Consulta online	CONFIRMED	PIX	2026-03-28 13:00:00	2026-03-28 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.843	2026-04-16 13:43:39.843
17592244-0ece-4d5a-97dd-ae99b7c18bf5	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	428.17	Consulta particular	CONFIRMED	CASH	2026-03-28 13:00:00	2026-03-28 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:39.958	2026-04-16 13:43:39.958
57edd1ba-6ca7-4bb7-a28c-1bbb57f17e12	857a5a1c-7562-42f0-9a78-e048c0d2f757	675caf3d-5483-49a2-99c5-d5adeb7989c2	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	438.43	Procedimento dermatológico	CONFIRMED	CREDIT_CARD	2026-03-26 13:00:00	2026-03-26 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.073	2026-04-16 13:43:40.073
0961255d-565b-4163-ade4-613ba37a24d7	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	249.01	Consulta particular	CONFIRMED	CASH	2026-03-24 13:00:00	2026-03-24 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.188	2026-04-16 13:43:40.188
7e4819cc-b3e8-4f57-84b3-99ae7c326025	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	176.42	Consulta Bradesco Saúde	CONFIRMED	INSURANCE	2026-03-22 13:00:00	2026-03-22 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.303	2026-04-16 13:43:40.303
88fe7125-a492-4a5c-9502-a856bfa1b8fd	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	91.47	Exame de sangue	CONFIRMED	PIX	2026-03-20 13:00:00	2026-03-20 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.419	2026-04-16 13:43:40.419
a2fcd814-03fe-4582-8919-c44dc6d222e8	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	274.15	Eletrocardiograma	CONFIRMED	DEBIT_CARD	2026-03-20 13:00:00	2026-03-20 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.533	2026-04-16 13:43:40.533
0d3c6b26-d44b-4dda-bdbb-a99372fe819a	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	213.57	Consulta Unimed	CONFIRMED	INSURANCE	2026-03-18 13:00:00	2026-03-18 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.648	2026-04-16 13:43:40.648
1518156f-c304-418d-9390-1ecf01fd2f54	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	240.46	Consulta Unimed	CONFIRMED	INSURANCE	2026-03-16 13:00:00	2026-03-16 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.763	2026-04-16 13:43:40.763
bcfb01a3-47c3-41f5-af91-d168da592578	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	259.61	Consulta Unimed	CONFIRMED	INSURANCE	2026-03-14 13:00:00	2026-03-14 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.879	2026-04-16 13:43:40.879
b4a2adca-92dd-4d59-8667-20e3ea3da33a	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	272.47	Consulta particular	CONFIRMED	CASH	2026-03-12 13:00:00	2026-03-12 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:40.994	2026-04-16 13:43:40.994
835c28db-5882-47aa-a05b-66e7d8c9bd73	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	89.84	Exame de sangue	CONFIRMED	PIX	2026-03-10 13:00:00	2026-03-10 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.109	2026-04-16 13:43:41.109
0467e81d-902e-4385-861b-5e528fdea2a7	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	95.12	Exame de sangue	CONFIRMED	PIX	2026-03-08 13:00:00	2026-03-08 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.224	2026-04-16 13:43:41.224
e175dae9-8b23-45de-bce2-7cb386498d78	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	187.86	Eletrocardiograma	CONFIRMED	DEBIT_CARD	2026-03-06 13:00:00	2026-03-06 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.338	2026-04-16 13:43:41.338
58d9dc25-54e6-4806-b0fb-6e213a41529a	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	405.04	Consulta particular	CONFIRMED	CASH	2026-03-06 13:00:00	2026-03-06 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.453	2026-04-16 13:43:41.453
e9ad7067-a2bf-4eee-9f7b-b526c36c2f81	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	272.12	Consulta particular	CONFIRMED	PIX	2026-03-04 13:00:00	2026-03-04 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.568	2026-04-16 13:43:41.568
68debef2-df1a-4d69-ab87-d28fea9c8c47	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	156.50	Consulta Bradesco Saúde	CONFIRMED	INSURANCE	2026-03-02 13:00:00	2026-03-02 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.682	2026-04-16 13:43:41.682
2b89b56e-6785-4b33-a45b-13fa6852d0cd	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	189.94	Consulta Bradesco Saúde	CONFIRMED	INSURANCE	2026-02-28 13:00:00	2026-02-28 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.802	2026-04-16 13:43:41.802
d79f5aed-731c-4064-aa45-81969a5c3987	857a5a1c-7562-42f0-9a78-e048c0d2f757	675caf3d-5483-49a2-99c5-d5adeb7989c2	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	507.74	Procedimento dermatológico	CONFIRMED	CREDIT_CARD	2026-02-28 13:00:00	2026-02-28 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:41.921	2026-04-16 13:43:41.921
9937b278-60c5-4ba5-bd05-6bf42538cf44	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	305.56	Consulta online	CONFIRMED	PIX	2026-02-26 13:00:00	2026-02-26 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.037	2026-04-16 13:43:42.037
ad055d59-2143-4f0a-8ab7-398f32f31072	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	261.41	Consulta particular	CONFIRMED	CASH	2026-02-26 13:00:00	2026-02-26 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.152	2026-04-16 13:43:42.152
e3649506-7a54-433c-b7da-10dccd855c4b	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	349.62	Consulta particular	CONFIRMED	PIX	2026-02-24 13:00:00	2026-02-24 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.268	2026-04-16 13:43:42.268
992d8625-0e10-4605-91ab-13147aa01669	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	420.78	Consulta particular	CONFIRMED	CASH	2026-02-24 13:00:00	2026-02-24 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.383	2026-04-16 13:43:42.383
8e1e231b-f746-41b0-b6a2-13a8f82e944b	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	311.35	Consulta particular	CONFIRMED	PIX	2026-02-22 13:00:00	2026-02-22 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.499	2026-04-16 13:43:42.499
f8cc5a20-2a7d-4832-a8e6-57ac66ee4950	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	102.48	Exame de sangue	CONFIRMED	PIX	2026-02-22 13:00:00	2026-02-22 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.614	2026-04-16 13:43:42.614
d870c582-f25c-4262-b869-467ebdf37903	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	340.86	Consulta particular	CONFIRMED	PIX	2026-02-20 13:00:00	2026-02-20 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.731	2026-04-16 13:43:42.731
70efb4c4-9946-47ec-af46-b3d608e5a157	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	211.63	Consulta Bradesco Saúde	CONFIRMED	INSURANCE	2026-02-20 13:00:00	2026-02-20 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:42.957	2026-04-16 13:43:42.957
04cd309e-721d-4439-8e20-b5ccecb315af	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	240.45	Consulta Bradesco Saúde	CONFIRMED	INSURANCE	2026-02-18 13:00:00	2026-02-18 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.072	2026-04-16 13:43:43.072
7d8011a7-7034-4b2f-a7ca-888ca4b7778b	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	157.74	Consulta Unimed	CONFIRMED	INSURANCE	2026-02-18 13:00:00	2026-02-18 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.187	2026-04-16 13:43:43.187
dfdb6819-8383-4583-a32d-6867621cee42	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	279.59	Consulta Unimed	CONFIRMED	INSURANCE	2026-02-16 13:00:00	2026-02-16 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.301	2026-04-16 13:43:43.301
8ca2bbad-9461-4ea4-a00f-d1548cd02df2	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	266.09	Consulta Unimed	CONFIRMED	INSURANCE	2026-02-14 13:00:00	2026-02-14 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.417	2026-04-16 13:43:43.417
0d4bd872-2efc-4977-815b-c2b0ddd664ed	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	372.56	Consulta particular	CONFIRMED	PIX	2026-02-12 13:00:00	2026-02-12 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.532	2026-04-16 13:43:43.532
77b2bc9f-2c79-43cf-85b9-d078be3e4502	38091e79-5937-4e60-888e-34c3842e082a	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	332.72	Consulta particular	CONFIRMED	CASH	2026-02-12 13:00:00	2026-02-12 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.647	2026-04-16 13:43:43.647
eb8311b0-dd0a-4765-bbfb-6c9a4907202b	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	369.74	Consulta particular	CONFIRMED	PIX	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.762	2026-04-16 13:43:43.762
22793209-8070-49d2-810d-e5dcc7fdd690	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	110.06	Exame de sangue	CONFIRMED	PIX	2026-02-10 13:00:00	2026-02-10 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.878	2026-04-16 13:43:43.878
0d25634d-3009-48aa-84ad-24ba4223422a	857a5a1c-7562-42f0-9a78-e048c0d2f757	675caf3d-5483-49a2-99c5-d5adeb7989c2	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	709.19	Procedimento dermatológico	CONFIRMED	CREDIT_CARD	2026-02-08 13:00:00	2026-02-08 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:43.993	2026-04-16 13:43:43.993
707c64dd-19af-4fd7-bac3-6495b8f32148	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	130.10	Exame de sangue	CONFIRMED	PIX	2026-02-06 13:00:00	2026-02-06 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.108	2026-04-16 13:43:44.108
867ea506-8a80-49e4-afc2-bb7730578792	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	189.54	Exame de sangue	CONFIRMED	PIX	2026-02-04 13:00:00	2026-02-04 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.224	2026-04-16 13:43:44.224
fe015152-4f1a-4039-8181-1bd67a8722bf	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	159.36	Eletrocardiograma	CONFIRMED	DEBIT_CARD	2026-02-02 13:00:00	2026-02-02 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.339	2026-04-16 13:43:44.339
d4a98387-a7ae-4722-8325-7fc9a8ae802c	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	204.02	Consulta online	CONFIRMED	PIX	2026-02-02 13:00:00	2026-02-02 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.454	2026-04-16 13:43:44.454
22cf47c5-c7e4-4553-aa57-131f3b371718	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	88.83	Exame de sangue	CONFIRMED	PIX	2026-01-31 13:00:00	2026-01-31 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.569	2026-04-16 13:43:44.569
c48c66c8-d623-4559-9829-33b2fdc00178	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	254.24	Consulta online	CONFIRMED	PIX	2026-01-29 13:00:00	2026-01-29 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.684	2026-04-16 13:43:44.684
8e8010e0-e113-48be-bc25-65435899c0ab	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	301.59	Consulta particular	CONFIRMED	PIX	2026-01-29 13:00:00	2026-01-29 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.798	2026-04-16 13:43:44.798
37118c7e-1ca9-439c-bdd5-733357ec1af6	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	237.57	Eletrocardiograma	CONFIRMED	DEBIT_CARD	2026-01-27 13:00:00	2026-01-27 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:44.913	2026-04-16 13:43:44.913
a84e8c24-a372-4efd-bfa3-d5fadbd3c355	857a5a1c-7562-42f0-9a78-e048c0d2f757	675caf3d-5483-49a2-99c5-d5adeb7989c2	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	494.09	Procedimento dermatológico	CONFIRMED	CREDIT_CARD	2026-01-25 13:00:00	2026-01-25 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.027	2026-04-16 13:43:45.027
b9e02025-89b2-4704-b9f2-9e87837cb054	31b211c4-5c51-42c1-b161-2fd935a76808	5de7d6fb-9c9b-496f-80eb-7397ea38d28f	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	194.79	Consulta Bradesco Saúde	CONFIRMED	INSURANCE	2026-01-23 13:00:00	2026-01-23 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.141	2026-04-16 13:43:45.141
c070ae2d-5d6f-4b66-89ac-872621f0f353	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	432.43	Consulta particular	CONFIRMED	PIX	2026-01-23 13:00:00	2026-01-23 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.257	2026-04-16 13:43:45.257
0a57a90c-75c4-4fb8-b2bc-0d00a3e3cdc0	31b211c4-5c51-42c1-b161-2fd935a76808	06abb361-7494-45c3-aa2a-70a23cb5756d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	212.03	Consulta online	CONFIRMED	PIX	2026-01-21 13:00:00	2026-01-21 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.374	2026-04-16 13:43:45.374
4d9c5a1a-edb5-4121-a0fd-ec63e3dbcbe1	31b211c4-5c51-42c1-b161-2fd935a76808	212570a1-d9c8-4679-8e04-fde6f9297e54	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	168.22	Exame de sangue	CONFIRMED	PIX	2026-01-19 13:00:00	2026-01-19 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.491	2026-04-16 13:43:45.491
b68e30be-b62a-45fc-a258-7f21dd9b2927	857a5a1c-7562-42f0-9a78-e048c0d2f757	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	464.40	Compra material médico	CONFIRMED	CREDIT_CARD	2026-04-15 13:00:00	2026-04-15 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.608	2026-04-16 13:43:45.608
50822ed1-02ad-4358-85a2-a3e6e624dd95	857a5a1c-7562-42f0-9a78-e048c0d2f757	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	802.59	Compra material médico	CONFIRMED	CREDIT_CARD	2026-04-10 13:00:00	2026-04-10 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.722	2026-04-16 13:43:45.722
3f2304e1-04fe-4f52-acc1-6ab5d8e0cbab	31b211c4-5c51-42c1-b161-2fd935a76808	46771b68-b64d-40c9-9910-cc9e8501b6f3	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	1123.44	Manutenção equipamento	CONFIRMED	BANK_TRANSFER	2026-04-05 13:00:00	2026-04-05 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.838	2026-04-16 13:43:45.838
0da2b76a-3eee-4bd2-8904-c7bb8da10b92	857a5a1c-7562-42f0-9a78-e048c0d2f757	c3cbc9ec-364e-4980-bd78-109ed1376dfd	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	130.04	Papel A4 / cartuchos	CONFIRMED	CREDIT_CARD	2026-03-31 13:00:00	2026-03-31 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:45.952	2026-04-16 13:43:45.952
fceac22f-8ba3-414d-ac9d-6bb6963bb7f8	857a5a1c-7562-42f0-9a78-e048c0d2f757	c3cbc9ec-364e-4980-bd78-109ed1376dfd	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	198.23	Papel A4 / cartuchos	CONFIRMED	CREDIT_CARD	2026-03-26 13:00:00	2026-03-26 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.067	2026-04-16 13:43:46.067
c8129d6c-4666-4b0e-9d94-6052da878a7e	31b211c4-5c51-42c1-b161-2fd935a76808	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	169.40	Luvas e EPIs	CONFIRMED	PIX	2026-03-21 13:00:00	2026-03-21 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.182	2026-04-16 13:43:46.182
73885fd8-db5e-44b3-9d8f-879a3f6f5697	31b211c4-5c51-42c1-b161-2fd935a76808	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	348.31	Luvas e EPIs	CONFIRMED	PIX	2026-03-16 13:00:00	2026-03-16 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.297	2026-04-16 13:43:46.297
ccb6b19a-29e4-4d30-8767-43d8d907dcd8	31b211c4-5c51-42c1-b161-2fd935a76808	46771b68-b64d-40c9-9910-cc9e8501b6f3	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	705.45	Manutenção equipamento	CONFIRMED	BANK_TRANSFER	2026-03-11 13:00:00	2026-03-11 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.412	2026-04-16 13:43:46.412
a4f39eb7-bb77-4802-94b9-dbfb1fb8dada	857a5a1c-7562-42f0-9a78-e048c0d2f757	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	866.19	Compra material médico	CONFIRMED	CREDIT_CARD	2026-03-06 13:00:00	2026-03-06 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.526	2026-04-16 13:43:46.526
7e1f83ca-83b4-4df7-895f-3dfa3ea43a38	31b211c4-5c51-42c1-b161-2fd935a76808	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	205.88	Luvas e EPIs	CONFIRMED	PIX	2026-03-01 13:00:00	2026-03-01 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.641	2026-04-16 13:43:46.641
21940581-5e10-45dc-97c5-ca322fb28b8c	31b211c4-5c51-42c1-b161-2fd935a76808	46771b68-b64d-40c9-9910-cc9e8501b6f3	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	845.86	Manutenção equipamento	CONFIRMED	BANK_TRANSFER	2026-02-24 13:00:00	2026-02-24 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.757	2026-04-16 13:43:46.757
cfb941dc-3306-48cf-8ea9-ef9cc4faf94c	31b211c4-5c51-42c1-b161-2fd935a76808	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	306.82	Luvas e EPIs	CONFIRMED	PIX	2026-02-19 13:00:00	2026-02-19 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.872	2026-04-16 13:43:46.872
fed25dd0-7f46-4cc9-a1be-26e4c488700f	857a5a1c-7562-42f0-9a78-e048c0d2f757	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	742.35	Compra material médico	CONFIRMED	CREDIT_CARD	2026-02-14 13:00:00	2026-02-14 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:46.987	2026-04-16 13:43:46.987
95b1f098-deb2-4f49-875e-fbcfa8c6d096	857a5a1c-7562-42f0-9a78-e048c0d2f757	c3cbc9ec-364e-4980-bd78-109ed1376dfd	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	194.19	Papel A4 / cartuchos	CONFIRMED	CREDIT_CARD	2026-02-09 13:00:00	2026-02-09 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:47.102	2026-04-16 13:43:47.102
ace1bf28-f81e-4bb8-931e-d631a21f171f	857a5a1c-7562-42f0-9a78-e048c0d2f757	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	420.91	Compra material médico	CONFIRMED	CREDIT_CARD	2026-02-04 13:00:00	2026-02-04 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:47.218	2026-04-16 13:43:47.218
e3ba1840-a461-43ad-9fbc-85de775611fb	857a5a1c-7562-42f0-9a78-e048c0d2f757	c3cbc9ec-364e-4980-bd78-109ed1376dfd	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	80.39	Papel A4 / cartuchos	CONFIRMED	CREDIT_CARD	2026-01-30 13:00:00	2026-01-30 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:47.333	2026-04-16 13:43:47.333
ba74f2af-3076-4d72-94b3-bbe259959c2b	31b211c4-5c51-42c1-b161-2fd935a76808	46771b68-b64d-40c9-9910-cc9e8501b6f3	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	444.46	Dedetização / limpeza	CONFIRMED	PIX	2026-01-25 13:00:00	2026-01-25 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:47.449	2026-04-16 13:43:47.449
76bf127f-c8df-4dbd-a7d9-a112a2ac080b	857a5a1c-7562-42f0-9a78-e048c0d2f757	50fafc31-2777-409d-9e73-98421fdb646d	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	569.52	Compra material médico	CONFIRMED	CREDIT_CARD	2026-01-20 13:00:00	2026-01-20 13:00:00	\N	f	\N	\N	\N	\N	{seed}	\N	\N	2026-04-16 13:43:47.725	2026-04-16 13:43:47.725
3d5d4c7b-236d-43de-a81d-164493631d28	31b211c4-5c51-42c1-b161-2fd935a76808	aad83890-61d6-473b-b352-93b0e8523388	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	3200.00	Aluguel próximo mês	PENDING	BANK_TRANSFER	2026-05-01 13:00:00	\N	\N	f	\N	\N	\N	\N	{seed,pendente}	\N	\N	2026-04-16 13:43:47.842	2026-04-16 13:43:47.842
845fd732-f8e7-4de7-a8cc-f890e996929f	31b211c4-5c51-42c1-b161-2fd935a76808	a1cfb85e-baed-42e2-9640-0fdc86a0d8e0	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Folha próximo mês	PENDING	BANK_TRANSFER	2026-05-06 13:00:00	\N	\N	f	\N	\N	\N	\N	{seed,pendente}	\N	\N	2026-04-16 13:43:48.071	2026-04-16 13:43:48.071
af997710-15d3-46ce-9431-c3eb81f007f1	857a5a1c-7562-42f0-9a78-e048c0d2f757	20404652-9925-4c91-9b8c-68970e264e55	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	150.00	Renovação licença sistema	PENDING	CREDIT_CARD	2026-04-26 13:00:00	\N	\N	f	\N	\N	\N	\N	{seed,pendente}	\N	\N	2026-04-16 13:43:48.186	2026-04-16 13:43:48.186
ba82b0e3-ce58-4cd1-ae57-a0f25b65b9c8	56bf65e9-1fcd-495b-9a6e-62deb68ab013	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	TRANSFER	2000.00	Transferência poupança → corrente	CONFIRMED	BANK_TRANSFER	2026-04-02 13:00:00	2026-04-02 13:00:00	\N	f	\N	\N	\N	31b211c4-5c51-42c1-b161-2fd935a76808	{seed}	\N	\N	2026-04-16 13:43:48.303	2026-04-16 13:43:48.303
18344118-2dd7-4e11-a816-14bdc2b93b7c	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	350.00	Pagamento consulta particular	CONFIRMED	OTHER	2026-01-16 00:00:00	2026-01-16 00:00:00	pluggy_mock-tx-mock-acc-001-0	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:52.745	2026-04-16 17:38:52.745
70b416c5-1094-4e73-9509-58f064660496	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Aluguel sala clínica	CONFIRMED	OTHER	2026-01-20 00:00:00	2026-01-20 00:00:00	pluggy_mock-tx-mock-acc-001-1	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:53.132	2026-04-16 17:38:53.132
817d5576-3328-449d-a000-2041fc582bf9	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	1200.00	Plano de saúde - repasse	CONFIRMED	OTHER	2026-01-24 00:00:00	2026-01-24 00:00:00	pluggy_mock-tx-mock-acc-001-2	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:53.39	2026-04-16 17:38:53.39
959928b7-2d21-4959-b43b-3b02d555e78f	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	180.50	Energia elétrica	CONFIRMED	OTHER	2026-01-28 00:00:00	2026-01-28 00:00:00	pluggy_mock-tx-mock-acc-001-3	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:53.645	2026-04-16 17:38:53.645
ab038ea5-c6d0-4134-b0fd-cb709ecf935a	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	95.00	Material de escritório	CONFIRMED	OTHER	2026-02-01 00:00:00	2026-02-01 00:00:00	pluggy_mock-tx-mock-acc-001-4	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:53.9	2026-04-16 17:38:53.9
7aa32c63-6f90-46a3-b080-30df8e11ae8a	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	420.00	Consulta convênio Unimed	CONFIRMED	OTHER	2026-02-05 00:00:00	2026-02-05 00:00:00	pluggy_mock-tx-mock-acc-001-5	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:54.157	2026-04-16 17:38:54.157
e77e3433-e36d-475a-a010-a5e783cf4eb1	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	130.00	Internet fibra	CONFIRMED	OTHER	2026-02-09 00:00:00	2026-02-09 00:00:00	pluggy_mock-tx-mock-acc-001-6	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:54.412	2026-04-16 17:38:54.412
4e8799dc-a04d-4967-9575-82ddf0b561c2	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	4500.00	Folha de pagamento	CONFIRMED	OTHER	2026-02-13 00:00:00	2026-02-13 00:00:00	pluggy_mock-tx-mock-acc-001-7	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:54.672	2026-04-16 17:38:54.672
a1f46a58-7755-47ad-a2b2-f84ee40250f8	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	200.00	Consulta particular - Pix	CONFIRMED	PIX	2026-02-17 00:00:00	2026-02-17 00:00:00	pluggy_mock-tx-mock-acc-001-8	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:55.054	2026-04-16 17:38:55.054
6a630632-9dc2-4b62-938f-3b3613c05c92	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	650.00	Fornecedor material médico	CONFIRMED	OTHER	2026-02-21 00:00:00	2026-02-21 00:00:00	pluggy_mock-tx-mock-acc-001-9	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:55.313	2026-04-16 17:38:55.313
b0586f00-5407-4d82-924d-76afe3aa2cc5	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	350.00	Pagamento consulta particular	CONFIRMED	OTHER	2026-02-25 00:00:00	2026-02-25 00:00:00	pluggy_mock-tx-mock-acc-001-10	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:55.568	2026-04-16 17:38:55.568
602003ff-755d-4346-95c9-7f69d8cbdcaa	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Aluguel sala clínica	CONFIRMED	OTHER	2026-03-01 00:00:00	2026-03-01 00:00:00	pluggy_mock-tx-mock-acc-001-11	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:55.824	2026-04-16 17:38:55.824
221500bb-7d69-4c31-80e0-dbbeb39d4b30	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	1200.00	Plano de saúde - repasse	CONFIRMED	OTHER	2026-03-05 00:00:00	2026-03-05 00:00:00	pluggy_mock-tx-mock-acc-001-12	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:56.079	2026-04-16 17:38:56.079
59ca524a-76ff-4e9d-bf30-fa2dd9c17d09	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	180.50	Energia elétrica	CONFIRMED	OTHER	2026-03-09 00:00:00	2026-03-09 00:00:00	pluggy_mock-tx-mock-acc-001-13	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:56.336	2026-04-16 17:38:56.336
f0646ba9-c62c-497b-9c9f-088b2a6ca49f	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	95.00	Material de escritório	CONFIRMED	OTHER	2026-03-13 00:00:00	2026-03-13 00:00:00	pluggy_mock-tx-mock-acc-001-14	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:56.593	2026-04-16 17:38:56.593
7efc6e75-d70f-4139-8d5d-c21408d49ee3	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	420.00	Consulta convênio Unimed	CONFIRMED	OTHER	2026-03-17 00:00:00	2026-03-17 00:00:00	pluggy_mock-tx-mock-acc-001-15	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:56.856	2026-04-16 17:38:56.856
9a0e2a0c-6b63-41e2-98a6-8950c8240ae5	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	130.00	Internet fibra	CONFIRMED	OTHER	2026-03-21 00:00:00	2026-03-21 00:00:00	pluggy_mock-tx-mock-acc-001-16	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:57.112	2026-04-16 17:38:57.112
88c708ae-0619-44eb-a3c4-3e98c43003ee	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	4500.00	Folha de pagamento	CONFIRMED	OTHER	2026-03-25 00:00:00	2026-03-25 00:00:00	pluggy_mock-tx-mock-acc-001-17	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:57.369	2026-04-16 17:38:57.369
72f61543-81ad-49c1-884f-6060b09c0921	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	200.00	Consulta particular - Pix	CONFIRMED	PIX	2026-03-29 00:00:00	2026-03-29 00:00:00	pluggy_mock-tx-mock-acc-001-18	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:57.627	2026-04-16 17:38:57.627
49091aa0-b1a1-49e8-89eb-7da37328d88e	896e7cd7-9f63-4cee-af3c-dafca79c1b2a	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	650.00	Fornecedor material médico	CONFIRMED	OTHER	2026-04-02 00:00:00	2026-04-02 00:00:00	pluggy_mock-tx-mock-acc-001-19	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:57.885	2026-04-16 17:38:57.885
59b438af-2a61-4324-a4c9-d060a68ac682	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	350.00	Pagamento consulta particular	CONFIRMED	OTHER	2026-01-16 00:00:00	2026-01-16 00:00:00	pluggy_mock-tx-mock-acc-002-0	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:58.401	2026-04-16 17:38:58.401
867c340e-9baa-4a4c-a7e3-664cc34d6446	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Aluguel sala clínica	CONFIRMED	OTHER	2026-01-20 00:00:00	2026-01-20 00:00:00	pluggy_mock-tx-mock-acc-002-1	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:58.659	2026-04-16 17:38:58.659
5259450c-c16d-4a1d-8aa9-87ed52f48ce7	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	1200.00	Plano de saúde - repasse	CONFIRMED	OTHER	2026-01-24 00:00:00	2026-01-24 00:00:00	pluggy_mock-tx-mock-acc-002-2	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:58.916	2026-04-16 17:38:58.916
07f93f98-be7c-44a9-85e3-068e5ec5f451	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	180.50	Energia elétrica	CONFIRMED	OTHER	2026-01-28 00:00:00	2026-01-28 00:00:00	pluggy_mock-tx-mock-acc-002-3	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.173	2026-04-16 17:38:59.173
b83115e2-b16b-46f8-9f5c-78e8bff066a4	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	95.00	Material de escritório	CONFIRMED	OTHER	2026-02-01 00:00:00	2026-02-01 00:00:00	pluggy_mock-tx-mock-acc-002-4	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.429	2026-04-16 17:38:59.429
9a0e932f-0336-4b46-a0a3-6b2caac6fa38	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	420.00	Consulta convênio Unimed	CONFIRMED	OTHER	2026-02-05 00:00:00	2026-02-05 00:00:00	pluggy_mock-tx-mock-acc-002-5	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.688	2026-04-16 17:38:59.688
0976738c-9ffb-4756-9305-4c63e6e16519	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	130.00	Internet fibra	CONFIRMED	OTHER	2026-02-09 00:00:00	2026-02-09 00:00:00	pluggy_mock-tx-mock-acc-002-6	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.945	2026-04-16 17:38:59.945
ac7e70ca-dc56-458f-a7b0-6699eb90ffe8	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	4500.00	Folha de pagamento	CONFIRMED	OTHER	2026-02-13 00:00:00	2026-02-13 00:00:00	pluggy_mock-tx-mock-acc-002-7	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.201	2026-04-16 17:39:00.201
63a09dfa-e892-4f27-813f-03cb782ecd97	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	200.00	Consulta particular - Pix	CONFIRMED	PIX	2026-02-17 00:00:00	2026-02-17 00:00:00	pluggy_mock-tx-mock-acc-002-8	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.457	2026-04-16 17:39:00.457
011fb640-0dc9-49ee-985f-d1e04351e387	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	650.00	Fornecedor material médico	CONFIRMED	OTHER	2026-02-21 00:00:00	2026-02-21 00:00:00	pluggy_mock-tx-mock-acc-002-9	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.713	2026-04-16 17:39:00.713
ee35c8d4-0a81-4309-a5e4-69dc62540770	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	350.00	Pagamento consulta particular	CONFIRMED	OTHER	2026-02-25 00:00:00	2026-02-25 00:00:00	pluggy_mock-tx-mock-acc-002-10	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.971	2026-04-16 17:39:00.971
6e3bc225-b674-4098-93fc-d5fd8669422c	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	2800.00	Aluguel sala clínica	CONFIRMED	OTHER	2026-03-01 00:00:00	2026-03-01 00:00:00	pluggy_mock-tx-mock-acc-002-11	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.457	2026-04-16 17:39:00.457
59951330-f053-45a6-bfdc-de80eb1f1024	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	1200.00	Plano de saúde - repasse	CONFIRMED	OTHER	2026-03-05 00:00:00	2026-03-05 00:00:00	pluggy_mock-tx-mock-acc-002-12	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:58.863	2026-04-16 17:38:58.863
85615ce2-57e5-4d59-bcb5-8fd322b06e21	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	180.50	Energia elétrica	CONFIRMED	OTHER	2026-03-09 00:00:00	2026-03-09 00:00:00	pluggy_mock-tx-mock-acc-002-13	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.137	2026-04-16 17:38:59.137
a30a6a74-3ce6-4d04-bfb5-c51587561b2a	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	95.00	Material de escritório	CONFIRMED	OTHER	2026-03-13 00:00:00	2026-03-13 00:00:00	pluggy_mock-tx-mock-acc-002-14	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.397	2026-04-16 17:38:59.397
c5481980-b0f6-421d-892a-8d5309a05790	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	420.00	Consulta convênio Unimed	CONFIRMED	OTHER	2026-03-17 00:00:00	2026-03-17 00:00:00	pluggy_mock-tx-mock-acc-002-15	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.655	2026-04-16 17:38:59.655
407666b7-4666-425b-93d1-40f0b41e3319	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	130.00	Internet fibra	CONFIRMED	OTHER	2026-03-21 00:00:00	2026-03-21 00:00:00	pluggy_mock-tx-mock-acc-002-16	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:38:59.912	2026-04-16 17:38:59.912
d7ece2b8-3bc2-486c-a6ec-d6ce414c833c	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	4500.00	Folha de pagamento	CONFIRMED	OTHER	2026-03-25 00:00:00	2026-03-25 00:00:00	pluggy_mock-tx-mock-acc-002-17	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.168	2026-04-16 17:39:00.168
e8c87ddf-178f-40d2-a60e-dd7bc0a40a77	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	INCOME	200.00	Consulta particular - Pix	CONFIRMED	PIX	2026-03-29 00:00:00	2026-03-29 00:00:00	pluggy_mock-tx-mock-acc-002-18	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.539	2026-04-16 17:39:00.539
8be94554-916a-4ab9-9947-6264d5617480	7ab19b8a-2b26-40c0-bd5a-c2e654afd000	40c82366-fee4-4b39-bb0e-2410e67db24a	\N	\N	638370af-4975-4c8b-ae04-6710da636090	EXPENSE	650.00	Fornecedor material médico	CONFIRMED	OTHER	2026-04-02 00:00:00	2026-04-02 00:00:00	pluggy_mock-tx-mock-acc-002-19	f	\N	\N	\N	\N	{}	\N	\N	2026-04-16 17:39:00.922	2026-04-16 17:39:00.922
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, created_at, updated_at, cnpj, cpf, role_id, username) FROM stdin;
b029685a-43ec-41d3-a661-097dddaa18f4	dr.carlos@adqpal.com	$2a$10$N58gZzHP70RLPapd8uil1OtZXPsA4IBBM4pqjpHHw/ZjyQOOmAHxa	2026-04-16 13:42:59.246	2026-04-16 13:42:59.246	\N	22222222222	3	Dr. Carlos Silva
c6979d59-9589-416a-8504-3a2f1f340f0b	enfermeira.julia@adqpal.com	$2a$10$EJJ6Pl.GPRn0pyyyC/XWge7fzK4s9eljjldF09u64ltiWveWFBObm	2026-04-16 13:43:00.157	2026-04-16 13:43:00.157	\N	55555555555	4	Júlia Ferreira
fe0aea74-6d6b-4a20-ad6d-bd187de98bbe	recepcao@adqpal.com	$2a$10$qCZVmz/W2ZMaEK4bY8d8aOT4fLVKiX7at0fUhcxwEDaFZheNxQeLu	2026-04-16 13:43:00.459	2026-04-16 13:43:00.459	\N	66666666666	5	Mariana Costa
681d3c47-4392-439b-a900-0306273cd6d6	jaci@gmail.com	$2a$12$D/6jbQqgs.21lADFtBCmZu0oVuhCbwTVYZDLQsLDFpazQgTxU1ZLW	2026-04-17 13:44:35.229	2026-04-17 13:44:35.229	\N	51651651651	5	jaci santos
edd3bab9-f9d9-4fad-afa9-b4c085f11001	dr.ana@adqpal.com	$2a$10$dQhZ/qHiNxbfIdqZBx60jeupScrxgAO/3ZmO7oLe9xkG7AdgJY9Dq	2026-04-16 13:42:59.55	2026-04-16 13:42:59.55	\N	33333333333	3	Dra. Chupa Cú
53c96274-b378-4f2b-8835-b1b3cd553c92	edilsonluciabo@gmail.com	$2a$10$U3sPVj3OUZmB5CUl7VvNF.6yn2pZFcQ0bBUGhEzPo.tTU5DixwJem	2026-04-16 13:43:00.759	2026-04-16 13:43:00.759	\N	77777777777	9	Pedro TI
638370af-4975-4c8b-ae04-6710da636090	associacaoadqpal@gmail.com	$2b$12$MX10kA7FHzhr5234a2LB9uiihKEopv0C8ELC3DZybUanTpKiMHvAO	2026-04-16 13:42:58.821	2026-04-16 13:42:58.821	\N	11111111111	1	Admin ADQPAL
b3d9c2a1-8f5e-4c77-9d1a-2c9f7e6a1234	edilson591@gmail.com	$2a$12$9Jx9CBJcJMMlCaPW.W//tOgMNEJ07/hT2tbC2n5SVaYhw7iUIKk0a	2026-05-11 17:51:50.498	2026-05-29 14:18:23.808	\N	12345678901	1	Usuario Teste Reset
8d6a1c8a-7d83-42c4-b511-f553f49c0c85	dr.roberto@adqpal.com	$2a$10$Y1dVG.dtOcsdETFEfn.PxedU9huwAwcM0cy5l29eBXzegrFvsE5JW	2026-04-16 13:42:59.855	2026-07-08 01:18:59.475	\N	@e:Qc/HZkIWMCNcWAdmNDAjzQ==	3	Dr. Roberto Menezes
83f24610-5266-4ef7-a2de-31660e96680b	email@gmail.com	$2a$12$/1U7JVukFxmXUsogXOmSCu1.HHaTq63QKJz5z.bF/FxbuwV7pe2ci	2026-07-08 01:08:59.397	2026-07-08 13:06:31.138	\N	@e:cKsSiyxZ6EhqupZyUIs/zQ==	3	Dr Luiz Prazeres
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-05-27 05:03:19
20211116045059	2026-05-27 05:03:19
20211116050929	2026-05-27 05:03:19
20211116051442	2026-05-27 05:03:19
20211116212300	2026-05-27 05:03:19
20211116213355	2026-05-27 05:03:19
20211116213934	2026-05-27 05:03:19
20211116214523	2026-05-27 05:03:19
20211122062447	2026-05-27 05:03:19
20211124070109	2026-05-27 05:03:19
20211202204204	2026-05-27 05:03:19
20211202204605	2026-05-27 05:03:19
20211210212804	2026-05-27 05:03:19
20211228014915	2026-05-27 05:03:19
20220107221237	2026-05-27 05:03:19
20220228202821	2026-05-27 05:03:19
20220312004840	2026-05-27 05:03:19
20220603231003	2026-05-27 05:03:19
20220603232444	2026-05-27 05:03:19
20220615214548	2026-05-27 05:03:19
20220712093339	2026-05-27 05:03:19
20220908172859	2026-05-27 05:03:19
20220916233421	2026-05-27 05:03:19
20230119133233	2026-05-27 05:03:19
20230128025114	2026-05-27 05:03:19
20230128025212	2026-05-27 05:03:19
20230227211149	2026-05-27 05:03:20
20230228184745	2026-05-27 05:03:20
20230308225145	2026-05-27 05:03:20
20230328144023	2026-05-27 05:03:20
20231018144023	2026-05-27 05:03:20
20231204144023	2026-05-27 05:03:20
20231204144024	2026-05-27 05:03:20
20231204144025	2026-05-27 05:03:20
20240108234812	2026-05-27 05:03:20
20240109165339	2026-05-27 05:03:20
20240227174441	2026-05-27 05:03:20
20240311171622	2026-05-27 05:03:20
20240321100241	2026-05-27 05:03:20
20240401105812	2026-05-27 05:03:20
20240418121054	2026-05-27 05:03:20
20240523004032	2026-05-27 05:03:20
20240618124746	2026-05-27 05:03:20
20240801235015	2026-05-27 05:03:20
20240805133720	2026-05-27 05:03:20
20240827160934	2026-05-27 05:03:20
20240919163303	2026-05-27 05:03:20
20240919163305	2026-05-27 05:03:20
20241019105805	2026-05-27 05:03:20
20241030150047	2026-05-27 05:03:20
20241108114728	2026-05-27 05:03:20
20241121104152	2026-05-27 05:03:20
20241130184212	2026-05-27 05:03:20
20241220035512	2026-05-27 05:03:20
20241220123912	2026-05-27 05:03:20
20241224161212	2026-05-27 05:03:20
20250107150512	2026-05-27 05:03:20
20250110162412	2026-05-27 05:03:20
20250123174212	2026-05-27 05:03:20
20250128220012	2026-05-27 05:03:20
20250506224012	2026-05-27 05:03:20
20250523164012	2026-05-27 05:03:20
20250714121412	2026-05-27 05:03:20
20250905041441	2026-05-27 05:03:20
20251103001201	2026-05-27 05:03:20
20251120212548	2026-05-27 05:03:20
20251120215549	2026-05-27 05:03:20
20260218120000	2026-05-27 05:03:20
20260326120000	2026-05-27 05:03:20
20260514120000	2026-06-05 17:41:06
20260527120000	2026-06-05 17:41:06
20260528120000	2026-06-05 17:41:06
20260603120000	2026-06-05 17:41:06
20260605120000	2026-06-16 22:06:55
20260606110000	2026-06-16 22:06:55
20260616120000	2026-06-25 16:45:09
20260624120000	2026-06-25 16:45:10
20260626120000	2026-07-07 23:51:11
20260706120000	2026-07-07 23:51:11
20260707120000	2026-07-16 17:36:59
20260709120000	2026-07-16 17:36:59
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_realtime_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-05-27 05:03:23.354313
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-05-27 05:03:23.387219
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-05-27 05:03:23.391044
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-05-27 05:03:23.413713
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-05-27 05:03:23.425279
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-05-27 05:03:23.429247
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-05-27 05:03:23.433536
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-05-27 05:03:23.4379
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-05-27 05:03:23.441728
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-05-27 05:03:23.445802
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-05-27 05:03:23.449911
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-05-27 05:03:23.455146
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-05-27 05:03:23.459407
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-05-27 05:03:23.463429
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-05-27 05:03:23.467574
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-05-27 05:03:23.49506
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-05-27 05:03:23.498951
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-05-27 05:03:23.502901
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-05-27 05:03:23.506682
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-05-27 05:03:23.512074
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-05-27 05:03:23.516222
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-05-27 05:03:23.522098
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-05-27 05:03:23.534168
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-05-27 05:03:23.543508
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-05-27 05:03:23.5489
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-05-27 05:03:23.552946
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-05-27 05:03:23.557161
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-05-27 05:03:23.56082
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-05-27 05:03:23.564534
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-05-27 05:03:23.568145
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-05-27 05:03:23.571869
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-05-27 05:03:23.57545
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-05-27 05:03:23.57902
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-05-27 05:03:23.582591
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-05-27 05:03:23.586148
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-05-27 05:03:23.58961
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-05-27 05:03:23.593185
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-05-27 05:03:23.596619
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-05-27 05:03:23.601081
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-05-27 05:03:23.609672
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-05-27 05:03:23.613075
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-05-27 05:03:23.616646
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-05-27 05:03:23.620177
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-05-27 05:03:23.623766
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-05-27 05:03:23.627352
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-05-27 05:03:23.631785
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-05-27 05:03:23.643914
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-05-27 05:03:23.649103
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-05-27 05:03:23.652953
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-05-27 05:03:23.669403
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-05-27 05:03:23.673877
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-05-27 05:03:24.131096
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-05-27 05:03:24.132891
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-05-27 05:03:24.142413
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-05-27 05:03:24.144914
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-05-27 05:03:24.146691
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-05-27 05:03:24.151448
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-05-27 05:03:24.156597
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-05-27 05:03:24.160572
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-05-27 05:03:24.165173
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-05-27 05:03:24.169267
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: patient_registration_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patient_registration_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_realtime_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: empresa_config EmpresaConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_config
    ADD CONSTRAINT "EmpresaConfig_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: doctor_specialties doctor_specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT doctor_specialties_pkey PRIMARY KEY ("doctorId", "specialtyId");


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: financial_accounts financial_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_pkey PRIMARY KEY (id);


--
-- Name: financial_categories financial_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_categories
    ADD CONSTRAINT financial_categories_pkey PRIMARY KEY (id);


--
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- Name: notas_fiscais notas_fiscais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_fiscais
    ADD CONSTRAINT notas_fiscais_pkey PRIMARY KEY (id);


--
-- Name: patient_history patient_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_history
    ADD CONSTRAINT patient_history_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: pluggy_items pluggy_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pluggy_items
    ADD CONSTRAINT pluggy_items_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: specialties specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT specialties_pkey PRIMARY KEY (id);


--
-- Name: sus_procedures sus_procedures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sus_procedures
    ADD CONSTRAINT sus_procedures_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: idx_users_created_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_email ON auth.users USING btree (email);


--
-- Name: idx_users_last_sign_in_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);


--
-- Name: idx_users_name; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: PasswordResetToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON public."PasswordResetToken" USING btree (token);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_entity_idx ON public.audit_logs USING btree (entity);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: employees_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX employees_cpf_key ON public.employees USING btree (cpf);


--
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- Name: financial_accounts_pluggy_account_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX financial_accounts_pluggy_account_id_key ON public.financial_accounts USING btree (pluggy_account_id);


--
-- Name: medical_records_appointment_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX medical_records_appointment_id_key ON public.medical_records USING btree (appointment_id);


--
-- Name: notas_fiscais_numero_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX notas_fiscais_numero_key ON public.notas_fiscais USING btree (numero);


--
-- Name: patients_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_cpf_key ON public.patients USING btree (cpf);


--
-- Name: patients_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_email_key ON public.patients USING btree (email);


--
-- Name: patients_registration_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_registration_number_key ON public.patients USING btree (registration_number);


--
-- Name: pluggy_items_pluggy_item_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX pluggy_items_pluggy_item_id_key ON public.pluggy_items USING btree (pluggy_item_id);


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: specialties_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX specialties_name_key ON public.specialties USING btree (name);


--
-- Name: sus_procedures_codigo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sus_procedures_codigo_key ON public.sus_procedures USING btree (codigo);


--
-- Name: users_cnpj_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_cnpj_key ON public.users USING btree (cnpj);


--
-- Name: users_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_cpf_key ON public.users USING btree (cpf);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: appointments appointments_specialty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_specialty_id_fkey FOREIGN KEY (specialty_id) REFERENCES public.specialties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: appointments appointments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctor_specialties doctor_specialties_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctor_specialties doctor_specialties_specialtyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES public.specialties(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: financial_categories financial_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_categories
    ADD CONSTRAINT financial_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.financial_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: medical_records medical_records_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: medical_records medical_records_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notas_fiscais notas_fiscais_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_fiscais
    ADD CONSTRAINT notas_fiscais_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notas_fiscais notas_fiscais_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_fiscais
    ADD CONSTRAINT notas_fiscais_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notas_fiscais notas_fiscais_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_fiscais
    ADD CONSTRAINT notas_fiscais_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notas_fiscais notas_fiscais_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notas_fiscais
    ADD CONSTRAINT notas_fiscais_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: patient_history patient_history_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_history
    ADD CONSTRAINT patient_history_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: patient_history patient_history_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_history
    ADD CONSTRAINT patient_history_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: patient_history patient_history_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_history
    ADD CONSTRAINT patient_history_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.financial_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.financial_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_transfer_to_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_transfer_to_account_id_fkey FOREIGN KEY (transfer_to_account_id) REFERENCES public.financial_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: PasswordResetToken; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."PasswordResetToken" ENABLE ROW LEVEL SECURITY;

--
-- Name: _prisma_migrations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: doctor_specialties; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.doctor_specialties ENABLE ROW LEVEL SECURITY;

--
-- Name: employees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

--
-- Name: empresa_config; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.empresa_config ENABLE ROW LEVEL SECURITY;

--
-- Name: financial_accounts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;

--
-- Name: financial_categories; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: medical_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

--
-- Name: notas_fiscais; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;

--
-- Name: patient_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patient_history ENABLE ROW LEVEL SECURITY;

--
-- Name: patients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

--
-- Name: pluggy_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pluggy_items ENABLE ROW LEVEL SECURITY;

--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: specialties; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

--
-- Name: sus_procedures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sus_procedures ENABLE ROW LEVEL SECURITY;

--
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA storage TO anon;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA storage TO authenticated;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA storage TO service_role;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA storage TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;
SET SESSION AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA vault TO service_role;
RESET SESSION AUTHORIZATION;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO service_role;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION send_binary(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;
RESET SESSION AUTHORIZATION;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;
RESET SESSION AUTHORIZATION;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.flow_state TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.identities TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.instances TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.saml_providers TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.sessions TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.sso_domains TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.sso_providers TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT ON TABLE auth.users TO dashboard_user;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE "PasswordResetToken"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."PasswordResetToken" TO authenticated;
GRANT ALL ON TABLE public."PasswordResetToken" TO service_role;


--
-- Name: TABLE _prisma_migrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public._prisma_migrations TO authenticated;
GRANT ALL ON TABLE public._prisma_migrations TO service_role;


--
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.appointments TO authenticated;
GRANT ALL ON TABLE public.appointments TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: TABLE doctor_specialties; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.doctor_specialties TO authenticated;
GRANT ALL ON TABLE public.doctor_specialties TO service_role;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employees TO authenticated;
GRANT ALL ON TABLE public.employees TO service_role;


--
-- Name: TABLE empresa_config; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_config TO authenticated;
GRANT ALL ON TABLE public.empresa_config TO service_role;


--
-- Name: TABLE financial_accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.financial_accounts TO authenticated;
GRANT ALL ON TABLE public.financial_accounts TO service_role;


--
-- Name: TABLE financial_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.financial_categories TO authenticated;
GRANT ALL ON TABLE public.financial_categories TO service_role;


--
-- Name: TABLE medical_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.medical_records TO authenticated;
GRANT ALL ON TABLE public.medical_records TO service_role;


--
-- Name: TABLE notas_fiscais; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notas_fiscais TO authenticated;
GRANT ALL ON TABLE public.notas_fiscais TO service_role;


--
-- Name: TABLE patient_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.patient_history TO authenticated;
GRANT ALL ON TABLE public.patient_history TO service_role;


--
-- Name: SEQUENCE patient_registration_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.patient_registration_seq TO anon;
GRANT ALL ON SEQUENCE public.patient_registration_seq TO authenticated;
GRANT ALL ON SEQUENCE public.patient_registration_seq TO service_role;


--
-- Name: TABLE patients; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.patients TO authenticated;
GRANT ALL ON TABLE public.patients TO service_role;


--
-- Name: TABLE pluggy_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pluggy_items TO authenticated;
GRANT ALL ON TABLE public.pluggy_items TO service_role;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO authenticated;
GRANT ALL ON TABLE public.roles TO service_role;


--
-- Name: SEQUENCE roles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.roles_id_seq TO anon;
GRANT ALL ON SEQUENCE public.roles_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.roles_id_seq TO service_role;


--
-- Name: TABLE specialties; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.specialties TO authenticated;
GRANT ALL ON TABLE public.specialties TO service_role;


--
-- Name: TABLE sus_procedures; Type: ACL; Schema: public; Owner: postgres
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.sus_procedures TO anon;
GRANT ALL ON TABLE public.sus_procedures TO authenticated;
GRANT ALL ON TABLE public.sus_procedures TO service_role;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO authenticated;
GRANT ALL ON TABLE public.transactions TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.buckets TO service_role;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.buckets TO authenticated;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.buckets TO anon;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.objects TO service_role;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.objects TO authenticated;
RESET SESSION AUTHORIZATION;
SET SESSION AUTHORIZATION postgres;
GRANT ALL ON TABLE storage.objects TO anon;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;
RESET SESSION AUTHORIZATION;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;
SET SESSION AUTHORIZATION postgres;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;
RESET SESSION AUTHORIZATION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

