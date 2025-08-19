import { Navigate, Outlet } from "react-router"
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/common/Header";
import { cn } from "./lib/utils";
import useAuthStored from "./stored/useAuthStored";
import { useState } from "react";
import { Toaster } from 'sonner';


function App() {
  const { isAuthenticated } = useAuthStored()
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to={'/login'}></Navigate>
  }
  return (
    <>
      <div className="h-screen flex bg-background">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}></Sidebar>
        <div className={cn("flex flex-col flex-1 max-w-[--breakpoint-2xl] hoverEffect", sidebarOpen ? "ml-64" : "ml-20")}>
          <Header></Header>
          <main>
            <Outlet></Outlet>
          </main>
        </div>
        <Toaster position="bottom-right"></Toaster>
      </div>
    </>
  )
}

export default App
