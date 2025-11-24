import { ROLES } from '@/lib/constants';
import { z } from 'zod';

export const loginDto = z.object({
    contact: z.string({ error: 'contact must be of 10 digits' }).length(10),
    password: z.string({ error: 'password is required' }),
})

export const signupDto = z.object({
    firstName: z.string({ error: 'firstName must be string' })
        .nonempty({ error: 'firstName must be provided' }),

    lastName: z.string({ error: 'lastName must be string' })
        .optional(),

    email: z.email({ error: 'Invalid email' }).optional(),

    contact: z.string({ error: 'contact bust me of 10 digits' })
        .regex(/^[0-9]{10}$/, "Invalid phone number"),

    password: z.string({ error: "Password is required" })
        .nonempty()
        .min(8, { error: 'Password must be at least 8 characters long' }),

    role: z.enum([ROLES.EMPLOYEE, ROLES.GUARD, ROLES.ADMIN], { error: 'role bust be of type EMPLOYEE, GUARD and ADMIN' }),
})

export const updatePasswordDto = z.object({
    currentPassword: z.string({ error: 'currentPassword must be required' })
        .nonempty({ error: 'currentPassword must be required' })
        .nonoptional({ error: 'currentPassword must be required' }),
    newPassword: z.string({ error: 'currentPassword must be required' })
        .nonempty({ error: 'currentPassword must be required' })
        .nonoptional({ error: 'currentPassword must be required' }),
})