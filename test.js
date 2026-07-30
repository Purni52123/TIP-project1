/* ============================================
   PLANORA — API Test Suite
   Run: node test.js
   ============================================ */

const http = require('http');

let passed = 0;
let failed = 0;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });

    req.on('error', reject);

    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS — ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL — ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🧪 PLANORA API Test Suite\n' + '='.repeat(40));

  // ── 1. Health Check ─────────────────────────────
  console.log('\n[1] GET /api/health');
  const health = await request('/api/health');
  assert('Status 200',           health.status === 200);
  assert('status: ok',           health.body.status === 'ok');
  assert('database: connected',  health.body.database === 'connected');
  assert('uptime is a number',   typeof health.body.uptime === 'number');

  // ── 2. Get All Places ────────────────────────────
  console.log('\n[2] GET /api/places');
  const all = await request('/api/places');
  assert('Status 200',           all.status === 200);
  assert('category = all',       all.body.category === 'all');
  assert('count = 12',           all.body.count === 12);
  assert('places is array',      Array.isArray(all.body.places));
  assert('first place has name', all.body.places[0]?.name === 'Living Root Bridge, Cherrapunji');

  // ── 3. Filter by Category ────────────────────────
  console.log('\n[3] GET /api/places?category=trekking');
  const trek = await request('/api/places?category=trekking');
  assert('Status 200',           trek.status === 200);
  assert('category = trekking',  trek.body.category === 'trekking');
  assert('count = 3',            trek.body.count === 3);
  assert('all are trekking',     trek.body.places.every(p => p.category === 'trekking'));

  console.log('\n[4] GET /api/places?category=food');
  const food = await request('/api/places?category=food');
  assert('Status 200',           food.status === 200);
  assert('count = 4',            food.body.count === 4);

  console.log('\n[5] GET /api/places?category=nature');
  const nature = await request('/api/places?category=nature');
  assert('Status 200',           nature.status === 200);
  assert('count = 2',            nature.body.count === 2);

  // ── 4. Single Place by ID ────────────────────────
  console.log('\n[6] GET /api/places/1');
  const place1 = await request('/api/places/1');
  assert('Status 200',           place1.status === 200);
  assert('id = 1',               place1.body.id === 1);
  assert('has name',             place1.body.name === 'Living Root Bridge, Cherrapunji');
  assert('has _id (from Mongo)', typeof place1.body._id === 'string');
  assert('has createdAt',        !!place1.body.createdAt);

  console.log('\n[7] GET /api/places/10 (Kaziranga)');
  const place10 = await request('/api/places/10');
  assert('Status 200',           place10.status === 200);
  assert('name matches',         place10.body.name === 'Kaziranga National Park');

  // ── 5. Invalid Category ──────────────────────────
  console.log('\n[8] GET /api/places?category=invalid');
  const badCat = await request('/api/places?category=invalid');
  assert('Status 400',           badCat.status === 400);
  assert('has error field',      !!badCat.body.error);
  assert('has validCategories',  Array.isArray(badCat.body.validCategories));

  // ── 6. Not Found Place ───────────────────────────
  console.log('\n[9] GET /api/places/999 (not found)');
  const notFound = await request('/api/places/999');
  assert('Status 404',           notFound.status === 404);
  assert('has error field',      !!notFound.body.error);

  // ── 7. Subscribe ─────────────────────────────────
  console.log('\n[10] POST /api/subscribe (valid email)');
  const sub = await request('/api/subscribe', {
    method: 'POST',
    body: { email: 'test_planora@example.com' }
  });
  assert('Status 200',           sub.status === 200);
  assert('success: true',        sub.body.success === true);
  assert('has message',          typeof sub.body.message === 'string');

  console.log('\n[11] POST /api/subscribe (duplicate email)');
  const dup = await request('/api/subscribe', {
    method: 'POST',
    body: { email: 'test_planora@example.com' }
  });
  assert('Status 409',           dup.status === 409);
  assert('success: false',       dup.body.success === false);

  console.log('\n[12] POST /api/subscribe (invalid email)');
  const bad = await request('/api/subscribe', {
    method: 'POST',
    body: { email: 'not-an-email' }
  });
  assert('Status 400',           bad.status === 400);
  assert('success: false',       bad.body.success === false);

  // ── 8. Health after subscribe ────────────────────
  console.log('\n[13] GET /api/health (subscribers count updated)');
  const health2 = await request('/api/health');
  assert('subscribers = 1',      health2.body.subscribers === 1);

  // ── Summary ──────────────────────────────────────
  console.log('\n' + '='.repeat(40));
  console.log(`🏁 Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('🎉 All tests passed! Backend is working perfectly.\n');
  } else {
    console.log('⚠️  Some tests failed. See above for details.\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('\n❌ Test runner crashed:', err.message);
  process.exit(1);
});
