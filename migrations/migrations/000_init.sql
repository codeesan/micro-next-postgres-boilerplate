-- rambler up

CREATE OR REPLACE FUNCTION updated_at_trigger() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

create table users (
  id serial not null primary key,
  email varchar(500) not null unique,
  password char(60) not null,
  name varchar(500),
  is_admin bool default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

CREATE TRIGGER updated_at BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE PROCEDURE updated_at_trigger();

-- rambler down

drop table users;


DROP FUNCTION IF EXISTS updated_at_trigger();
