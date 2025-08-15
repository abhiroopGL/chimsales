import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../../../redux/slices/productSlice";
import { FiPlus, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "../../../redux/slices/notificationSlice.js";

const categories = [
    'Wall-Mounted',
    'Island',
    'Built-In',
    'Downdraft',
    'Ceiling-Mounted'
];

const ProductForm = ({ initialData = null }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        status: "draft",
        featured: false, // ✅ New field
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                price: initialData.price || "",
                description: initialData.description || "",
                stock: initialData.stock || "",
                category: initialData.category || "",
                status: initialData.status || "draft",
                featured: initialData.featured || false, // ✅ Load from API
            });
            setExistingImages(initialData.images || []);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    const removeImage = (index, isExisting = true) => {
        if (isExisting) {
            const removed = existingImages[index];
            setImagesToDelete(prev => [...prev, removed.id]);
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setNewImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
            data.append(key, value)
        );

        newImages.forEach(file => data.append("images", file));
        if (imagesToDelete.length > 0) {
            data.append("imagesToDelete", JSON.stringify(imagesToDelete));
        }

        try {
            let res;
            if (initialData) {
                res = await dispatch(updateProduct({ id: initialData.id, updatedData: data })).unwrap();
            } else {
                res = await dispatch(createProduct(data)).unwrap();
            }

            if (res.success) {
                dispatch(showNotification({
                    message: initialData ? "Product updated" : "Product created",
                    type: "success"
                }));
                navigate("/admin");
            } else {
                dispatch(showNotification({
                    message: res.message || "Operation failed",
                    type: "error"
                }));
            }
        } catch (err) {
            dispatch(showNotification({
                message: err.message || "Server error",
                type: "error"
            }));
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none" required />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none" required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none sm:col-span-2" rows={3} required />
                    <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none" required />

                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none">
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none" required>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>

                    {/* ✅ Featured Checkbox */}
                    <label className="flex items-center gap-2 sm:col-span-2">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                        />
                        Featured Product
                    </label>
                </div>

                {/* Image upload & preview */}
                <div className="flex flex-wrap gap-4 mt-4">
                    {existingImages.map((img, idx) => (
                        <div key={img.id} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                            <img src={img.url} alt={`existing-${idx}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(idx, true)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
                                <FiX size={16} />
                            </button>
                        </div>
                    ))}

                    {newImages.map((file, idx) => (
                        <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                            <img src={URL.createObjectURL(file)} alt={`new-${idx}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(idx, false)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
                                <FiX size={16} />
                            </button>
                        </div>
                    ))}

                    <label className="w-24 h-24 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-100">
                        <FiPlus size={24} />
                        <input type="file" name="images" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>

                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                    {initialData ? "Update Product" : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
