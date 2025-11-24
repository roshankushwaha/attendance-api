import ApiResponse from "@/lib/helpers";
import type { JwtPayloadType, PunchReqBodyType } from "@/lib/types"
import type { Context } from "hono"
import { attendanceService } from "./attendance.service";

export const attendanceController = {
    punch: async (c: Context) => {
        const payload: JwtPayloadType = c.get('jwtPayload');
        const reqBody: PunchReqBodyType = await c.req.json();

        const timeStamp = new Date().toISOString();
        // console.log("payload", reqBody);

        if (!payload) return c.json(ApiResponse('Unauthorized access detected', 401), 400);
        if (!reqBody.latitude || !reqBody.longitude) return c.json(ApiResponse('Coordinates are not provided', 400), 400);
        if (!reqBody.deviceId) return c.json(ApiResponse('deviceId missing', 400), 400);

        if(reqBody.accuracy > 25) {
            c.json(ApiResponse('Low GPS accuracy. Try again.', 403), 403)
        }

        const userId = payload.sub;
        return await attendanceService.punch(reqBody, userId, timeStamp, c);
    },

    today: async (c: Context) => {
        const payload: JwtPayloadType = c.get('jwtPayload');
        return await attendanceService.getTodayAttendance(payload.sub, c);
    },

    history: async (c: Context) => {
        console.log('history api hit')
        const payload = c.get('jwtPayload');
        const year = c.req.query('year');
        const month = c.req.query('month');

        if(!year)  return c.json(ApiResponse('Missing query param: year', 400), 400);
        if (!month) return c.json(ApiResponse('Missing query param: month ', 400), 400);  

        return await attendanceService.getMonthlyAttendance(c, payload.sub, year, month)
    }
}