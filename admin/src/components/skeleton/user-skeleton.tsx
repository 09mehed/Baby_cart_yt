import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

const UserSkeleton = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-64 mb-2"></Skeleton>
                    <Skeleton className="h-4 w-64"></Skeleton>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded"></Skeleton>
                    <Skeleton className="h-6 w-12"></Skeleton>
                </div>
            </div>

            {/* Filter skeleton */}
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Skeleton className="h-9 w-64"></Skeleton>
                    <Skeleton className="h-9 w-48"></Skeleton>
                    {/* {isAdmin && <Skeleton className="h-9 w-32"></Skeleton>} */}
                </div>
            </div>

            {/* Table skeleton */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">
                                <Skeleton className="h-4 w-16"></Skeleton>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <Skeleton className="h-4 w-16"></Skeleton>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <Skeleton className="h-4 w-20"></Skeleton>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <Skeleton className="h-4 w-16"></Skeleton>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <Skeleton className="h-4 w-20"></Skeleton>
                            </TableHead>
                            {/* {isAdmin && (
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-16"></Skeleton>
                                </TableHead>
                            )} */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                                <TableCell>
                                    <Skeleton className="w-12 h-12 rounded-full"></Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-4 h-32"></Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-4 h-40"></Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-6 h-20 rounded-full"></Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-4 h-20"></Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-4 h-24"></Skeleton>
                                </TableCell>
                                {/* {isAdmin && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded"></Skeleton>
                                            <Skeleton className="h-8 w-8 rounded"></Skeleton>
                                            <Skeleton className="h-8 w-8 rounded"></Skeleton>
                                        </div>
                                    </TableCell>
                                )} */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* pagination skeleton */}
            <div className="flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-32"></Skeleton>
                    <Skeleton className="h-4 w-24"></Skeleton>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-20"></Skeleton>
                    <Skeleton className="h-8 w-16"></Skeleton>
                </div>
            </div>
        </div>
    )
}

export default UserSkeleton