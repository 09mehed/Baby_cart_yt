import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { Edit, Eye, Loader2, Plus, RefreshCcw, Search, Trash, Users2 } from "lucide-react"
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
import { toast } from "sonner"
import UserSkeleton from "../skeleton/user-skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

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
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)
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

  const formEdit = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      avatar: "",
    }
  })


  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Add a small delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axiosPrivate.get("/users", {
        params:{
          page,
          perPage,
          sortOrder: "desc",
          role: roleFilter === "all" ? undefined : roleFilter,
        }
      });
      if(response.data.users){
        setUsers(response.data.users)
        setTotal(response.data.total || response.data.users.length);
        setTotalPages(response.data.totalPages || 1);
      }else{
        setUsers(response.data);
        setTotal(response.data.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to load users", error);

    } finally {
      setLoading(false)
    }
  }

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
      await axiosPrivate.post("/users", data)
      toast("User created successfully")
      formAdd.reset();
      setIsAddModalOpen(false);
      fetchUsers()
    } catch (error) {
      console.error("Failed to create user", error);
      toast("Failed to create user")
    } finally {
      setFormLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await axiosPrivate.get("/users", {
        params: {
          page, perPage,
          role: roleFilter !== "all" ? roleFilter : undefined,
        }
      });
      if (response.data) {
        setUsers(response.data)
        // setTotal(response.data.total || response.data.users.length);
        // setTotalPages(response.data.totalPages || 1)
      } else {
        setUsers(response.data)
        // setTotal(response.data.length);
        // setTotalPages(1)
      }
      toast("user refresh successfully")
    } catch (error) {
      console.log("Failed to refresh users", error);
      toast("failed to refresh user")
    } finally {
      setRefreshing(false)
    }
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await axiosPrivate.delete(`/users/${selectedUser?._id}`)
      toast("user deleted successfully")
      fetchUsers();
    } catch (error) {
      console.log("Failed to delete user", error);
      toast("Failed to delete user")
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    formEdit.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
    setIsEditModalOpen(true);
  }

  const handleUpdateUser = async(data:FormData) => {
    if(!selectedUser) return;
    setFormLoading(true);

    try {
      await axiosPrivate.put(`/users/${selectedUser._id}`, data)
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.log("Failed to update user", error);
      toast("failed to update user")
    }finally{
      setFormLoading(false)
    }
  }

  const handleView = (user:User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true);
  }

  const filteredUser = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(searchItem.toLowerCase()) || user.email.toLowerCase().includes(searchItem.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchesRole
  })

  useEffect(() => {
    fetchUsers()
  }, [page, roleFilter])


  if (loading) {
    return <UserSkeleton></UserSkeleton>
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
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant={"outline"} className="border-blue-600 text-blue-600 hover:bg-blue-50 hoverEffect">
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}></RefreshCcw> {refreshing ? "Refreshing..." : "Refresh"}
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
      {/* filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center gap-4 flex-wrap ">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500"></Search>
            <Input placeholder="Search User..." value={searchItem} onChange={(e) => setSearchItem(e.target.value)} className="w-64"></Input>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Role"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Role</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="deliveryman">Delivery Man</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* users Table */}
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
            {filteredUser?.length > 0 ? (
              filteredUser.map((user) => (
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
                      <Button onClick={() => handleView(user)} variant={"ghost"} size="icon" title="view user details" className="border border-border">
                        <Eye />
                      </Button>
                      <Button onClick={() => handleEdit(user)} variant={"ghost"} size="icon" title="Edit user" className="border border-border">
                        <Edit />
                      </Button>
                      <Button onClick={() => handleDelete(user)} variant={"ghost"} size="icon" title="Delete user" className="border border-border">
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
                  {formLoading ? (<> <Loader2 className="animate-spin"></Loader2> Creating</>) : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete user modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are You sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can not be undone. This will permanently delete{" "}
              <span className="font-semibold">
                {selectedUser?.name}
              </span>'s account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update your information</DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form className="space-y-6 mt-4" onSubmit={formEdit.handleSubmit(handleUpdateUser)}>
              <FormField control={formEdit.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input type="name" {...field} disabled={formLoading} className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"></Input>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              <FormField control={formEdit.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={formLoading} className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"></Input>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              <FormField control={formEdit.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Role
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={formLoading}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                        <SelectValue placeholder="Select a role"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="deliveryman">Deliveryman</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              <FormField control={formEdit.control} name="avatar" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Avatar
                  </FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value ?? ""} onChange={field.onChange} disable={formLoading}>
                    </ImageUpload>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button onClick={() => setIsEditModalOpen(false)} disabled={formLoading} className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg hoverEffect" variant={"outline"} type="button">
                  Cancel
                </Button>
                <Button disabled={formLoading} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700 rounded-lg hoverEffect" type="submit">
                  {formLoading ? (<> <Loader2 className="animate-spin"></Loader2> Updating...</>) : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View Complete user information</DialogDescription>
          </DialogHeader>
         {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold capitalize inline-block",
                      getRoleColor(selectedUser.role)
                    )}>
                      {selectedUser.role}
                    </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  User Id
                </Label>
                <p className="text-lg font-semibold">{selectedUser._id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Created At
                </Label>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
         )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users