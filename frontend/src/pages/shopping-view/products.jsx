import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { showNotification } from "../../redux/slices/notificationSlice";
import { fetchPublicProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice.jsx";

const Products = () => {
  const dispatch = useDispatch();
  const { publicProducts, isLoading } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  // const handleFilterChange = (key, value) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(
      showNotification({
        type: "success",
        message: "Added to cart!",
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our complete range of premium chimney and fireplace solutions</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : publicProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transform hover:scale-105 transition-transform duration-300"
                style={{ width: "100%" }}
              >
                <Link to={`/item/${product.id}`} className="block p-4">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                </Link>
                <div className="flex justify-between items-center px-4 pb-4">
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
  );
};
export default Products;
