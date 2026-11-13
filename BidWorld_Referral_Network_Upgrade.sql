-- BidWorld Referral Network Upgrade (safe, additive migration)
-- Run in Supabase SQL Editor. Does not change existing balances or memberships.
begin;

-- Member-safe recursive genealogy: exposes only member ID, display name and join status.
create or replace function public.get_my_referral_tree()
returns table (
  level_no integer,
  member_id text,
  full_name text,
  joined_at timestamptz,
  status text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  return query
  with recursive tree as (
    select r.referred_member_id as member_uuid,
           1 as depth,
           r.joined_at,
           r.status,
           array[auth.uid(), r.referred_member_id]::uuid[] as visited
      from public.referrals r
     where r.sponsor_id = auth.uid()
    union all
    select child.referred_member_id,
           parent.depth + 1,
           child.joined_at,
           child.status,
           parent.visited || child.referred_member_id
      from tree parent
      join public.referrals child
        on child.sponsor_id = parent.member_uuid
     where parent.depth < 20
       and not child.referred_member_id = any(parent.visited)
  )
  select tree.depth,
         p.member_id,
         p.full_name,
         tree.joined_at,
         tree.status
    from tree
    join public.profiles p on p.id = tree.member_uuid
   order by tree.depth, tree.joined_at;
end;
$$;

revoke all on function public.get_my_referral_tree() from public, anon;
grant execute on function public.get_my_referral_tree() to authenticated;

-- Ensure the existing referral-plan and matrix-plan tables are selectable by admins
-- through their existing admin-only RLS policies.
grant select, insert, update on public.referral_plans, public.matrix_plans to authenticated;

-- Existing package plan foreign keys are already part of the foundation schema.
-- Keep the commission wallet ledger read-only from the browser.
grant select on public.wallet_transactions to authenticated;

commit;

-- Verification: returns the current member's tree only.
select * from public.get_my_referral_tree();
