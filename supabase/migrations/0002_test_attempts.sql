-- Add student_type to students
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS student_type text NOT NULL DEFAULT 'full'
  CHECK (student_type IN ('full', 'transfer', 'pre_test', 'external'));

-- Add student-level notes
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS notes text;

-- Test attempts table
CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  attempt_number int NOT NULL,
  attempt_date date NOT NULL,
  result text NOT NULL CHECK (result IN ('pass', 'fail')),
  test_centre text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ADI sees own test attempts"
  ON test_attempts FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE adi_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM students WHERE adi_id = auth.uid()));
