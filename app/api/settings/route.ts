import { publicSettings } from '@/lib/settings';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await publicSettings()); }
