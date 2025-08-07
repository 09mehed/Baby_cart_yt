import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6,{message: "password must be at least 6 characters"})
})

export const registerSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 character"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6,{message: "password must be at least 6 characters"}),
    role: z.enum(["admin", "user", "deliveryMan"],{message: "Please select a valid role"})
})