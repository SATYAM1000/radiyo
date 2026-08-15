-- Atomic visit counter, callable by anon, only for published sites.
create or replace function public.increment_visits(p_slug citext)
returns bigint language plpgsql security definer set search_path = public as $$
declare v bigint;
begin
  update site_stats s
     set visit_count = s.visit_count + 1
    from sites st
   where st.id = s.site_id
     and st.slug = p_slug
     and st.is_published
  returning s.visit_count into v;
  return coalesce(v, 0);
end $$;

grant execute on function public.increment_visits(citext) to anon, authenticated;
