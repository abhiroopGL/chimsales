import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { showNotification } from "../../redux/slices/notificationSlice"
import { MapPin, Phone, CreditCard, Truck } from "lucide-react"
import { clearCart } from "../../redux/slices/cartSlice.jsx"
import axiosInstance from "../../api/axios-instance"

const Review = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)
  const user = useSelector((state) => state.authorization.user)
  const products = useSelector((state) => state.products.publicProducts)

  const cartItemsWithDetails = items.map(item => {
      const product = products.find(p => p._id === item.product);
      return {
          ...item,
          product, // This will include price, name, etc.
      };
  });
  console.log("Cart items with details:", cartItemsWithDetails)
  const total = cartItemsWithDetails.reduce(
  (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  );

  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      street: user?.address?.street || "",
      area: user?.address?.area || "",
      governorate: user?.address?.governorate || "",
      block: user?.address?.block || "",
      building: user?.address?.building || "",
      floor: user?.address?.floor || "",
      apartment: user?.address?.apartment || "",
    },
    paymentMethod: "cash",
    notes: "",
  })

  console.log("Order data:", orderData);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("deliveryAddress.")) {
      const addressField = name.split(".")[1]
      setOrderData((prev) => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value,
        },
      }))
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    
    try {
      const orderPayload = {
        items: cartItemsWithDetails.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
      }

      console.log("Placing order with payload:", orderPayload)

      const response = await axiosInstance.post("/api/orders", orderPayload);
      console.log("Order response:", response.data)

      if (response.data.success) {
        // dispatch(clearCart())
        toast.success("Order placed successfully!")
        dispatch(showNotification({
          type: "success",
          message: "Order placed successfully!",
        }))
        navigate("/")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      dispatch(showNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to place order",
      }))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review Your Order</h1>
          <p className="text-gray-600">Please review your order details before placing your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Phone size={20} />
                Customer Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{user?.fullName}</span>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{user?.phoneNumber}</span>
                </div>
                {user?.email && (
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Address
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Governorate *</label>
                  <select
                    name="deliveryAddress.governorate"
                    value={orderData.deliveryAddress.governorate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Governorate</option>
                    <option value="Kuwait City">Kuwait City</option>
                    <option value="Hawalli">Hawalli</option>
                    <option value="Ahmadi">Ahmadi</option>
                    <option value="Jahra">Jahra</option>
                    <option value="Mubarak Al-Kabeer">Mubarak Al-Kabeer</option>
                    <option value="Farwaniya">Farwaniya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area *</label>
                  <input
                    type="text"
                    name="deliveryAddress.area"
                    value={orderData.deliveryAddress.area}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Street</label>
                  <input
                    type="text"
                    name="deliveryAddress.street"
                    value={orderData.deliveryAddress.street}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Block</label>
                  <input
                    type="text"
                    name="deliveryAddress.block"
                    value={orderData.deliveryAddress.block}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Building</label>
                  <input
                    type="text"
                    name="deliveryAddress.building"
                    value={orderData.deliveryAddress.building}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Floor</label>
                  <input
                    type="text"
                    name="deliveryAddress.floor"
                    value={orderData.deliveryAddress.floor}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Apartment</label>
                  <input
                    type="text"
                    name="deliveryAddress.apartment"
                    value={orderData.deliveryAddress.apartment}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={orderData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded mr-3 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💵</span>
                    </div>
                    <span>Cash on Delivery</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black opacity-50">
                  <input type="radio" name="paymentMethod" value="card" disabled className="mr-3" />
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💳</span>
                    </div>
                    <span>Credit/Debit Card (Coming Soon)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <textarea
                name="notes"
                value={orderData.notes}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Any special instructions for delivery or installation..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">{(item.product.price * item.quantity).toFixed(3)} KWD</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{total.toFixed(3)} KWD</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{total.toFixed(3)} KWD</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Truck size={16} />
                  <span className="font-medium">Free Delivery</span>
                </div>
                <p className="text-sm text-blue-700">Estimated delivery: 2-3 business days</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !orderData.deliveryAddress.governorate || !orderData.deliveryAddress.area}
                className="w-full btn-primary"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review
