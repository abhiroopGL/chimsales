"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ShoppingCart, ArrowLeft} from "lucide-react"
import { showNotification } from "../../redux/slices/notificationSlice"
import { addToCart } from "../../redux/slices/cartSlice"
import { fetchProductById } from "../../redux/slices/productSlice"
import { FaBolt } from "react-icons/fa"
import ProductDescription from "../../components/product-details/product-description.jsx";

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.authorization)
  

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        dispatch(fetchProductById(id)).then((res) => {
            setProduct(res.payload)
            setLoading(false)
        });
    }, []);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(showNotification({
        type: "error",
        message: "Please login to add items to cart"
      }))
      return
    }
    dispatch(addToCart(product._id))
    dispatch(showNotification({
      type: "success",
      message: `Added ${quantity} item(s) to cart!`
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate("/products")} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images?.[selectedImage] || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-black" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="bg-gray-50 p-6 rounded-lg">
                <ProductDescription description={product.description} />
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-black">{product.price.toFixed(3)} KWD</span>
            </div>

            {/* Category */}
            <div className="mb-6">
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {product.category}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">✗ Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Button */}
            {product.stock > 0 && (
            <div className="flex gap-4 mt-8">
                <button onClick={handleAddToCart} className="w-full btn-primary flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Add to Cart
                </button>
                <button  className="w-full btn-primary flex items-center justify-center gap-2">
                    <FaBolt size={20} />
                    Buy Now
                </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
