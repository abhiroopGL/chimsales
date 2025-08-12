"use client"

import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "../../redux/slices/cartSlice.jsx"
import { showNotification } from "../../redux/slices/notificationSlice.js";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()

    const handleAddToCart = (e) => {
        e.preventDefault()
        dispatch(addToCart({ product, quantity: 1 }))
        dispatch(showNotification({
            message: 'Added to cart!',
            type: 'success'
        }))
    }

    return (
        <div className="card hover:shadow-lg hover:scale-105 transition-transform transition-shadow duration-300 ease-in-out">
            <Link to={`/item/${product._id}`}>
                <img
                    src={product.images?.[0] || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{product.price.toFixed(3)} KWD</span>
                    <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2 text-sm">
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>
            </Link>
        </div>
    )

}

export default ProductCard
