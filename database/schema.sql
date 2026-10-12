CREATE TABLE IF NOT EXISTS tickets (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL CHECK (length(btrim(title)) > 0),
  description text,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed')),
  priority text NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz NOT NULL DEFAULT now()
);
