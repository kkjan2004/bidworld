const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'service-worker.js'), 'utf8');

test('uses a versioned app-specific cache and only removes its own older caches', () => {
  assert.match(source, /const CACHE_NAME = 'bidworld-shell-v\d+'/);
  assert.match(source, /const CACHE_PREFIX = 'bidworld-shell-'/);
  assert.match(source, /key\.startsWith\(CACHE_PREFIX\) && key !== CACHE_NAME/);
});

test('limits interception to same-origin GETs and known app-shell paths', () => {
  assert.match(source, /request\.method !== 'GET' \|\| url\.origin !== self\.location\.origin/);
  assert.match(source, /if \(!CORE_PATHS\.has\(url\.pathname\)\) return/);
});

test('caches successful responses only and handles navigation offline', () => {
  assert.ok((source.match(/if \(response\.ok\)/g) || []).length >= 2);
  assert.match(source, /request\.mode === 'navigate'/);
  assert.match(source, /caches\.match\(HOME_URL\)/);
});

test('includes all existing app pages in the core shell', () => {
  for (const page of [
    'index.html', 'dashboard.html', 'admin.html', 'packages.html', 'payments.html',
    'products.html', 'auctions.html', 'bidding.html', 'winners.html', 'wallet.html',
    'referrals.html', 'plans.html', 'reports.html', 'settings.html'
  ]) assert.ok(source.includes(`'./${page}'`), `${page} should be precached`);
});
