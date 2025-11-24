import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { userRoutes } from "@/api/user/user.routes";
import { attendanceRoutes } from "@/api/attendance/attendance.routes";
import { authRoutes } from "@/api/auth/auth.routes";
import "dotenv/config";
import { serve } from "@hono/node-server";
const app = new Hono();
const api = app.basePath('/api')

api.get('/', c => c.text('Hello bun!'))

// Middlewares
api.use("*", cors());
api.use("*", prettyJSON());

// REGISTER ROUTES
api.route("/auth", authRoutes);
api.route('/user', userRoutes);
api.route('/attendance', attendanceRoutes);


serve({
    fetch: app.fetch,
    port: 3000,
})
console.log(`hono server is running on port: 3000`)
