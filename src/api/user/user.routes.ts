import { Hono } from "hono"
import { userController } from "./user.controller"
import { jwt } from 'hono/jwt'

export const userRoutes = new Hono()

userRoutes.use('/*', jwt({
    secret: "8f3a1e2b9c7d4fcbad9923123adaf01092b8bc3944ff7782cace0a87e9e9cc55",
    
}))

userRoutes.get('/me', userController.me)