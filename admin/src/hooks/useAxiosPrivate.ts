import adminApi from "@/lib/config"
import useAuthStored from "@/stored/useAuthStored"
import { useEffect } from "react"

export const useAxiosPrivate = () => {
    const { logout, token } = useAuthStored()

    useEffect(() => {

        const requestIntercept = adminApi.interceptors.request.use(
            (config) => {
                if (token && config && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        const responseIntercept = adminApi.interceptors.response.use((response) => response, (error) => {
            if (error?.response?.status === 401) {
                logout()
                window.location.href = '/login'
            }
            return Promise.reject(error)
        })
        return () => {
            adminApi.interceptors.response.eject(responseIntercept)
            adminApi.interceptors.response.eject(requestIntercept)
        }
    }, [logout, token])
    return adminApi;
}