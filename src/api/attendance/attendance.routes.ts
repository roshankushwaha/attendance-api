import { Hono } from "hono";
import { attendanceController } from "./attendance.controller";
import { jwt } from "hono/jwt";

export const attendanceRoutes = new Hono();

attendanceRoutes.use('/*', jwt({ secret: '8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55' }));

attendanceRoutes.post('/punch', attendanceController.punch);
attendanceRoutes.get('/today', attendanceController.today);
attendanceRoutes.get('/history', attendanceController.history);