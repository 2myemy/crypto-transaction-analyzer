import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home"; // Hero 있는 페이지
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
