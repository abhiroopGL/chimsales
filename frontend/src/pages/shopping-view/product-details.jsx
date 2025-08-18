"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { showNotification } from "../../redux/slices/notificationSlice"
import { addToCart } from "../../redux/slices/cartSlice.jsx"
import { fetchProductById } from "../../redux/slices/productSlice"
import { FaBolt } from "react-icons/fa"
import ProductDescription from "../../components/product-details/product-description.jsx"
import { createPortal } from "react-dom"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProductById(id)).then((res) => {
      setProduct(res.payload)
      setLoading(false)
    })
  }, [dispatch, id])

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
    dispatch(
      showNotification({
        type: "success",
        message: `Added ${quantity} item(s) to cart!`,
      })
    )
  }

  const handleBookNow = () => {
    dispatch(addToCart({ product, quantity: 1 }))
    dispatch(
      showNotification({
        type: "success",
        message: `Added 1 item to cart!`,
      })
    )
    navigate("/cart")
  }

  const handleZoomOpen = () => setZoomOpen(true)
  const handleZoomClose = () => setZoomOpen(false)

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
        </div>
      </div>
    )
  }

  const images = product.images || []

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side: Product Images */}
          <div>
            <div
              className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-zoom-in"
              onClick={handleZoomOpen}
            >
              <img
                src={images[selectedImage]?.url || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                className="w-full h-[400px] sm:h-[500px] object-contain bg-white"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {images.map((imageObj, index) => (
                  <button
                    key={imageObj.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border-2 transition-colors ${selectedImage === index ? "border-black" : "border-gray-300"
                      }`}
                  >
                    <img
                      src={imageObj.url || "/placeholder.svg"}
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

              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-700 font-semibold flex items-center gap-2">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">✗ Out of Stock</span>
                )}
              </div>

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

      {/* Zoom Modal */}
      {zoomOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center cursor-zoom-out"
            onClick={handleZoomClose}
          >
            <img
              src={images[selectedImage]?.url || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>,
          document.body
        )}
    </div>
  )
}

export default ProductDetail
