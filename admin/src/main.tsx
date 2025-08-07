import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Login from './components/pages/Login.tsx';
import Register from './components/pages/Register.tsx';
import DashboardPage from './components/pages/DashboardPage.tsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login></Login>,
  },
  {
    path: '/register',
    element: <Register></Register>
  },
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage></DashboardPage>
      },
    ]
  },
  
]);


createRoot(document.getElementById('root')!).render(
  
    <RouterProvider router={router} />,
)
