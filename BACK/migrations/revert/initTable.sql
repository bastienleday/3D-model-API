-- Revert 3db:initTable from pg

BEGIN;

DROP TABLE IF EXISTS "model_has_like", "model_has_category", "comment", "category", "model", "user", "authors", "jokes";

COMMIT;
