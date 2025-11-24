import { Hono } from "hono"
import { userController } from "./user.controller"
import { jwt } from 'hono/jwt'

export const userRoutes = new Hono()

userRoutes.use('/*', jwt({
    secret: process.env.JWT_SECRET!,
    
}))

userRoutes.get('/me', userController.me)