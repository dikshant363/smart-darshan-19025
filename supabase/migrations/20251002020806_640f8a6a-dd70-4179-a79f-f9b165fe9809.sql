-- Enable RLS on all user tables in public schema
-- Skips PostGIS system views which are read-only metadata

DO $$
DECLARE
    tbl record;
BEGIN
    -- Enable RLS on all tables except PostGIS system views
    FOR tbl IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('geography_columns', 'geometry_columns', 'spatial_ref_sys')
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', tbl.schemaname, tbl.tablename);
            RAISE NOTICE 'Enabled RLS on %.%', tbl.schemaname, tbl.tablename;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not enable RLS on %.%: %', tbl.schemaname, tbl.tablename, SQLERRM;
        END;
    END LOOP;
END $$;