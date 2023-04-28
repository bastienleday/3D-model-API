-- Revert 3db:invalid_token from pg

BEGIN;



DROP TRIGGER IF EXISTS "invalid_token_delete_trigger" ON "invalid_token";

DROP FUNCTION IF EXISTS "invalid_token_delete";

DROP TABLE IF EXISTS "invalid_token";




COMMIT;
