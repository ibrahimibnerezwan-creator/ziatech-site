import { createSession, deleteSession, checkAdminPassword } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { errorResponse, InputError } from '@/lib/validation';
export async function POST(request: Request) {
  try {
    await rateLimit('admin-login');
    const { password, username } = await request.json();
    if ((username && username !== process.env.ADMIN_USER) || !(await checkAdminPassword(password))) throw new InputError('Incorrect credentials', 401);
    await createSession('admin-platform', 'Administrator', 'admin');
    return Response.json({ success: true });
  } catch (error) { return errorResponse(error, 'Admin login is unavailable. Please contact the store owner.'); }
}
export async function DELETE() {
  await deleteSession();
  return Response.json({ success: true });
}
