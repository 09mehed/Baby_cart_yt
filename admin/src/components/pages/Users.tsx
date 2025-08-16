import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { Badge, Edit, Eye, Plus, RefreshCcw, Trash, Users2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import useAuthStored from "@/stored/useAuthStored"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import type { UserType } from "@/type"
import { cn } from "@/lib/utils"



const Users = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const axiosPrivate = useAxiosPrivate()
  const { checkIsAdmin } = useAuthStored()
  const isAdmin = checkIsAdmin();

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
              <Button>
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
                    <Badge className={cn("capitalize", getRoleColor(user.role))}>
                      {user.role}
                    </Badge>
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
    </div>
  )
}

export default Users