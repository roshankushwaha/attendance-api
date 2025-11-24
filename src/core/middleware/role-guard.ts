import type { ROLES } from "@/lib/constants";
import ApiResponse from "@/lib/helpers";
import type { JwtPayloadType } from "@/lib/types";
import type { Context } from "hono";

export function RoleGuard(requiredRole: (keyof typeof ROLES)[]) {
    return async (c: Context, next: Function) => {
        const payload: JwtPayloadType = c.get('jwtPayload');

        if (!payload) c.json(ApiResponse('Unauthorized access detected', 401), 401);
        console.log('Payload', payload);
        console.log('required role', requiredRole)
        const role = payload.role;
        if (!requiredRole.includes(role)) {
            return c.json(ApiResponse('Forbidden: Access Denied', 403), 403);
        }
        return await next();
    }
}