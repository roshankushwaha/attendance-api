import { sign } from "hono/jwt";

export default function ApiResponse(message: string, statusCode: number, data?: any) {
    return ({
        message: message,
        statusCode: statusCode,
        ...data && { data: data } 
    })
}


export async function generateAccessToken(sub: string, role: string) {
    const now = Math.floor(Date.now() / 1000);

    return await sign(
        {
            sub: sub,
            role: role,
            iat: now,
            exp: now + 60 * 15,   // ⏳ 15 mins
        },
        "8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55"
    );
}
export async function generateRefreshToken(sub: string, role: string) {
    const now = Math.floor(Date.now() / 1000);

    return await sign(
        {
            sub: sub,
            role: role,
            iat: now,
            exp: now + 60 * 60 * 24 * 7,  // ⏳ 7 days
        },
        "8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55"
    );
}


