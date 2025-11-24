import { db, } from "@/db";
import { eq, and } from 'drizzle-orm'
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import type { JwtPayloadType, LoginType, SignUpType, updatePasswordType } from "@/lib/types";
import type { Context } from "hono";
import { userService } from "../user/user.service";
import ApiResponse, { generateAccessToken, generateRefreshToken } from "@/lib/helpers";

export const authService = {

    async login(dto: LoginType, c: Context) {
        const userExist = await userService.getUserByContact(dto.contact);
        if (!userExist) return c.json(ApiResponse("Invalid credentials", 403), 403);
        const { password, ...user } = userExist;

        const match = bcrypt.compareSync(dto.password, password)
        if (!match) return c.json(ApiResponse('Invalid credentials', 403), 403);

        const accessToken = await generateAccessToken(user.id, user.role);
        const refreshToken = await generateRefreshToken(user.id, user.role);

        return c.json({
            success: true,
            accessToken,
            refreshToken,
            expiresIn: 900,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                contact: user.contact,
                email: user.email,
            }
        });
    },

    async refreshToken(payload: JwtPayloadType, c: Context) {
        const newAccessToken = await generateAccessToken(payload.sub, payload.role);
        const newRefreshToken = await generateRefreshToken(payload.sub, payload.role);
        return c.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 900
        })
    },

    async updatePassword(dto: updatePasswordType, payload: JwtPayloadType, c: Context) {
        const [user] = await db.select({ password: users.password }).from(users).where(eq(users.id, payload.sub));
        if (!user) return c.json(ApiResponse('User dones not exist', 400), 400);

        const match = bcrypt.compareSync(dto.currentPassword, user.password);
        if (!match) return c.json(ApiResponse('Invalid credentials', 403), 403);

        const newHashedPassword = bcrypt.hashSync(dto.newPassword, 10);
        const updated = await userService.updatePassword(payload.sub, newHashedPassword);
        if (!updated) return c.json(ApiResponse('Failed to update password', 400), 400);

        return c.json(ApiResponse('Password updated successfully', 200), 200);
    },

    async signup(dto: SignUpType, c: Context) {
        const contactExist = await userService.contactExist(dto.contact);
        if (contactExist) return c.json({ message: 'User already exist', statusCode: 409 }, 409);

        const hashedPassword = bcrypt.hashSync(dto.password, 10);
        const [user] = await db.insert(users).values({ ...dto, password: hashedPassword }).returning();
        if (!user) return c.json({ message: 'Failed to create new user', statusCode: 400 }, 400);

        const { password, ...userWithoutPassword } = user;
        return c.json({
            message: 'New user created successfully',
            statusCode: 201,
            data: userWithoutPassword
        }, 201);
    }

}
