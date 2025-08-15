import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/admin-dashboard.jsx";
import AddEditProductPage from "../pages/admin/add-edit-product-page.jsx";


const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products/new" element={<AddEditProductPage />} />
            <Route path="/admin/products/:id/edit" element={<AddEditProductPage />} />
        </Routes>
    );
};

export default AdminRoutes;
