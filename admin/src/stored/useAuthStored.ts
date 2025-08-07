import {crate} from 'zustand';
import {persist} from 'zustand/middleware';

type User = {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    role: "admin" | "user" | "deliveryMan";
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: {email: string; password: string}) => Promise <void>;
    register: (userData: {
        name: string;
        email: string;
        password:string;
        role: string;
    }) => Promise <void>;
    logout: () => void;
    checkIsAdmin: () => boolean;
}

const useAuthStored = crate<AuthState>()(
    persist(
        (set, get) => ({
            user:null,
            token: null,
            isAuthenticated: false,
            login: async(Credential) => {},
            register: async (userData) => {
                try {
                    await api
                } catch (error) {
                    console.error("Registration error", error);
                }
            },
            logout: () => {},
            checkIsAdmin: () => {},
        }),
        {
            name: "auth-storage",
        }
    )
)