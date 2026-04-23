drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email, username)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.email, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();