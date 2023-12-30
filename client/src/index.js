import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
// import {Router} from 'react-router-dom';
// import {createRoot} from "react-dom";
import { Toaster } from 'react-hot-toast';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage/>,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/home",
        element: <HomePage/>,
    },
    {
        path: "/admin",
        element: <AdminPage/>,
    },
    {
        path: "/register",
        element: <RegisterPage/>,
    },
    {
        path: "/profile",
        element: <ProfilePage/>,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
