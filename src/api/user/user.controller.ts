import ApiResponse from "@/lib/helpers";
import type { Context } from "hono";
import { userService } from "./user.service";
import type { JwtPayloadType } from "@/lib/types";

export const userController = {
    me: async (c: Context) => {
        const payload: JwtPayloadType = c.get("jwtPayload");
        if (!payload) c.json(ApiResponse('Unauthorized access detected', 401), 401);

        return await userService.authMe(payload, c);
    }
}