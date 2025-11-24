import type z from "zod";
import type { loginDto, signupDto, updatePasswordDto } from "@/api/auth/auth.dto";
import type { ROLES } from "./constants";

export type SignUpType = z.infer<typeof signupDto>;
export type LoginType = z.infer<typeof loginDto>;
export type updatePasswordType = z.infer<typeof updatePasswordDto>;

export type JwtPayloadType = {
    sub: string;
    role: keyof typeof ROLES
    iat: number,
    exp: number
}

export type PunchReqBodyType = {
    accuracy: number
    longitude: number
    latitude: number
    altitude: number
    altitudeAccuracy: number
    deviceId: string;
}