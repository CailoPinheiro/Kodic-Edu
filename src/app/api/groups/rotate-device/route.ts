import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { groupId } = await request.json().catch(() => ({}));
  const targetGroupId = groupId || 1;

  const members = db.prepare('SELECT user_id FROM group_members WHERE group_id = ? ORDER BY id ASC').all(targetGroupId) as any[];

  if (members.length === 0) {
    return NextResponse.json({ error: 'Group members not found' }, { status: 404 });
  }

  const group = db.prepare('SELECT current_device_holder_id FROM groups WHERE id = ?').get(targetGroupId) as any;
  const currentIndex = members.findIndex((m) => m.user_id === group.current_device_holder_id);
  const nextIndex = (currentIndex + 1) % members.length;
  const nextHolderId = members[nextIndex].user_id;

  db.prepare('UPDATE groups SET current_device_holder_id = ? WHERE id = ?').run(nextHolderId, targetGroupId);
  const nextUser = db.prepare('SELECT id, name FROM users WHERE id = ?').get(nextHolderId) as any;

  return NextResponse.json({
    success: true,
    message: `Rodízio ativo: O celular agora está nas mãos de ${nextUser.name}!`,
    currentDeviceHolderId: nextHolderId,
    currentDeviceHolderName: nextUser.name
  });
}
