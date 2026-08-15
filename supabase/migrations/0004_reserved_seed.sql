insert into public.reserved_slugs (slug) values
  ('www'), ('app'), ('api'), ('admin'), ('auth'), ('mail'), ('smtp'),
  ('blog'), ('docs'), ('support'), ('help'), ('status'), ('dashboard'),
  ('editor'), ('dev'), ('staging'), ('test'), ('demo'), ('cdn'),
  ('assets'), ('static'), ('media'), ('vercel'), ('supabase'), ('root'),
  ('ns1'), ('ns2'), ('ftp'), ('my'), ('account'), ('login'), ('signup'),
  ('billing'), ('pricing'), ('about'), ('legal'), ('terms'), ('privacy')
on conflict do nothing;
