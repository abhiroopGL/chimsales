import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Search, ShoppingCart } from "lucide-react"
import { showNotification } from "../../redux/slices/notificationSlice"
import { fetchPublicProducts } from "../../redux/slices/productSlice"
import { addToCart } from "../../redux/slices/cartSlice.jsx"

const Products = () => {
  const dispatch = useDispatch()
  const { publicProducts, isLoading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.authorization)

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  })

  useEffect(() => {
    dispatch(fetchPublicProducts())
  }, [dispatch])

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }))
//   }

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      dispatch(showNotification({
        type: "error",
        message: "Please login to add items to cart"
      }))
      return
    }
    dispatch(addToCart({ product, quantity: 1 }))
    dispatch(showNotification({
      type: "success",
      message: "Added to cart!"
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our complete range of premium chimney and fireplace solutions</p>
        </div>

        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="input-field lg:w-48"
            >
              <option value="">All Categories</option>
              <option value="chimney">Chimneys</option>
              <option value="fireplace">Fireplaces</option>
              <option value="accessories">Accessories</option>
              <option value="parts">Parts</option>
            </select>
          </div>
        </div> */}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : publicProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicProducts.map((product) => (
              <div key={product._id} className="card hover:shadow-lg transition-shadow">
                <Link to={`/item/${product._id}`}>
                  <img
                    src={product.images?.[0] || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{product.price.toFixed(3)} KWD</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
