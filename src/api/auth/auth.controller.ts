import type { Context } from "hono";
import { loginDto, signupDto, updatePasswordDto } from "./auth.dto";
import { authService } from "./auth.service";
import type { JwtPayloadType, SignUpType, updatePasswordType } from "@/lib/types";
import ApiResponse from "@/lib/helpers";

export const authController = {
    login: async (c: Context) => {
        const dto = await c.req.json();
        const { data, error } = loginDto.safeParse(dto);
        if (error) return c.json({ error: error.issues.map(issue => issue.message), statusCode: 400 }, 400);
        console.log(data)
        return await authService.login(data, c);
    },

    signup: async (c: Context) => {
        const dto = await c.req.json();

        const { data, error } = signupDto.safeParse(dto);
        if (error) return c.json({ error: error.issues.map(issue => issue.message), statusCode: 400 }, 400);

        return await authService.signup(data as SignUpType, c);
    },

    refreshToken: async (c: Context) => {
        const payload: JwtPayloadType = c.get('jwtPayload');
        console.log('api hit')
        if (!payload) return c.json(ApiResponse('Invalid referesh token', 401), 401);
        return await authService.refreshToken(payload, c);
    },

    updatePassword: async (c: Context) => {
        const payload: JwtPayloadType = c.get('jwtPayload');
        const dto = c.req.json();

        const { data, error } = updatePasswordDto.safeParse(dto);

        if (error) return c.json({ error: error.issues.map(issue => issue.message), statusCode: 400 }, 400);
        
        return await authService.updatePassword(data as updatePasswordType, payload, c);
    },

    logout: async (c: Context) => {
        return c.json({
            ...ApiResponse('Logged out successfully', 200),
            token: '',
        })
    }
}