export interface UserType {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    createdAt: string;
}

export interface Brand {
    _id: string;
    name: string;
    image?: string;
    createdAt: string;
}