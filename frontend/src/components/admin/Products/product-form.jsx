import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../../../redux/slices/productSlice";
import { FiPlus, FiX } from "react-icons/fi"; // Feather icons
import { useNavigate, useParams } from "react-router-dom";
import {showNotification} from "../../../redux/slices/notificationSlice.js";

const categories = ["Kitchen", "Living Room", "Bedroom", "Outdoor"];

const ProductForm = ({ initialData = null }) => {

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        status: "draft",
        images: [],
    });

    const [previewImages, setPreviewImages] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // used in edit mode

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                price: initialData.price || "",
                description: initialData.description || "",
                stock: initialData.stock || "",
                category: initialData.category || "",
                status: initialData.status || "draft",
                images: initialData.images || [], // images will be handled separately
            });
            setPreviewImages(initialData.images || []); // assuming images are URLs
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));

        // Show preview
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setFormData((prev) => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
        setPreviewImages((prev) => {
            const newPreviews = [...prev];
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            if (key === "images" && Array.isArray(value)) {
                for (const img of value) {
                    data.append("images", img);
                }
            } else {
                data.append(key, value);
            }
        }

        try {
            if (initialData) {
                const res = await dispatch(updateProduct({ id: initialData._id, updatedData: data })).unwrap();
                if (res.success) {
                    dispatch(showNotification({
                        message: 'Product updated successfully',
                        type: 'success'
                    }));
                    navigate("/admin/products");
                } else {
                    dispatch(showNotification({
                        message: res.message || 'Failed to update product',
                        type: 'error'
                    }));
                }
            } else {
                const res = await dispatch(createProduct(data)).unwrap();
                if (res.success) {
                    dispatch(showNotification({
                        message: 'Product created successfully',
                        type: 'success'
                    }));
                    navigate("/admin/products");
                } else {
                    dispatch(showNotification({
                        message: res.message || 'Failed to create product',
                        type: 'error'
                    }));
                }
            }
        } catch (error) {
            dispatch(showNotification({
                message: error.message || 'An error occurred while processing your request',
                type: 'error'
            }));
        }

    };

    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none sm:col-span-2"
                        rows={3}
                        required
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock Quantity"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none"
                        required
                    />
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none"
                        required
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                {/* Image Upload Section */}
                <div>
                    <div className="flex flex-wrap gap-4">
                        {previewImages.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                                <img
                                    src={img}
                                    alt={`preview-${idx}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>
                        ))}
                        <label className="w-24 h-24 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-100">
                            <FiPlus size={24} />
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                    {initialData ? "Update Product" : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
