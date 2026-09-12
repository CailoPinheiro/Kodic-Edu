import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runTests() {
  console.log('Testing Next.js Fullstack API at:', BASE_URL);

  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200);
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'online');
  assert.strictEqual(healthData.framework, 'Next.js App Router');
  console.log('✓ Health check passed');

  const studentLoginRes = await fetch(`${BASE_URL}/api/auth/quick-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'student' })
  });
  assert.strictEqual(studentLoginRes.status, 200);
  const studentData = await studentLoginRes.json();
  assert.ok(studentData.token);
  assert.strictEqual(studentData.user.role, 'student');
  const studentToken = studentData.token;
  console.log('✓ Student quick-login passed');

  const teacherLoginRes = await fetch(`${BASE_URL}/api/auth/quick-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'teacher' })
  });
  assert.strictEqual(teacherLoginRes.status, 200);
  const teacherData = await teacherLoginRes.json();
  assert.ok(teacherData.token);
  assert.strictEqual(teacherData.user.role, 'teacher');
  const teacherToken = teacherData.token;
  console.log('✓ Teacher quick-login passed');

  const studentHeaders = { Authorization: `Bearer ${studentToken}` };
  const teacherHeaders = { Authorization: `Bearer ${teacherToken}` };

  const classRes = await fetch(`${BASE_URL}/api/classes/current`, { headers: studentHeaders });
  assert.strictEqual(classRes.status, 200);
  const classData = await classRes.json();
  assert.ok(classData.class);
  assert.strictEqual(classData.class.code, 'GEO-2026');
  console.log('✓ Current class fetched');

  const sharedGroupRes = await fetch(`${BASE_URL}/api/groups/shared`, { headers: studentHeaders });
  assert.strictEqual(sharedGroupRes.status, 200);
  const sharedGroupData = await sharedGroupRes.json();
  assert.ok(sharedGroupData.group);
  assert.strictEqual(sharedGroupData.group.members.length, 4);
  console.log('✓ 4-in-1 shared group fetched');

  const rotateRes = await fetch(`${BASE_URL}/api/groups/rotate-device`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId: sharedGroupData.group.id })
  });
  assert.strictEqual(rotateRes.status, 200);
  const rotateData = await rotateRes.json();
  assert.ok(rotateData.currentDeviceHolderName);
  console.log('✓ Rotate device passed');

  const quizzesRes = await fetch(`${BASE_URL}/api/quizzes`, { headers: studentHeaders });
  assert.strictEqual(quizzesRes.status, 200);
  const quizzesData = await quizzesRes.json();
  assert.ok(quizzesData.quizzes.length > 0);
  const quiz = quizzesData.quizzes[0];
  console.log('✓ Quizzes fetched');

  const submitRes = await fetch(`${BASE_URL}/api/quizzes/submit`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId: quiz.id, optionIndex: 0 })
  });
  assert.strictEqual(submitRes.status, 200);
  const submitData = await submitRes.json();
  assert.strictEqual(submitData.isCorrect, true);
  assert.strictEqual(submitData.fairSyncMembersCount, 4);
  console.log('✓ Quiz submit with Fair Sync passed');

  const aiRes = await fetch(`${BASE_URL}/api/quizzes/generate-ai`, {
    method: 'POST',
    headers: { ...teacherHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bnccCode: 'EM13CHS202' })
  });
  assert.strictEqual(aiRes.status, 200);
  const aiData = await aiRes.json();
  assert.ok(aiData.quiz);
  assert.strictEqual(aiData.quiz.bnccCode, 'EM13CHS202');
  console.log('✓ AI Quiz generator passed');

  const heatmapRes = await fetch(`${BASE_URL}/api/content/heatmap`, { headers: teacherHeaders });
  assert.strictEqual(heatmapRes.status, 200);
  const heatmapData = await heatmapRes.json();
  assert.ok(heatmapData.heatmap.length > 0);
  console.log('✓ Learning analytics heatmap passed');

  const impactRes = await fetch(`${BASE_URL}/api/content/impact`, { headers: studentHeaders });
  assert.strictEqual(impactRes.status, 200);
  const impactData = await impactRes.json();
  assert.ok(impactData.notifications.length > 0);
  console.log('✓ Private impact notifications passed');

  console.log('\nALL 10 TEST SUITES PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
