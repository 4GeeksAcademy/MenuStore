import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import { AdminLogin } from "./pages/AdminLogin";
import Register from "./pages/Register";
import ShopAdminView from "./pages/ShopAdminView";
import { CustomerHome } from "./pages/CustomerHome";
import UserView from "./pages/UserView";
import { ProductManager } from "./pages/ProductManager";
import ShoppingCart from "./pages/ShoppingCart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import OrderSuccess from "./pages/OrderSuccess";
import ShopOrders from "./pages/ShopOrders";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      errorElement={
        <div className="container py-5 text-center">
          <h1>Página no encontrada</h1>
        </div>
      }
    >
      {/* Rutas públicas */}
      <Route
        path="login"
        element={<Login />}
      />

      <Route
        path="register"
        element={<Register />}
      />

      <Route
        path="admin-login"
        element={<AdminLogin />}
      />

      {/* Rutas privadas para cualquier usuario autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            index
            element={<CustomerHome />}
          />

          <Route
            path="user-view"
            element={<UserView />}
          />

          <Route
            path="shopping-cart"
            element={<ShoppingCart />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="orders/:orderId"
            element={<OrderDetail />}
          />

          <Route
            path="order-success/:orderId"
            element={<OrderSuccess />}
          />
        </Route>
      </Route>

      {/* Rutas solamente para administradores */}
      <Route element={<AdminRoute />}>
        <Route
          path="admin-shop"
          element={<ShopAdminView />}
        />

        <Route
          path="admin-orders"
          element={<ShopOrders />}
        />

        <Route
          path="product-manager/:categoryId"
          element={<ProductManager />}
        />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);