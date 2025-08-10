import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { clearCart, removeFromCart, updateCart } from "../../redux/slices/cartSlice.jsx"

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items } = useSelector((state) => state.cart)
    const products = useSelector((state) => state.products.publicProducts)

    const cartItemsWithDetails = items.map(item => {
        const product = products.find(p => p._id === item.product)
        return { ...item, product }
    })

    const total = cartItemsWithDetails.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    )

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            dispatch(removeFromCart(productId))
        } else {
            dispatch(updateCart({ productId, quantity: newQuantity }))
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

    if (cartItemsWithDetails.length === 0) {
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
        )
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
                        {cartItemsWithDetails.map((item) => (
                            <div
                                key={item.product._id}
                                className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300 flex flex-col sm:flex-row items-center gap-4"
                            >
                                <img
                                    src={item.product.images?.[0] || "/placeholder.svg?height=100&width=100"}
                                    alt={item.product.name}
                                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 w-full sm:w-auto">
                                    <Link
                                        to={`/item/${item.product._id}`}
                                        className="font-semibold text-lg text-black hover:underline hover:text-gray-700 transition-colors duration-200"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <p className="text-gray-600 text-sm">{item.product.category}</p>
                                    <p className="text-lg font-bold mt-2">{item.product.price.toFixed(3)} KWD</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black transition"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black transition"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.product._id)}
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
                                        Subtotal ({cartItemsWithDetails.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                                        items)
                                    </span>
                                    <span>{total.toFixed(3)} KWD</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="text-gray-800 font-semibold">Free</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{total.toFixed(3)} KWD</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition"
                            >
                                Proceed to Checkout
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
        </div>
    )
}

export default Cart
