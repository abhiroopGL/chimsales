import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EditProduct = () => {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        images: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setProduct((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle product update here
        alert("Product updated successfully!");
        navigate("/admin/products");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-white text-black px-6 py-10 md:px-20"
        >
            <h2 className="text-3xl font-bold mb-8 text-center">Edit Product</h2>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 rounded bg-white text-black focus:outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-400 px-4 py-2 rounded bg-white text-black focus:outline-none focus:border-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="w-full border border-gray-400 px-4 py-2 rounded bg-white text-black focus:outline-none focus:border-black"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Upload Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full"
                    />
                    {product.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {product.images.map((img, idx) => (
                                <div key={idx} className="aspect-square border border-black p-1 overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ backgroundColor: "black", color: "white" }}
                    transition={{ duration: 0.3 }}
                    type="submit"
                    className="w-full py-3 rounded border border-black bg-white text-black font-semibold"
                >
                    Save Changes
                </motion.button>
            </form>
        </motion.div>
    );
};

export default EditProduct;
