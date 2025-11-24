import { Hono } from "hono";
import { authController } from "./auth.controller";
import { jwt } from "hono/jwt";

export const authRoutes = new Hono();

authRoutes.use('/refresh-token', jwt({ secret: process.env.JWT_REFRESH_SECRET! }));
authRoutes.use('/logout', jwt({ secret: process.env.JWT_SECRET! }));
authRoutes.use('/update-password', jwt({ secret: process.env.JWT_SECRET! }));

authRoutes.post('/login', authController.login);
authRoutes.post("/signup", authController.signup);
authRoutes.post('/refresh-token', authController.refreshToken);
authRoutes.post('/update-password', authController.updatePassword);
authRoutes.post('/logout', authController.logout);