import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/admin-dashboard.jsx";
import ManageProducts from "../pages/admin/manage-products.jsx";
import ManageUsers from "../pages/admin/manage-users.jsx";
import ManageOrders from "../pages/admin/manage-orders.jsx";
import EditProduct from "../pages/admin/edit-product.jsx";
import AddEditProductPage from "../pages/admin/add-edit-product-page.jsx";

// Future: Add EditProductPage if needed
// import EditProductPage from "@/admin/pages/EditProductPage";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/products/:id/edit" element={<EditProduct />} />
            <Route path="/admin/products/new" element={<AddEditProductPage />} />
            <Route path="/admin/products/edit/:productId" element={<AddEditProductPage />} />
        </Routes>
    );
};

export default AdminRoutes;
