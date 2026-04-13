import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import z from "zod";
import { Router, type Request, type Response } from "express";
import type { User } from "../types/types";
import { E, S, ErrorResponses, AppError } from "../core/utils"

const bcrypt = require("bcrypt")
const router = Router()

const createUserSchema = z.object({
    name: z.string(),
    restaurantId: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string(),
    role: z.nativeEnum(UserRole)
})

router.post(
    "/signup",
    async (req: Request, res: Response, next) => {
        const body = createUserSchema.safeParse(req.body).data || E(ErrorResponses.INVALID_INPUT);
        const passwordHash = await bcrypt.hash(body.password, 10)

        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: body.username
                }
            }) && E(ErrorResponses.USERNAME_TAKEN)

            const user = await prisma.user.create({
                data: {
                    ...body,
                    password: passwordHash
                }
            }) || E(ErrorResponses.INTERNAL_SERVER_ERROR)

            S(res, { user })
        } catch (error: any) {
            return res.json({success:false, code: error.message })
        }
    }
)

const loginUserSchema = z.object({
    username: z.string(),
    password: z.string()
})

router.post(
    "/login",
    async (req: Request, res: Response, next) => {

        try {
            const body = loginUserSchema.safeParse(req.body).data || E( ErrorResponses.INVALID_INPUT);
            const user = await prisma.user.findUnique({
                where: {
                    username: body.username
                }
            }) || E( ErrorResponses.INVALID_CREDENTIALS)


            const result = await bcrypt.compare(body.password, user.password) || E(ErrorResponses.INVALID_CREDENTIALS)
            S(res, {...user, password: ""})
        } catch (error: any) {
            return res.json({success:false, code: error.message })

        }
    }
)

export default router