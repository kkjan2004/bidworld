BIDWORLD MULTI-PAGE WEBSITE — SOURCE PACKAGE

Included:
- 13 HTML pages: public home/login/register, member dashboard, admin dashboard,
  packages, payments & activation, products, auctions, bidding, winners,
  wallet, referrals, reports, settings.
- shared.js: Supabase login/session, role-based navigation, page data loading and actions.
- style.css: shared responsive white/green design.
- manifest.webmanifest, service-worker.js and 192/512 icons for installable PWA shell.

IMPORTANT DEPLOYMENT:
1. Extract this ZIP on your phone or computer.
2. Open the existing GitHub repository: kkjan2004/bidworld.
3. Upload the CONTENTS of the extracted folder into the repository ROOT (not the ZIP file itself).
4. Keep a backup of the current live index.html and other files before replacing.
5. Commit the uploaded files together.
6. GitHub Pages should publish from main branch / root.
7. Open https://kkjan2004.github.io/bidworld/ and test with test accounts first.

SUPABASE:
- This package reuses the Supabase project URL and public publishable key already present
  in the index.html supplied for this task.
- It uses the same table and RPC names that the supplied index.html uses.
- No database migration is included or required by this front-end package.
- Never put a Supabase service_role or secret key in browser code.

TESTING STATUS:
- shared.js passed Node.js syntax validation.
- HTML references and package file presence were checked.
- This package has NOT been deployed to GitHub and has NOT been end-to-end tested
  against the live Supabase project. Test all pages and permissions before real use.
- Keep the existing ₹2,500 test activation request pending; do not approve it as a real payment.

LIMITATIONS / NEXT DEVELOPMENT:
- Reports are basic counts, not accounting statements.
- Account identity changes are not editable from Settings.
- Existing database RLS and RPC security remain essential. Front-end role hiding is
  only navigation/UI behavior and is not a substitute for database authorization.
- Supabase-dependent actions require an internet connection.
