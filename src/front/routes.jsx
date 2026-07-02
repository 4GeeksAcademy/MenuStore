// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import ShopAdminView from "./pages/ShopAdminView";
import { CustomerHome } from "./pages/CustomerHome"; // revisar
import UserView from "./pages/UserView"; // revisar
import { ProductManager } from "./pages/ProductManager"; // acutalizar yisselle

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" errorElement={<h1>Not found!</h1>}>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      
      <Route path="admin-shop" element={<ShopAdminView />} />
      <Route path="product-manager/:categoryName" element={<ProductManager />} />

      <Route element={<Layout />}>
        <Route index element={<CustomerHome />} />
        <Route path="user-view" element={<UserView />} />
      </Route>
    </Route>
  )
);