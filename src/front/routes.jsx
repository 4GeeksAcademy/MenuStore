

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import ShopAdminView from "./pages/ShopAdminView";
import { CustomerHome } from "./pages/CustomerHome";
import UserView from "./pages/UserView"; 
import { ProductManager } from "./pages/ProductManager"; 
import ShoppingCart from "./pages/ShoppingCart";

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" errorElement={<h1>Not found!</h1>}>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      
      <Route path="admin-shop" element={<ShopAdminView />} />
      <Route path="/product-manager/:categoryId" element={<ProductManager />} />

      <Route element={<Layout />}>
        <Route index element={<CustomerHome />} />
        <Route path="user-view" element={<UserView />} />
        <Route path="shopping-cart" element={<ShoppingCart />} />
      </Route>
    </Route>
  )
);