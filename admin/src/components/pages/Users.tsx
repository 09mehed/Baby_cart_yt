import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { Edit, Eye, Loader2, Plus, RefreshCcw, Trash, Users2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import useAuthStored from "@/stored/useAuthStored"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { cn } from "@/lib/utils"
import type { UserType } from "@/type"
import type { UserInterface } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import z from "zod"
import { userSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ImageUpload } from "../ui/image-upload"
import { toNamespacedPath } from "path"
import { toast } from "sonner"

type FormData = z.infer<typeof userSchema>

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const axiosPrivate = useAxiosPrivate()
  const { checkIsAdmin } = useAuthStored()
  const isAdmin = checkIsAdmin();
  const [refreshing, setRefreshing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [seletedUser, setSeletedUser] = useState<UserInterface | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [searchItem, setSearchItem] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [totalPages, setTotalPages] = useState(1);

  const formAdd = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: "",
    }
  })


  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosPrivate.get("/users");
      setUsers(response?.data)
    } catch (error) {
      console.error("Failed to load users", error);

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "deliveryman":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-fray-100 text-gray-800";
    }
  }

  const handleAddUser = async (data: FormData) => {
    setFormLoading(true)
    try {
      
    } catch (error) {
      console.error("Failed to create user", error);
      toast("Failed to create user")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-0.5">View all manage all system users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-blue-600 flex items-center gap-1">
            <Users2 className="w-8 h-8 "></Users2>
            <p className="text-2xl font-bold">{users?.length}</p>
          </div>
          <Button variant={"outline"} className="border-blue-600 text-blue-600 hover:bg-blue-50 hoverEffect">
            <RefreshCcw ></RefreshCcw> Refresh
          </Button>
          {
            isAdmin && (
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus></Plus> Add User
              </Button>
            )
          }
        </div>
      </div>
      {/* filters skeleton */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Avatar</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden">
                      {user?.avatar
                        ? <img src={user?.avatar} alt="image" className="w-full h-full object-cover" />
                        : <span className="text-lg font-black">{user?.name?.charAt(0).toUpperCase()}</span>
                      }
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold capitalize inline-block",
                      getRoleColor(user.role)
                    )}>
                      {user.role}
                    </div>

                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant={"ghost"} size="icon" title="view user details">
                        <Eye />
                      </Button>
                      <Button variant={"ghost"} size="icon" title="Edit user">
                        <Edit />
                      </Button>
                      <Button variant={"ghost"} size="icon" title="Delete user">
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No Users
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
      {/* Add user Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add User
            </DialogTitle>
            <DialogDescription>Create a new user</DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form className="mt-4 space-y-6" onSubmit={formAdd.handleSubmit(handleAddUser)}>
              <FormField control={formAdd.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                  <FormControl>
                    <input type="text" {...field} disabled={formLoading} className="focus:border-indigo-500 hoverEffect py-1 px-2" placeholder="Enter Name" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              {/* email field */}
              <FormField control={formAdd.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                  <FormControl>
                    <input type="email" {...field} disabled={formLoading} className="focus:border-indigo-500 hoverEffect py-1 px-2" placeholder="Enter Valid Email" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              {/* password field */}
              <FormField control={formAdd.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                  <FormControl>
                    <input type="Password" {...field} disabled={formLoading} className="focus:border-indigo-500 hoverEffect py-1 px-2" placeholder="Enter Password" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              {/* role field */}
              <FormField control={formAdd.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={formLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="deliveryman">Delivery man</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              {/* image field */}
              <FormField control={formAdd.control} name="avatar" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Avatar</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={formLoading}
                    ></ImageUpload>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              {/* Buttons field */}
              <DialogFooter>
                <Button onClick={() => setIsAddModalOpen(false)} disabled={formLoading} className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg hoverEffect" variant={"outline"} type="button">
                  Cancel
                </Button>
                <Button onClick={() => setIsAddModalOpen(false)} disabled={formLoading} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700 rounded-lg hoverEffect" type="submit">
                  {formLoading ? ( <> <Loader2 className="animate-spin"></Loader2> Creating</> ) : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users