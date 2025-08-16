import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/admin-dashboard.jsx";
import AddEditProductPage from "../pages/admin/add-edit-product-page.jsx";
import PrivateRoute from "../components/admin/privateRoute.jsx"
import NotFound from "../pages/not-found/index.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <PrivateRoute role="admin">
            <AddEditProductPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products/:id/edit"
        element={
          <PrivateRoute role="admin">
            <AddEditProductPage />
          </PrivateRoute>
        }
      />
      <Route path="/*" element={<NotFound/>}/>
    </Routes>
  );
};

export default AdminRoutes;
