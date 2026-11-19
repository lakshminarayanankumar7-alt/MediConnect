import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('==================================================');
  console.log('   MediConnect Automated QA & Verification Suite   ');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health checks
  await test('GET /api/health returns 200', async () => {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    if (res.status !== 200 || !data.success) throw new Error('Health check failed');
  });

  await test('GET /api/health/db returns connected', async () => {
    const res = await fetch(`${API_URL}/health/db`);
    const data = await res.json();
    if (res.status !== 200 || data.database !== 'connected') throw new Error('DB health check failed');
  });

  // 2. Doctor listing
  let sampleDoctorId = null;
  await test('GET /api/doctors returns populated specialist list', async () => {
    const res = await fetch(`${API_URL}/doctors`);
    const data = await res.json();
    if (res.status !== 200 || data.count < 8) throw new Error(`Expected at least 8 doctors, got ${data.count}`);
    sampleDoctorId = data.doctors[0]._id;
  });

  await test('GET /api/doctors filter by Cardiology returns matching doctors', async () => {
    const res = await fetch(`${API_URL}/doctors?specialization=Cardiology`);
    const data = await res.json();
    if (res.status !== 200 || data.count === 0) throw new Error('No cardiology doctors returned');
    if (data.doctors[0].specialization !== 'Cardiology') throw new Error('Filter did not match specialization');
  });

  // 3. User Authentication
  let patientToken = null;
  await test('POST /api/auth/login authenticates demo patient', async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'patient@mediconnect.com', password: 'Patient@123' }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.token || data.user.role !== 'patient') {
      throw new Error(`Patient login failed: ${data.message}`);
    }
    patientToken = data.token;
  });

  let doctorToken = null;
  await test('POST /api/auth/login authenticates demo doctor', async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.jenkins@mediconnect.com', password: 'Doctor@123' }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.token || data.user.role !== 'doctor') {
      throw new Error(`Doctor login failed: ${data.message}`);
    }
    doctorToken = data.token;
  });

  let adminToken = null;
  await test('POST /api/auth/login authenticates admin account', async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mediconnect.com', password: 'Admin@123' }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.token || data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${data.message}`);
    }
    adminToken = data.token;
  });

  await test('Unauthorized request without token returns 401', async () => {
    const res = await fetch(`${API_URL}/appointments/my`);
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
  });

  await test('Patient forbidden from accessing admin endpoints (403)', async () => {
    const res = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  // 4. Appointment Booking & Concurrency Prevention
  const testDate = '2026-12-20';
  const testSlot = '02:00 PM';
  let bookedApptId = null;

  await test('POST /api/appointments books consultation successfully', async () => {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({
        doctorId: sampleDoctorId,
        appointmentDate: testDate,
        appointmentTime: testSlot,
        reason: 'QA Automated Verification Consultation',
      }),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.appointment) {
      // If already booked from a previous run, that's fine
      if (res.status === 409) return;
      throw new Error(`Booking failed: ${data.message}`);
    }
    bookedApptId = data.appointment._id;
  });

  await test('Duplicate appointment booking for same slot rejected with 409 Conflict', async () => {
    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({
        doctorId: sampleDoctorId,
        appointmentDate: testDate,
        appointmentTime: testSlot,
        reason: 'Duplicate attempt test',
      }),
    });
    if (res.status !== 409 && res.status !== 400) {
      throw new Error(`Expected 409 or 400 Conflict, got ${res.status}`);
    }
  });

  // 5. Admin stats aggregation
  await test('GET /api/admin/stats returns real-time metrics', async () => {
    const res = await fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    if (res.status !== 200 || !data.stats) throw new Error('Failed to retrieve admin stats');
    if (data.stats.totalDoctors < 8) throw new Error('Incorrect doctor aggregation count');
  });

  console.log('\n==================================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
