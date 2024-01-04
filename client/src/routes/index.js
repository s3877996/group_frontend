import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";
import AdminPage from "../pages/AdminPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import UserProfilePage from "../pages/UserProfilePage";
import SubscriptionPage from "../pages/SubscriptionPage";
import SuccessPage from "../pages/SuccessPage";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <LandingPage/>,
    },
    {
      path: "/home",
      element: <HomePage/>,
    },
    {
      path:'/subscription',
      element:<SubscriptionPage/>
    },
    {
      path: "/login",
      element:<LoginPage/>,
    },
    {
      path: "/register",
      element:<RegisterPage/>,
    },
    {
      path: "/userprofile",
      element: <UserProfilePage/>,
    },
    {
      path: "/success",
      element: <SuccessPage/>,
    }
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [

        {
          path: "",
          element: <div>User Home Page</div>,
        },
        {
          path: "/profile",
          element: <ProfilePage/>,
        },


      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element:<HomePage/>,
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/register",
      element:<RegisterPage/>,
    },
    {
      path:'/subscription',
      element:<SubscriptionPage/>
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
