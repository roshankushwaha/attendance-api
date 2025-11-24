import { db } from "@/db"
import { users } from "@/db/schema"
import ApiResponse from "@/lib/helpers";
import type { JwtPayloadType } from "@/lib/types";
import { and, eq } from 'drizzle-orm'
import type { Context } from "hono";

export const userService = {
    getUserByContact: async (contact: string) => {
        const user = await db.select().from(users).where(and(eq(users.contact, contact), eq(users.active, true)));
        if (!user.length) return null;
        return user[0];
    },

    updatePassword: async (userId: string, newHashedPassword: string): Promise<Boolean> => {
        const record = await db.update(users).set({ password: newHashedPassword }).where(eq(users.id, userId)).returning();
         return record.length ? true : false
    },

    contactExist: async (contact: string): Promise<boolean> => {
        const [contactExist] = await db.select({ contact: users.contact }).from(users).where(eq(users.contact, contact));
        return contactExist?.contact ? true : false;
    },

    getUserById: async (userId: string) => {
        const user = await db.select().from(users).where(and(eq(users.id, userId), eq(users.active, true)));
        if (!user.length || !user[0]) return null;

        const { password, ...userWithoutPassword } = user[0];
        return userWithoutPassword;
    },
    
    authMe: async (payload: JwtPayloadType, c: Context) => {
        const user = await userService.getUserById(payload.sub);
        if (!user) c.json(ApiResponse('User not found', 400), 400);
        return c.json({
            ...ApiResponse('User fetched successfully', 200),
            data: user
        }, 200);
    }
}