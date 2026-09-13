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
  console.log('✓ Shared device group fetched (4 members)');

  const overflowRes = await fetch(`${BASE_URL}/api/groups/members`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: sharedGroupData.group.id,
      name: 'Aluno Excedente',
      role: 'Curador'
    })
  });
  assert.strictEqual(overflowRes.status, 400);
  console.log('✓ Max 4 students limit enforced on add');

  const memberToLeave = sharedGroupData.group.members[3];
  const removeRes = await fetch(`${BASE_URL}/api/groups/members?groupId=${sharedGroupData.group.id}&userId=${memberToLeave.userId}`, {
    method: 'DELETE',
    headers: studentHeaders
  });
  assert.strictEqual(removeRes.status, 200);
  console.log('✓ Member left table to make space');

  const addMemberRes = await fetch(`${BASE_URL}/api/groups/members`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: sharedGroupData.group.id,
      name: 'Aluno Teste Dinamico',
      role: 'Revisor'
    })
  });
  assert.strictEqual(addMemberRes.status, 201);
  const addMemberData = await addMemberRes.json();
  assert.ok(addMemberData.member.userId);
  console.log('✓ Dynamic member enter shared group passed');

  const handoffRes = await fetch(`${BASE_URL}/api/groups/rotate-device`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: sharedGroupData.group.id,
      targetUserId: addMemberData.member.userId
    })
  });
  assert.strictEqual(handoffRes.status, 200);
  const handoffData = await handoffRes.json();
  assert.strictEqual(handoffData.currentDeviceHolderId, addMemberData.member.userId);
  console.log('✓ Direct device handoff passed');

  const cleanRemoveRes = await fetch(`${BASE_URL}/api/groups/members?groupId=${sharedGroupData.group.id}&userId=${addMemberData.member.userId}`, {
    method: 'DELETE',
    headers: studentHeaders
  });
  assert.strictEqual(cleanRemoveRes.status, 200);

  await fetch(`${BASE_URL}/api/groups/members`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: sharedGroupData.group.id,
      userId: memberToLeave.userId,
      role: memberToLeave.role
    })
  });
  console.log('✓ Dynamic member leave shared group passed');

  const rotateRes = await fetch(`${BASE_URL}/api/groups/rotate-device`, {
    method: 'POST',
    headers: { ...studentHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId: sharedGroupData.group.id })
  });
  assert.strictEqual(rotateRes.status, 200);
  const rotateData = await rotateRes.json();
  assert.ok(rotateData.currentDeviceHolderName);
  console.log('✓ Rotate device passed');

  const teacherGroupsRes = await fetch(`${BASE_URL}/api/groups?classId=${classData.class.id}`, { headers: teacherHeaders });
  assert.strictEqual(teacherGroupsRes.status, 200);
  const teacherGroupsData = await teacherGroupsRes.json();
  assert.ok(Array.isArray(teacherGroupsData.groups));
  assert.ok(teacherGroupsData.totalGroups >= 1);
  assert.ok(Array.isArray(teacherGroupsData.enrolledStudents));
  console.log('✓ Teacher view of groups and roster passed');

  const createGroupRes = await fetch(`${BASE_URL}/api/groups`, {
    method: 'POST',
    headers: { ...teacherHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classId: classData.class.id,
      name: 'Mesa 3 - Teste Automatizado Docente',
      groupType: 'Oficial da Disciplina',
      objective: 'Validação de criação dinâmica de grupo pelo professor',
      memberIds: [2, 3]
    })
  });
  assert.strictEqual(createGroupRes.status, 201);
  const createGroupData = await createGroupRes.json();
  assert.strictEqual(createGroupData.group.name, 'Mesa 3 - Teste Automatizado Docente');
  assert.strictEqual(createGroupData.group.members.length, 2);
  const createdTestGroupId = createGroupData.group.id;
  console.log('✓ Teacher create group on the fly passed');

  const editGroupRes = await fetch(`${BASE_URL}/api/groups`, {
    method: 'PATCH',
    headers: { ...teacherHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: createdTestGroupId,
      name: 'Mesa 3 - Nome Alterado na Hora',
      objective: 'Objetivo pedagógico alterado na hora'
    })
  });
  assert.strictEqual(editGroupRes.status, 200);
  const editGroupData = await editGroupRes.json();
  assert.strictEqual(editGroupData.group.name, 'Mesa 3 - Nome Alterado na Hora');
  console.log('✓ Teacher alter group on the fly passed');

  const addStudentToTestGroupRes = await fetch(`${BASE_URL}/api/groups/members`, {
    method: 'POST',
    headers: { ...teacherHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: createdTestGroupId,
      userId: 4,
      role: 'Revisor'
    })
  });
  assert.strictEqual(addStudentToTestGroupRes.status, 201);
  console.log('✓ Teacher add student to group on the fly passed');

  const deleteTestGroupRes = await fetch(`${BASE_URL}/api/groups?groupId=${createdTestGroupId}`, {
    method: 'DELETE',
    headers: teacherHeaders
  });
  assert.strictEqual(deleteTestGroupRes.status, 200);
  console.log('✓ Teacher delete group on the fly passed');

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

  const membersRes = await fetch(`${BASE_URL}/api/classes/members?classId=${classData.class.id}`, { headers: teacherHeaders });
  assert.strictEqual(membersRes.status, 200);
  const membersData = await membersRes.json();
  assert.ok(Array.isArray(membersData.teachers));
  assert.ok(membersData.teachers.length >= 1);
  assert.ok(Array.isArray(membersData.students));
  assert.ok(membersData.students.length >= 1);
  console.log('✓ Class teachers and students association passed');

  assert.ok(heatmapData.heatmap[0].total_submissions !== undefined);
  assert.ok(heatmapData.heatmap[0].mastery_percentage !== undefined);
  console.log('✓ Real heatmap metrics verified');

  const annUpdateRes = await fetch(`${BASE_URL}/api/content/announcements`, {
    method: 'PUT',
    headers: { ...teacherHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Comunicado Oficial Atualizado',
      desc: 'Novo aviso pedagógico exibido em tempo real para todos os alunos.'
    })
  });
  assert.strictEqual(annUpdateRes.status, 200);
  const annUpdateData = await annUpdateRes.json();
  assert.strictEqual(annUpdateData.announcement.title, 'Comunicado Oficial Atualizado');
  console.log('✓ Announcement live update passed');

  console.log('\nALL 12 TEST SUITES PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
