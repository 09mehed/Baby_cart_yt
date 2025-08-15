import { api } from '@/lib/api';
import {create} from 'zustand';
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

const useAuthStored = create<AuthState>()(
    persist(
        (set, get) => ({
            user:null,
            token: null,
            isAuthenticated: false,
            login: async(credential) => {
                try {
                    const response = await api.post("/auth/login", credential)
                    if(response.data.token){
                        set({
                            user: response.data,
                            token: response.data.token,
                            isAuthenticated: true
                        })

                    }
                } catch (error) {
                    console.error("login error", error);
                }
            },
            register: async (userData) => {
                try {
                    await api.post("/auth/register", userData)
                } catch (error) {
                    console.error("Registration error", error);
                }
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                })
            },
            checkIsAdmin: () => {
                const { user } = get();
                return user?.role === "admin";
            },
        }),
        {
            name: "auth-storage",
        }
    )
)

export default useAuthStored