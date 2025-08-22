/* eslint-disable react-hooks/exhaustive-deps */
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { brandSchema } from "@/lib/validation"
import type { Brand } from "@/type"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { Button } from "../ui/button"
import { Edit, Loader2, Plus, RefreshCcw, Trash } from "lucide-react"
import useAuthStored from "@/stored/useAuthStored"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageUpload } from "../ui/image-upload"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

type FormData = z.infer<typeof brandSchema>

const Brand = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const { checkIsAdmin } = useAuthStored()
  const isAdmin = checkIsAdmin()

  const formAdd = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  })

  const formEdit = useForm<FormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  })

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const response = await axiosPrivate.get("/brands")
      setBrands(response?.data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
      toast.error("Failed to fetch brand data");
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axiosPrivate.get("/brands");
      setBrands(response?.data)
      toast("Brand refresh Successfully")
    } catch (error) {
      console.error("Failed to refresh brand", error);
      toast.error("Failed to refresh brands")
    } finally {
      setRefreshing(false);
    }
  }

  const handleAddBrand = async (data: FormData) => {
    setFormLoading(true);
    try {
      await axiosPrivate.post("/brands", data)
      formAdd.reset();
      toast.success("Brand created successfully")
      setIsAddModalOpen(false)
      fetchBrands()
    } catch (error) {
      console.error("Failed to create brand", error);
      toast("Failed to create brand")
    } finally {
      setFormLoading(false);
    }
  }

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand)
    formEdit.reset({
      name: brand.name,
      image: brand.image || "",
    });
    setIsEditModalOpen(true);
  }

  const handleUpdateBrand = async(data:FormData) => {
    if(!selectedBrand) return;
    setFormLoading(true)
    try {
      await axiosPrivate.put(`/brands/${selectedBrand._id}`, data);
      toast("brand updated successfully")
      setIsEditModalOpen(false)
      fetchBrands()
    } catch (error) {
      console.error("Failed updated brand", error);
      toast.error("Failed to update brand")
    }finally{
      setFormLoading(false)
    }
  }

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteBrand = async() => {
    if(!selectedBrand) return;
    try {
      await axiosPrivate.delete(`/brands/${selectedBrand._id}`)
      toast("Brand deleted successfully");
      setIsDeleteModalOpen(false)
      fetchBrands()
    } catch (error) {
      console.log("Failed to delete brand", error);
      toast("Failed to delete brand")
    }
  }


  useEffect(() => {
    fetchBrands()
  }, [])

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brands</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant={"outline"} disabled={refreshing}>
            <RefreshCcw className={`mr-2 w-4 h-4 ${refreshing ? "animate-spin" : ""}`}></RefreshCcw> {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {
            isAdmin && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4"></Plus>
                Add Brand
              </Button>
            )
          }
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin"></Loader2>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-80px">Image</TableHead>
                <TableHead className="w-80px">Name</TableHead>
                <TableHead className="w-80px">Created At</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands?.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    {brand?.image && (
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted"><img src={brand?.image} alt="brand image" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(brand)}>
                        <Edit className="h-4 w-4"></Edit>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(brand)}>
                        <Trash className="h-4 w-4"></Trash>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
            <DialogDescription>Create a new product brand</DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form className="mt-4 space-y-6" onSubmit={formAdd.handleSubmit(handleAddBrand)}>
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
              {/* image field */}
              <FormField control={formAdd.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Brand Image</FormLabel>
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update brand information</DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form className="mt-4 space-y-6" onSubmit={formEdit.handleSubmit(handleUpdateBrand)}>
              <FormField control={formEdit.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                  <FormControl>
                    <input type="text" {...field} disabled={formLoading} className="focus:border-indigo-500 hoverEffect py-1 px-2" placeholder="Enter Name" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs"></FormMessage>
                </FormItem>
              )}>
              </FormField>
              {/* image field */}
              <FormField control={formEdit.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Brand Image</FormLabel>
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
                <Button onClick={() => setIsEditModalOpen(false)} disabled={formLoading} className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg hoverEffect" variant={"outline"} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700 rounded-lg hoverEffect">
                  {formLoading ? (<> <Loader2 className="animate-spin"></Loader2> Updating...</>) : "Update Brand"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Delete Brand Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the brand. <span className="font-semibold">{selectedBrand?.name}</span> </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBrand} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Brand