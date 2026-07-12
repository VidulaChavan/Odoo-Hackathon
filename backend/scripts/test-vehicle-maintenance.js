require('dotenv').config();
const jwt = require('jsonwebtoken');

const BASE = 'http://localhost:5000/api';

function assert(name, condition, detail) {
  if (condition) {
    console.log(`PASS ${name}: ${detail}`);
    return;
  }
  throw new Error(`FAIL ${name}: ${detail}`);
}

async function request(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { status: res.status, data };
}

async function run() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env');
  }

  const token = jwt.sign(
    { userId: 1, email: 'test@example.com' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  console.log('=== 1. Vehicles: create ===');
  const createRes = await request('POST', '/vehicles', {
    token,
    body: {
      registrationNumber: 'TEST-9999',
      name: 'Test Delivery Van',
      type: 'VAN',
      maxLoadCapacity: 1500,
      odometer: 45000,
      acquisitionCost: 35000,
    },
  });
  assert('create', createRes.status === 201, `status=${createRes.status}`);
  const vehicle = createRes.data;

  console.log('\n=== 2. Vehicles: list ===');
  const listRes = await request('GET', '/vehicles', { token });
  assert('list', listRes.status === 200 && listRes.data.length >= 1, `count=${listRes.data.length}`);

  console.log('\n=== 3. Vehicles: get by id ===');
  const getRes = await request('GET', `/vehicles/${vehicle.id}`, { token });
  assert('get', getRes.status === 200 && getRes.data.registrationNumber === 'TEST-9999', `logs=${getRes.data.maintenanceLogs.length}`);

  console.log('\n=== 4. Maintenance: create ACTIVE -> IN_SHOP ===');
  const maintCreateRes = await request('POST', `/vehicles/${vehicle.id}/maintenance`, {
    token,
    body: {
      serviceType: 'Oil Change',
      cost: 150,
      date: '2026-07-12',
      notes: 'Routine service',
    },
  });
  assert('maintenance-create', maintCreateRes.status === 201, `status=${maintCreateRes.status}`);
  const maintenance = maintCreateRes.data;

  const afterMaintRes = await request('GET', `/vehicles/${vehicle.id}`, { token });
  assert('vehicle-in-shop', afterMaintRes.data.status === 'IN_SHOP', `vehicle status=${afterMaintRes.data.status}`);

  console.log('\n=== 5. Maintenance: list ===');
  const maintListRes = await request('GET', `/vehicles/${vehicle.id}/maintenance`, { token });
  assert('maintenance-list', maintListRes.status === 200 && maintListRes.data.length === 1, `count=${maintListRes.data.length}`);

  console.log('\n=== 6. Maintenance: get by id ===');
  const maintGetRes = await request('GET', `/vehicles/${vehicle.id}/maintenance/${maintenance.id}`, { token });
  assert('maintenance-get', maintGetRes.status === 200 && maintGetRes.data.serviceType === 'Oil Change', `id=${maintGetRes.data.id}`);

  console.log('\n=== 7. Maintenance: complete -> AVAILABLE ===');
  const completeRes = await request('PATCH', `/vehicles/${vehicle.id}/maintenance/${maintenance.id}`, {
    token,
    body: { status: 'COMPLETED' },
  });
  assert('maintenance-complete', completeRes.status === 200, `status=${completeRes.status}`);

  const afterCompleteRes = await request('GET', `/vehicles/${vehicle.id}`, { token });
  assert('vehicle-available', afterCompleteRes.data.status === 'AVAILABLE', `vehicle status=${afterCompleteRes.data.status}`);

  console.log('\n=== 8. Vehicles: update ===');
  const updateRes = await request('PATCH', `/vehicles/${vehicle.id}`, {
    token,
    body: { odometer: 46000 },
  });
  assert('update', updateRes.status === 200 && updateRes.data.odometer === 46000, `odometer=${updateRes.data.odometer}`);

  console.log('\n=== 9. Duplicate registration rejected ===');
  const dupRes = await request('POST', '/vehicles', {
    token,
    body: {
      registrationNumber: 'TEST-9999',
      name: 'Duplicate Van',
      type: 'VAN',
      maxLoadCapacity: 1500,
      odometer: 45000,
      acquisitionCost: 35000,
    },
  });
  assert('duplicate-registration', dupRes.status === 400, `status=${dupRes.status}`);

  console.log('\n=== 10. Validation rejected ===');
  const badRes = await request('POST', '/vehicles', {
    token,
    body: {
      registrationNumber: '',
      name: 'x',
      type: 'VAN',
      maxLoadCapacity: 1,
      odometer: 0,
      acquisitionCost: 0,
    },
  });
  assert('validation', badRes.status === 400, `status=${badRes.status}`);

  console.log('\n=== 11. Auth blocked without token ===');
  const noAuthRes = await request('GET', '/vehicles');
  assert('auth', noAuthRes.status === 401, `status=${noAuthRes.status}`);

  console.log('\n=== 12. Cleanup ===');
  const deleteMaintRes = await request('DELETE', `/vehicles/${vehicle.id}/maintenance/${maintenance.id}`, { token });
  assert('delete-maintenance', deleteMaintRes.status === 200, `status=${deleteMaintRes.status}`);

  const deleteVehicleRes = await request('DELETE', `/vehicles/${vehicle.id}`, { token });
  assert('delete-vehicle', deleteVehicleRes.status === 200, `status=${deleteVehicleRes.status}`);

  console.log('\nALL VEHICLE/MAINTENANCE TESTS PASSED');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
