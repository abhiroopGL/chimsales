import ProductForm from "../../components/admin/Products/product-form.jsx";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct, fetchProductById } from "../../redux/slices/productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { showNotification } from "../../redux/slices/notificationSlice.js";

const AddEditProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id)).then((res) => {
                setInitialData(res.payload)
            });
        }
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">{id ? "Edit Product" : "Add New Product"}</h1>
            <ProductForm initialData={initialData} />
        </div>
    );
};

export default AddEditProductPage;
