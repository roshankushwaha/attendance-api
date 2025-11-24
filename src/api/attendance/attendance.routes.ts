import { Hono } from "hono";
import { attendanceController } from "./attendance.controller";
import { jwt } from "hono/jwt";

export const attendanceRoutes = new Hono();

attendanceRoutes.use('/*', jwt({ secret: process.env.JWT_SECRET! }));

attendanceRoutes.post('/punch', attendanceController.punch);
attendanceRoutes.get('/today', attendanceController.today);
attendanceRoutes.get('/history', attendanceController.history);