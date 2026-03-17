-- Make attempt_date optional (year-only entry is now supported in the UI)
ALTER TABLE test_attempts ALTER COLUMN attempt_date DROP NOT NULL;
