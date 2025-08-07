import { Navigate, Outlet } from "react-router"
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/common/Header";
import { cn } from "./lib/utils";


function App() {
  const isAuthenticate = false;
  if (!isAuthenticate) {
    return <Navigate to={'/login'}></Navigate>
  }
  return (
    <>
      <div className="h-screen flex bg-background">
        <Sidebar></Sidebar>
        <div className={cn("flex flex-col flex-1 max-w-[--breakpoint-2xl] hoverEffect ml-64")}>
          <Header></Header>
          <main>
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
