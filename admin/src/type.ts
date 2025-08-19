export interface UserType {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    // role: "admin" | "user" | "deliveryman";
    role: string;
    createdAt: string;
}