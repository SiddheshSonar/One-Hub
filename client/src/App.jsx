import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AddPage from "./pages/AddBlog";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Uploads from "./pages/Uploads";
import Dashboard from "./pages/Dashboard";
import Suggestions from "./pages/Suggestions";
import BlogHome from "./pages/BlogHome";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import Redirect from "./Redirect";
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";


function App() {
  const token = localStorage.getItem('token');

  const isNavBarOpen = useSelector(state => state.ui.isNavBarOpen)

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <ToastContainer
                position="top-center"
                autoClose={1500}
                limit={2}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
          {token && (<NavBar />)}
          {!isNavBarOpen && (<>
            <Outlet />
            {token && (<Footer />)}
          </>)}
        </>
      ),
      children: [
        {
          path: '/',
          element: <Redirect />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/blog',
          element: <BlogHome />
        },
        {
          path: '/blog/:id',
          element: <Blog />
        },
        {
          path: '/uploads',
          element: <Uploads />
        },
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/suggestions',
          element: <Suggestions />
        },
        ,
        {
          path: '/AddBlog',
          element: <AddPage />
        },
        {
          path: '/profile',
          element: <Profile />
        }
      ]
    }
  ]);

  return (
    <AnimatePresence >
      <div className="h-screen w-full">
        <RouterProvider router={router} />
      </div>
    </AnimatePresence>
  )
}

export default App
