import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { userRoutes } from "@/api/user/user.routes";
import { attendanceRoutes } from "@/api/attendance/attendance.routes";
import { authRoutes } from "@/api/auth/auth.routes";
import "dotenv/config";
import { serve } from "@hono/node-server";

const app = new Hono();
const api = app.basePath("/api");

// Test endpoint
api.get("/", (c) => c.text("Hello bun!"));

// GLOBAL MIDDLEWARES
api.use("*", cors());
api.use("*", prettyJSON());

// ROUTES
api.route("/auth", authRoutes);
api.route("/user", userRoutes);
api.route("/attendance", attendanceRoutes);

// PORT FIX FOR RENDER
const port = Number(process.env.PORT) || 3000;

serve({
    fetch: app.fetch,
    port,
});

console.log(`hono server is running on port: ${port}`);
