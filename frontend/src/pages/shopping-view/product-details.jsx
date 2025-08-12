"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { showNotification } from "../../redux/slices/notificationSlice"
import { addToCart } from "../../redux/slices/cartSlice.jsx"
import { fetchProductById } from "../../redux/slices/productSlice"
import { FaBolt } from "react-icons/fa"
import ProductDescription from "../../components/product-details/product-description.jsx"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    dispatch(fetchProductById(id)).then((res) => {
      setProduct(res.payload)
      setLoading(false)
    })
  }, [dispatch, id])

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(
      showNotification({
        type: "success",
        message: `Added ${quantity} item(s) to cart!`,
      })
    );
  };

  const handleBookNow = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(
      showNotification({
        type: "success",
        message: `Added ${quantity} item(s) to cart!`,
      })
    );
    navigate("/cart");
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-black">Product not found</h2>
          {/* <button
            onClick={() => navigate("/products")}
            className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-900 transition"
          >
            Back to Products
          </button> */}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side: Product Images */}
          <div>
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={product.images?.[selectedImage] || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                className="w-full h-[400px] sm:h-[500px] object-contain bg-white"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border-2 transition-colors ${selectedImage === index ? "border-black" : "border-gray-300"
                      }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-4 text-black">{product.name}</h1>

              <div className="mb-6 text-gray-700 leading-relaxed">
                <ProductDescription description={product.description} />
              </div>

              {/* <div className="mb-6 flex flex-wrap gap-3">
                <span className="text-3xl font-bold text-black">
                  {product.price.toFixed(3)} KWD
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {product.category}
                </span>
              </div> */}

              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-700 font-semibold flex items-center gap-2">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">✗ Out of Stock</span>
                )}
              </div>

              {/* Optional Extra Info: SKU, Brand, Warranty (if available in product) */}
              <div className="text-gray-600 text-sm space-y-1 mb-6">
                {product.sku && (
                  <p>
                    <span className="font-semibold">SKU: </span>
                    {product.sku}
                  </p>
                )}
                {product.brand && (
                  <p>
                    <span className="font-semibold">Brand: </span>
                    {product.brand}
                  </p>
                )}
                {product.warranty && (
                  <p>
                    <span className="font-semibold">Warranty: </span>
                    {product.warranty}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-4 rounded-md font-semibold flex items-center justify-center gap-3 hover:bg-gray-900 transition"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBookNow}
                  className="flex-1 bg-white border border-black text-black py-4 rounded-md font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition"
                >
                  <FaBolt size={24} />
                  Book Now
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
