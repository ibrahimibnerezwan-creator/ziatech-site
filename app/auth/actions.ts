"use server"
import {db} from '@/db';
import {users} from '@/db/schema';
import {eq,sql} from 'drizzle-orm';
import {hashPassword,verifyPassword,createSession,deleteSession,checkAdminPassword} from '@/lib/auth';
import {InputError,textValue,validPhone} from '@/lib/validation';
import {rateLimit} from '@/lib/rate-limit';
import {revalidatePath} from 'next/cache';
export async function registerAction(data:FormData) {
 try {
  await rateLimit('register',5,15);
  const name=textValue(data.get('name'),'name',120);
  const email=textValue(data.get('email'),'email',254).toLowerCase();
  const phone=validPhone(data.get('phone'));
  const password=textValue(data.get('password'),'password',72);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8) throw new InputError('Use a valid email and a password of at least 8 characters.');
  if(await db.query.users.findFirst({where:sql`lower(${users.email}) = ${email}`})) throw new InputError('This email is already registered. Please sign in.');
  const id=crypto.randomUUID();
  await db.insert(users).values({id,name,email,phone,password:await hashPassword(password),role:'customer',createdAt:new Date()});
  await createSession(id,name,'customer');revalidatePath('/','layout');
  return {success:true};
 }catch(e){return {error:e instanceof InputError?e.message:'Unable to register. Please try again.'};}
}
export async function loginAction(data:FormData) {
 try{
  await rateLimit('login');
  const email=textValue(data.get('email'),'email',254).toLowerCase();
  const password=textValue(data.get('password'),'password',200);
  if(process.env.ADMIN_USER && email===process.env.ADMIN_USER.toLowerCase() && await checkAdminPassword(password)) {
    await createSession('admin-platform','Administrator','admin');revalidatePath('/','layout');return {success:true,role:'admin'};
  }
  const user=await db.query.users.findFirst({where:sql`lower(${users.email}) = ${email}`});
  if(!user||!(await verifyPassword(password,user.password))) throw new InputError('Invalid email or password.');
  await createSession(user.id,user.name,user.role);revalidatePath('/','layout');return {success:true,role:user.role};
 }catch(e){return {error:e instanceof InputError?e.message:'Unable to sign in. Please try again.'};}
}
export async function logoutAction(){await deleteSession();revalidatePath('/','layout');return {success:true};}
