import ProductForm from "../../components/admin/Products/product-form.jsx";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct, fetchProductById } from "../../redux/slices/productSlice"; // adjust if needed
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AddEditProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        if (id) {
            // TODO: Fetch the product details and set it
            // Example:
            // dispatch(getProduct(productId)).then((res) => setInitialData(res.payload.product));
            dispatch(fetchProductById(id)).then((res) => {
                console.log("Response for edit:", res.payload);
                setInitialData(res.payload)
            });
        }
    }, [id]);

    const handleSubmit = (formData) => {
        if (id) {
            dispatch(updateProduct({ id: id, data: formData })).then(() => {
                navigate("/admin/products");
            });
        } else {
            dispatch(createProduct(formData)).then(() => {
                navigate("/admin/products");
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">{id ? "Edit Product" : "Add New Product"}</h1>
            <ProductForm initialData={initialData} onSubmit={handleSubmit} />
        </div>
    );
};

export default AddEditProductPage;
