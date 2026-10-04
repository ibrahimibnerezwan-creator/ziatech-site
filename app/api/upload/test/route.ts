import { isAuthenticatedAdmin } from '@/lib/auth';
import { testR2Connection } from '@/lib/r2';
export async function GET() {
 if (!(await isAuthenticatedAdmin())) return Response.json({error:'Unauthorized'},{status:401});
 return Response.json(await testR2Connection());
}
