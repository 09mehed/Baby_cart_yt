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
import Account from './components/pages/Account.tsx';
import Users from './components/pages/Users.tsx';
import Orders from './components/pages/Orders.tsx';
import Invoices from './components/pages/Invoices.tsx';
import Banner from './components/pages/Banner.tsx';
import Product from './components/pages/Product.tsx';
import Category from './components/pages/Category.tsx';
import Brand from './components/pages/Brand.tsx';

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
        element: <DashboardPage></DashboardPage>,
      },
      {
        path: '/dashboard/account',
        element: <Account></Account>
      },
      {
        path: '/dashboard/users',
        element: <Users></Users>
      },
      {
        path: '/dashboard/orders',
        element: <Orders></Orders>
      },
      {
        path: '/dashboard/invoices',
        element: <Invoices></Invoices>
      },
      {
        path: '/dashboard/banners',
        element: <Banner></Banner>
      },
      {
        path: '/dashboard/products',
        element: <Product></Product>
      },
      {
        path: '/dashboard/categories',
        element: <Category></Category>
      },
      {
        path: '/dashboard/brands',
        element: <Brand></Brand>
      },
    ]
  },

]);


createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
