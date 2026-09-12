process.env.PORT = '3998';
process.env.NODE_ENV = 'production';

const assert = require('assert');
const app = require('../src/index');

async function run() {
  const baseUrl = 'http://localhost:3998';

  try {
    const htmlRes = await fetch(`${baseUrl}/`);
    assert.strictEqual(htmlRes.status, 200);
    const htmlText = await htmlRes.text();
    assert.ok(htmlText.includes('Kodic Edu'));
    assert.ok(htmlText.includes('/assets/index-'));

    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'online');

    const demoTeacherRes = await fetch(`${baseUrl}/api/auth/quick-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'teacher' })
    });
    const demoTeacher = await demoTeacherRes.json();
    assert.strictEqual(demoTeacher.user.name, 'Profª. Cláudia Mendes');
    assert.strictEqual(demoTeacher.user.role, 'teacher');

    const demoStudentRes = await fetch(`${baseUrl}/api/auth/quick-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'student' })
    });
    const demoStudent = await demoStudentRes.json();
    assert.strictEqual(demoStudent.user.name, 'Alex Silva');
    assert.strictEqual(demoStudent.user.intelligence_role, 'Curador');

    console.log('Production end-to-end and static serving tests passed!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

setTimeout(run, 500);
