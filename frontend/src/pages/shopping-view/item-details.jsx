import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBolt, FaHeart } from 'react-icons/fa';
import Footer from "../../components/footer.jsx";
import ImageSection from "../../components/product-details/image-section.jsx";
import ProductInfo from "../../components/product-details/product-info.jsx";
import ProductDescription from "../../components/product-details/product-description.jsx";
import ProductReviews from "../../components/product-details/product-reviews.jsx";
import useAppNavigation from "../../hooks/useAppNavigation.jsx";
import { fetchProductById } from "../../redux/slices/productSlice.jsx";
import { useDispatch } from "react-redux";
import {addToCart} from "../../redux/slices/cartSlice.jsx";

const ItemDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { goToReview } = useAppNavigation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductById(id)).then((res) => {
            setProduct(res.payload)
        });
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-16 h-16 border-4 border-black rounded-full border-t-transparent"
                />
            </div>
        );
    }

    const handleBuyNow = () => {
        goToReview();
    };

    const handleAddToCart = () => {
        dispatch(addToCart(product)); // `product` should be the product object you're displaying
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-black"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="mb-6 px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                    <span>←</span> Back
                </motion.button>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ImageSection images={product.images} />
                    </motion.div>

                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-start">
                            <ProductInfo name={product.name} price={product.price} />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <FaHeart
                                    className={`text-2xl ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
                                />
                            </motion.button>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <ProductDescription description={product.description} />
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <ProductReviews />
                        </div>

                        <div className="flex gap-4 mt-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors"
                            >
                                <FaShoppingCart /> Add to Cart
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBuyNow}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors"
                            >
                                <FaBolt /> Buy Now
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </motion.div>
    );
};

export default ItemDetails;