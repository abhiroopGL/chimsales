import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import { showNotification } from '../../redux/slices/notificationSlice';
import BookingForm from '../../components/dashboard/BookingForm.jsx';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);
    const navigate = useNavigate();

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleQuantityChange = (productId, quantity) => {
        if (quantity < 1) return;
        dispatch(updateQuantity({ productId, quantity }));
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleOrderSubmit = (customerInfo) => {
        dispatch(
            showNotification({
                type: 'success',
                message: 'Order request submitted successfully! Our team will contact you shortly.',
            })
        );
        dispatch(clearCart());
        setShowBookingForm(false);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md text-center">
                    <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-black">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some products to get started!</p>
                    <Link
                        to="/products"
                        className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-900 transition"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
                    <button
                        onClick={handleClearCart}
                        className="text-red-600 hover:text-red-800 text-sm transition"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300 flex flex-col sm:flex-row items-center gap-4"
                            >
                                <img
                                    src={item.image || '/placeholder.svg?height=100&width=100'}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 w-full sm:w-auto">
                                    <h3 className="font-semibold text-lg text-black">{item.name}</h3>
                                    <p className="text-gray-600 text-sm">{/* You can add category if you have it here */}</p>
                                    <p className="text-lg font-bold mt-2">{item.price.toFixed(3)} KWD</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black transition"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black transition"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemoveItem(item.productId)}
                                    className="text-red-600 hover:text-red-800 p-2 transition"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300 sticky top-8">
                            <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>
                            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                                <div className="flex justify-between text-sm">
                                    <span>
                                        Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                                    </span>
                                    <span>{totalAmount.toFixed(3)} KWD</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-gray-800 font-semibold">Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{totalAmount.toFixed(3)} KWD</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/review')}
                                className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition"
                            >
                                Place Order Request
                            </button>
                            <Link
                                to="/products"
                                className="block text-center mt-4 text-gray-600 hover:text-black transition"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Enter Your Details</h3>
                        <BookingForm onSubmit={handleOrderSubmit} />
                        <button
                            onClick={() => setShowBookingForm(false)}
                            className="mt-4 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
