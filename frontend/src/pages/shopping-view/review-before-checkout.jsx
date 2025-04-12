import { useNavigate } from "react-router-dom";

const ReviewBeforeCheckout = () => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-white text-black px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">Review Your Order</h1>

            {/* Product summary component */}
            <div className="border p-6 rounded-lg shadow mb-6">
                <p className="text-xl mb-2">Product Name: Modern Chimney X</p>
                <p className="text-sm text-gray-600">Qty: 1</p>
                <p className="text-sm text-gray-600">Price: $499</p>
            </div>

            <button
                className="bg-black text-white px-6 py-3 rounded hover:bg-white hover:text-black border border-black active:translate-y-1 transition"
                onClick={handleCheckout}
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

export default ReviewBeforeCheckout;
