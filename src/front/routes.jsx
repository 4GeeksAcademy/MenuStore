// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import Register from "./pages/Register"

export const router = createBrowserRouter(
  createRoutesFromElements(
  
    <Route path="/" errorElement={<h1>Not found!</h1>}>
      
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<Layout />}>
        <Route index element={<StorePreview />} />
        <Route path="user-view" element={<UserView />} />
        <Route path="admin-shop" element={<ShopAdminView />} />
      </Route>

    </Route>
  )
);