import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { motion } from "motion/react"
import { z } from 'zod';
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/validation";
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStored from "@/stored/useAuthStored"

type FormData = z.infer<typeof registerSchema>

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { register } = useAuthStored()

    const form = useForm<FormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        role: "user"
      }
    })
  
    const onSubmit = async (data:FormData) => {
      setIsLoading(true)
      try{
        await register(data)
        console.log("registration done");
        navigate("/login")
      }catch(error){
        console.log("Failed to Register", error);
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
                Create an Account
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your details to sign up
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                      <FormControl>
                        <Input type="name" placeholder="John doe"
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

                <FormField
                  control={form.control}
                  name="role"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                      <FormControl>
                        <Input type="role" placeholder="Enter your Role"
                          disabled={isLoading}
                          className="border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs"></FormMessage>
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg font-semibold">
                    Sign Up
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">Already have an Account <Link to={'/login'} className="text-indigo-600 hover:text-indigo-600 font-bold">Sign In</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register