-- EDT Lesson Tracker — Initial Schema

-- Students table
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  adi_id uuid references auth.users not null,
  name text not null,
  dob date,
  driver_number text,
  logbook_number text,
  created_at timestamptz default now()
);

-- Lessons table
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade not null,
  lesson_number int not null check (lesson_number between 1 and 12),
  completed boolean not null default false,
  completion_date date,
  uploaded_to_rsa boolean not null default false,
  notes text,
  updated_at timestamptz default now(),
  unique(student_id, lesson_number)
);

-- RLS: Students — each ADI sees only their own students
alter table students enable row level security;

create policy "ADI sees own students"
  on students for all
  using (adi_id = auth.uid())
  with check (adi_id = auth.uid());

-- RLS: Lessons — scoped through student ownership
alter table lessons enable row level security;

create policy "ADI sees own lessons"
  on lessons for all
  using (
    student_id in (
      select id from students where adi_id = auth.uid()
    )
  )
  with check (
    student_id in (
      select id from students where adi_id = auth.uid()
    )
  );

-- Auto-update updated_at on lessons
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger lessons_updated_at
  before update on lessons
  for each row execute procedure update_updated_at();
