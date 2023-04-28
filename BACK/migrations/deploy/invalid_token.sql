-- Deploy 3db:invalid_token to pg

BEGIN;

CREATE TABLE IF NOT EXISTS "invalid_token" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "token" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION "invalid_token_delete" (id INT)
 RETURNS VOID AS $$
  BEGIN
  DELETE FROM "invalid_token" WHERE "id" = id;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "invalid_token_delete_trigger"
  AFTER INSERT ON "invalid_token"
  FOR EACH ROW
  WHEN (NEW.expires_at < NOW())
  EXECUTE PROCEDURE "invalid_token_delete"(NEW.id);

COMMIT;
