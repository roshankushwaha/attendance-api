import { Hono } from "hono";
import { authController } from "./auth.controller";
import { jwt } from "hono/jwt";

export const authRoutes = new Hono();

authRoutes.use('/refresh-token', jwt({ secret: '8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55' }));
authRoutes.use('/logout', jwt({ secret: '8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55' }));
authRoutes.use('/update-password', jwt({ secret: '8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55' }));

authRoutes.post('/login', authController.login);
authRoutes.post("/signup", authController.signup);
authRoutes.post('/refresh-token', authController.refreshToken);
authRoutes.post('/update-password', authController.updatePassword);
authRoutes.post('/logout', authController.logout);