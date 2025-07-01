import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { removeFromCart, updateQuantity, clearCart } from "../../redux/slices/cartSlice.js"

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items } = useSelector((state) => state.cart)
    const products = useSelector((state) => state.products.publicProducts)

    const cartItemsWithDetails = items.map(item => {
        const product = products.find(p => p.id === item.productId || p.id === item.product._id);
        return {
            ...item,
            product, // This will include price, name, etc.
        };
    });

    console.log("Cart items with details:", cartItemsWithDetails)

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            dispatch(removeFromCart(productId))
        } else {
            dispatch(updateQuantity({ productId, quantity: newQuantity }))
        }
    }

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId))
    }

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    const handleCheckout = () => {
        navigate("/review")
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Add some products to get started!</p>
                        <Link to="/products" className="btn-primary">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <button onClick={handleClearCart} className="text-red-600 hover:text-red-800 text-sm">
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItemsWithDetails.map((item) => (
                            <div key={item.product._id} className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.product.images?.[0] || "/placeholder.svg?height=100&width=100"}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                                        <p className="text-gray-600 text-sm">{item.product.category}</p>
                                        <p className="text-lg font-bold mt-2">{item.product.price.toFixed(3)} KWD</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.product._id)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span>{total.toFixed(3)} KWD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{total.toFixed(3)} KWD</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleCheckout} className="w-full btn-primary">
                                Proceed to Checkout
                            </button>
                            <Link to="/products" className="block text-center mt-4 text-gray-600 hover:text-black">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
