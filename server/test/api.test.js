process.env.NODE_ENV = 'test';

const assert = require('assert');
const app = require('../src/index');
const http = require('http');

const PORT = 3999;
const server = http.createServer(app);

async function run() {
  await new Promise(resolve => server.listen(PORT, resolve));

  const baseUrl = `http://localhost:${PORT}/api`;

  try {
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'online');

    const teacherLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'professora@kodic.edu', password: 'senha123' })
    });
    const teacherAuth = await teacherLoginRes.json();
    assert.strictEqual(teacherAuth.user.role, 'teacher');
    assert.ok(teacherAuth.token);

    const studentLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex@kodic.edu', password: 'senha123' })
    });
    const studentAuth = await studentLoginRes.json();
    assert.strictEqual(studentAuth.user.role, 'student');
    assert.strictEqual(studentAuth.user.is_leader, 1);
    assert.ok(studentAuth.token);

    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${studentAuth.token}` }
    });
    const meData = await meRes.json();
    assert.strictEqual(meData.user.name, 'Alex Silva');

    const classRes = await fetch(`${baseUrl}/classes/current`, {
      headers: { Authorization: `Bearer ${studentAuth.token}` }
    });
    const classData = await classRes.json();
    assert.strictEqual(classData.class.code, 'GEO-2026');
    const initialClassPoints = classData.class.current_points;

    const groupRes = await fetch(`${baseUrl}/groups/shared`, {
      headers: { Authorization: `Bearer ${studentAuth.token}` }
    });
    const groupData = await groupRes.json();
    assert.strictEqual(groupData.group.members.length, 4);

    const rotateRes = await fetch(`${baseUrl}/groups/rotate-device`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentAuth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId: groupData.group.id })
    });
    const rotateData = await rotateRes.json();
    assert.strictEqual(rotateData.success, true);
    assert.ok(rotateData.currentDeviceHolderId);

    const quizzesRes = await fetch(`${baseUrl}/quizzes`, {
      headers: { Authorization: `Bearer ${studentAuth.token}` }
    });
    const quizzesData = await quizzesRes.json();
    assert.ok(quizzesData.quizzes.length > 0);
    const firstQuiz = quizzesData.quizzes[0];

    const submitRes = await fetch(`${baseUrl}/quizzes/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentAuth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quizId: firstQuiz.id, selectedIndex: firstQuiz.correctIndex })
    });
    const submitData = await submitRes.json();
    assert.strictEqual(submitData.isCorrect, true);
    assert.strictEqual(submitData.fairSyncMembersCount, 4);
    assert.strictEqual(submitData.classCurrentPoints, initialClassPoints + (firstQuiz.pointsReward * 4));

    const forbiddenRes = await fetch(`${baseUrl}/content/announcements`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentAuth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Aviso Aluno', desc: 'Não permitido' })
    });
    assert.strictEqual(forbiddenRes.status, 403);

    const aiGenRes = await fetch(`${baseUrl}/quizzes/generate-ai`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${teacherAuth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bnccCode: 'EM13CHS202' })
    });
    const aiGenData = await aiGenRes.json();
    assert.strictEqual(aiGenData.quiz.bnccCode, 'EM13CHS202');
    assert.ok(aiGenData.quiz.auditTrail.isOfficialMecStandard);

    const impactRes = await fetch(`${baseUrl}/content/impact`, {
      headers: { Authorization: `Bearer ${studentAuth.token}` }
    });
    const impactData = await impactRes.json();
    assert.ok(impactData.notifications.length > 0);
    assert.strictEqual(impactData.summary.privateOnly, true);

    const privacyRes = await fetch(`${baseUrl}/auth/privacy-policy`);
    const privacyData = await privacyRes.json();
    assert.strictEqual(privacyData.compliance, 'LGPD & Privacy by Design');

    console.log('All backend integration tests passed successfully!');
  } finally {
    server.close();
  }
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
