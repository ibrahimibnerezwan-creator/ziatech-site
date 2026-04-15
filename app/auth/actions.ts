"use server"

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, verifyPassword, createSession, deleteSession } from '@/lib/auth'

export async function registerAction(data: FormData) {
    const name = data.get('name') as string
    const email = data.get('email') as string
    const phone = data.get('phone') as string
    const password = data.get('password') as string

    if (!name || !email || !phone || !password) {
        return { error: 'All fields are required' }
    }

    try {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser) {
            return { error: 'User with this email already exists' }
        }

        const hashedPassword = await hashPassword(password)
        const newUserId = crypto.randomUUID()

        await db.insert(users).values({
            id: newUserId,
            name,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date(),
        })

        // Log the user in immediately
        await createSession(newUserId, name, 'customer')

        return { success: true }
    } catch (error) {
        console.error('Registration error:', error)
        return { error: 'An unexpected error occurred' }
    }
}

export async function loginAction(data: FormData) {
    const email = data.get('email') as string
    const password = data.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    try {
        let user = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        
        // ADMIN FALLBACK for Prism Forge
        if (!user && email === process.env.ADMIN_USER) {
            if (password === process.env.ADMIN_PASSWORD) {
                await createSession('admin-platform', 'Administrator', 'admin');
                return { success: true, role: 'admin' };
            }
        }

        if (!user) {
            return { error: 'Invalid credentials' }
        }

        const isValid = await verifyPassword(password, user.password)

        if (!isValid) {
            return { error: 'Invalid credentials' }
        }

        // Create session
        await createSession(user.id, user.name, user.role)

        return { success: true, role: user.role }
    } catch (error) {
        console.error('Login error:', error)
        return { error: 'An unexpected error occurred' }
    }
}

export async function logoutAction() {
    await deleteSession()
    return { success: true }
}
