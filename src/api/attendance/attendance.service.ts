import { db } from "@/db";
import { attendanceRecord } from "@/db/schema/attendance.schema";
import { haversineDistance } from "@/lib/haversine-distance";
import ApiResponse from "@/lib/helpers";
import type { PunchReqBodyType } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";

export const attendanceService = {
    punch: async (coords: PunchReqBodyType, userId: string, timestamp: string, c: Context) => {

        const { validated, distance } = await attendanceService.validateLocation(coords);
        if (!validated) {
            return c.json(ApiResponse(`You are currently outside the office location. ${distance}`, 403), 403);
        }

        const time = new Date(timestamp);
        const date = time.toISOString().split("T")[0]!;

        const record = await attendanceService.getAttendaceRecord(date, userId);

        if (!record) {

            const uniqueDevice = await attendanceService.validateUniqueDevice(date, coords.deviceId);
            if(!uniqueDevice) {
                return c.json(ApiResponse('Attendance already marked on this device.', 403), 403)
            }

            const newRecord = await attendanceService.punchIn(date, time, userId, coords.deviceId);
            if (!newRecord) c.json(ApiResponse('Someting wend wrong', 400), 400);
            return c.json(ApiResponse("Punch In Successful", 201), 201);
        }
        if (record) {
            const updatedRecord = await attendanceService.punchOut(date, time, userId);
            if (!updatedRecord) c.json(ApiResponse('Someting wend wrong', 400), 400);
            return c.json(ApiResponse(record.punchOut ? `Punch Out time updated ${distance}` : '"Punch Out Successful"', 200), 200);
        }
    },

    getAttendaceRecord: async (date: string, userId: string) => {
        const record = await db.select().from(attendanceRecord)
            .where(and(
                eq(attendanceRecord.date, date),
                eq(attendanceRecord.userId, userId),
            ));
        if (!record || !record[0]) return null;
        return record[0];
    },

    punchIn: async (date: string, time: Date, userId: string, deviceId: string): Promise<Boolean> => {
        const newRecord = await db.insert(attendanceRecord).values({
            userId: userId,
            date: date,
            punchIn: time,
            deviceId
        }).returning()

        if (!newRecord || !newRecord[0]) return false;
        return true;
    },

    punchOut: async (date: string, time: Date, userId: string): Promise<Boolean> => {
        const updatedRecord = await db.update(attendanceRecord).set({ punchOut: time })
            .where(and(
                eq(attendanceRecord.date, date),
                eq(attendanceRecord.userId, userId)
            )).returning();
        if (!updatedRecord || !updatedRecord[0]) return false;
        return true;
    },
    getTodayAttendance: async (userId: string, c: Context) => {
        const today = new Date().toISOString().split("T")[0]!;

        const record = await db.select({
            punchIn: attendanceRecord.punchIn,
            punchOut: attendanceRecord.punchOut,
            date: attendanceRecord.date,
        }).from(attendanceRecord).where(and(
            eq(attendanceRecord.date, today),
            eq(attendanceRecord.userId, userId)
        ))

        if (!record.length) return c.json(ApiResponse('No record found for today', 404), 404)

        return c.json({
            message: "Today's attendance record fetched successfully",
            statusCode: 200,
            data: record[0],
        })
    },
    getMonthlyAttendance: async (c: Context, userId: string, year: string, month: string) => {
        const record = await db.select({
            date: attendanceRecord.date,
            punchIn: attendanceRecord.punchIn,
            punchOut: attendanceRecord.punchOut
        }).from(attendanceRecord).where(and(
            eq(attendanceRecord.userId, userId),
            sql`EXTRACT(YEAR FROM ${attendanceRecord.date}) = ${year}`,
            sql`EXTRACT(MONTH FROM ${attendanceRecord.date}) = ${month}`
        )).orderBy(attendanceRecord.date);

        return c.json({
            message: 'Attendance fetched successfully',
            statusCode: 200,
            data: record
        })
    },
    validateLocation: async (coords: PunchReqBodyType): Promise<{ validated: boolean, distance: number }> => {
        const officeLat = 28.586147;
        const officeLng = 77.3162862;
        const distance = haversineDistance(officeLat, officeLng, coords.latitude, coords.longitude);
        
        console.log("accuracy", coords.accuracy)
        console.log("distance", distance);

        if (distance > (coords.accuracy)) {
            return { validated: false, distance };
        }
        return { validated: true, distance }
    },
    validateUniqueDevice: async (date: string, deviceId: string): Promise<Boolean> => {
        const record = await db.select({ deviceId: attendanceRecord.deviceId }).from(attendanceRecord)
            .where(and(
                eq(attendanceRecord.date, date),
                eq(attendanceRecord.deviceId, deviceId)
            )).limit(1);
        if (record.length) return false
        return true;
    }
}