import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from "../../components/footer.jsx";
import ImageSection from "../../components/product-details/image-section.jsx";
import ProductInfo from "../../components/product-details/product-info.jsx";
import ProductDescription from "../../components/product-details/product-description.jsx";
import ProductReviews from "../../components/product-details/product-reviews.jsx";
import useAppNavigation from "../../hooks/useAppNavigation.jsx";
import {fetchProductById} from "../../redux/slices/productSlice.jsx";
import {useDispatch} from "react-redux";

const ItemDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const {goToReview} = useAppNavigation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductById(id)).then((res) => {
            setProduct(res.payload)
        });

    }, []);

    if (!product) return <div className="text-center p-8">Loading product...</div>;
    const handleBuyNow = () => {
        goToReview();
    };

    return (
        <div className="min-h-screen bg-white text-black p-6">
            <div className="mb-6 flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
                >
                    ← Back
                </button>
            </div>
            {/*<header className="mb-10 text-4xl font-bold text-center">Chimney Store</header>*/}

            <div className="grid md:grid-cols-2 gap-10">
                <ImageSection images={product.images} />

                <div className="space-y-6">
                    <ProductInfo name={product.name} price={product.price} />
                    <ProductDescription description={product.description} />
                    <ProductReviews />

                    <button className="mt-4 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-white hover:text-black border border-black active:translate-y-[2px] transition mx-2">
                        Add to Cart
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="mt-4 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-white hover:text-black border border-black active:translate-y-[2px] transition">
                        Buy Now
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ItemDetails;
