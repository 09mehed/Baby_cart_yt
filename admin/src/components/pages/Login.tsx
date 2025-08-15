import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { motion } from "motion/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from 'zod';
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, LogIn } from "lucide-react";
import useAuthStored from "@/stored/useAuthStored";

type FormData = z.infer<typeof loginSchema>

const Login = () => {

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStored()

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data:FormData) => {
    setIsLoading(true);
    try {
      await login(data)
      navigate("/dashboard")
    } catch (error) {
      console.error("Failed to login", error);
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="w-full max-w-md px-4"
      >
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your credential to sign in
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" 
                        disabled={isLoading}
                        {...field}
                        className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hoverEffect" />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs"></FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hoverEffect" />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs"></FormMessage>
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg font-semibold">
                     {!isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin"></Loader2>
                        Singing in...
                      </span>
                     ) : (
                      <span className="flex items-center gap-2">
                        <LogIn></LogIn>
                        Sign In
                      </span>
                     )}
                </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">Don't have an Account <Link to={'/register'} className="text-indigo-600 hover:text-indigo-600 font-bold">Sign Up</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>

  )
}

export default Login