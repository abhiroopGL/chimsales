// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import { createProduct } from "../../../redux/slices/productSlice.jsx"
// import { useDispatch } from "react-redux";
//
// const categories = ["Kitchen", "Living Room", "Bedroom", "Outdoor"];
//
// const AddProductModal = ({ isOpen, onClose }) => {
//     const [formData, setFormData] = useState({
//         name: "",
//         price: "",
//         description: "",
//         stock: "",
//         category: "",
//         status: "draft",
//         images: [],
//     });
//     const dispatch = useDispatch();
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "images") {
//             setFormData((prev) => ({
//                 ...prev,
//                 images: Array.from(files),
//             }));
//         } else {
//             setFormData((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//
//         const submitFormData = new FormData();
//         submitFormData.append("name", formData.name);
//         submitFormData.append("price", formData.price);
//         submitFormData.append("description", formData.description);
//         submitFormData.append("stock", formData.stock);
//         submitFormData.append("category", formData.category);
//         submitFormData.append("status", formData.status);
//
//         // Append each image file individually
//         formData.images.forEach((image) => {
//             submitFormData.append("images", image);
//         });
//
//         console.log("Submitting FormData:", [...submitFormData.entries()]);
//
//         dispatch(createProduct(submitFormData)).then((data) => {
//             console.log("Created Product:", data);
//             if (data.payload?.success) {
//                 onClose();
//             }
//         });
//     };
//
//
//     return (
//         <AnimatePresence>
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.7 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.7 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 relative"
//                 >
//                     <button
//                         onClick={onClose}
//                         className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
//                     >
//                         &times;
//                     </button>
//                     <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Product Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                             required
//                         />
//                         <input
//                             type="number"
//                             name="price"
//                             placeholder="Price"
//                             value={formData.price}
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                             required
//                         />
//                         <textarea
//                             name="description"
//                             placeholder="Description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                             rows={3}
//                             required
//                         ></textarea>
//                         <input
//                             type="number"
//                             name="stock"
//                             placeholder="Stock Quantity"
//                             value={formData.stock}
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                             required
//                         />
//                         <select
//                             name="category"
//                             value={formData.category}
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                             required
//                         >
//                             <option value="">Select Category</option>
//                             {categories.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                     {cat}
//                                 </option>
//                             ))}
//                         </select>
//                         <select
//                             name="status"
//                             value={formData.status}
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                             required
//                         >
//                             <option value="draft">Draft</option>
//                             <option value="active">Active</option>
//                         </select>
//                         <input
//                             type="file"
//                             name="images"
//                             multiple
//                             accept="image/*"
//                             onChange={handleChange}
//                             className="w-full border rounded-lg p-3 focus:outline-none"
//                         />
//                         <button
//                             type="submit"
//                             className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
//                         >
//                             Add Product
//                         </button>
//                     </form>
//                 </motion.div>
//             </div>
//         </AnimatePresence>
//     );
// };
//
// export default AddProductModal;
