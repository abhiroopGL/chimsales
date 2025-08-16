import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../redux/slices/notificationSlice";
import { MapPin, CreditCard, Truck } from "lucide-react";
import { clearCart } from "../../redux/slices/cartSlice.jsx";
import axiosInstance from "../../api/axios-instance";

const Review = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const cartItemsWithDetails = items;

  // Calculate total price
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryAddress: {
      street: "",
      area: "",
      governorate: "",
      block: "",
      building: "",
      floor: "",
      apartment: "",
    },
    paymentMethod: "cash",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("deliveryAddress.")) {
      const addressField = name.split(".")[1];
      setOrderData((prev) => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value,
        },
      }));
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!orderData.fullName.trim()) {
      dispatch(showNotification({ type: "error", message: "Full Name is required" }));
      return;
    }
    if (!orderData.phone.trim()) {
      dispatch(showNotification({ type: "error", message: "Phone is required" }));
      return;
    }
    if (!orderData.deliveryAddress.governorate) {
      dispatch(showNotification({ type: "error", message: "Governorate is required" }));
      return;
    }
    if (!orderData.deliveryAddress.area.trim()) {
      dispatch(showNotification({ type: "error", message: "Area is required" }));
      return;
    }

    setLoading(true);

    try {
      const bookingPayload = {
        fullName: orderData.fullName,
        email: orderData.email,
        phone: orderData.phone,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        total,
        deliveryStreet: orderData.deliveryAddress.street,
        deliveryArea: orderData.deliveryAddress.area,
        deliveryGovernorate: orderData.deliveryAddress.governorate,
        deliveryBlock: orderData.deliveryAddress.block,
        deliveryBuilding: orderData.deliveryAddress.building,
        deliveryFloor: orderData.deliveryAddress.floor,
        deliveryApartment: orderData.deliveryAddress.apartment,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
      };

      const response = await axiosInstance.post("/api/booking", bookingPayload);

      if (response.data.success) {
        dispatch(clearCart());
        dispatch(
          showNotification({
            type: "success",
            message: "Booking placed successfully!",
          })
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Error placing booking:", error);
      dispatch(
        showNotification({
          type: "error",
          message: error.response?.data?.message || "Failed to place booking",
        })
      );
    } finally {
      setLoading(false);
    }
  };


  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-black sm:text-2xl xs:text-xl">
            Review Your Book Request
          </h1>
          <p className="text-gray-600">
            Please provide your delivery details before submitting your book request
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                Customer Information
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-gray-900">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={orderData.fullName}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderData.phone}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                    required
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={orderData.email}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                    placeholder="Your email (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                <MapPin size={20} />
                Delivery Address
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-900">
                {/* governorate */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Governorate <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="deliveryAddress.governorate"
                    value={orderData.deliveryAddress.governorate}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
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
                {/* area */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Area <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress.area"
                    value={orderData.deliveryAddress.area}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                    required
                  />
                </div>
                {/* street */}
                <div>
                  <label className="block text-sm font-medium mb-2">Street</label>
                  <input
                    type="text"
                    name="deliveryAddress.street"
                    value={orderData.deliveryAddress.street}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                  />
                </div>
                {/* block */}
                <div>
                  <label className="block text-sm font-medium mb-2">Block</label>
                  <input
                    type="text"
                    name="deliveryAddress.block"
                    value={orderData.deliveryAddress.block}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                  />
                </div>
                {/* building */}
                <div>
                  <label className="block text-sm font-medium mb-2">Building</label>
                  <input
                    type="text"
                    name="deliveryAddress.building"
                    value={orderData.deliveryAddress.building}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                  />
                </div>
                {/* floor */}
                <div>
                  <label className="block text-sm font-medium mb-2">Floor</label>
                  <input
                    type="text"
                    name="deliveryAddress.floor"
                    value={orderData.deliveryAddress.floor}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                  />
                </div>
                {/* apartment */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Apartment</label>
                  <input
                    type="text"
                    name="deliveryAddress.apartment"
                    value={orderData.deliveryAddress.apartment}
                    onChange={handleInputChange}
                    className="input-field bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                <CreditCard size={20} />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border-2 border-gray-400 rounded-lg cursor-pointer hover:border-black">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={orderData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-black rounded mr-3 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💵</span>
                    </div>
                    <span>Cash on Delivery</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border-2 border-gray-400 rounded-lg cursor-not-allowed opacity-50">
                  <input type="radio" name="paymentMethod" value="card" disabled className="mr-3" />
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded mr-3 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💳</span>
                    </div>
                    <span>Credit/Debit Card (Coming Soon)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300">
              <h2 className="text-xl font-semibold mb-4 text-black">Order Notes</h2>
              <textarea
                name="notes"
                value={orderData.notes}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none bg-white border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 w-full"
                placeholder="Any special instructions for delivery or installation..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">{(item.unitPrice * item.quantity).toFixed(3)} KWD</span>
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
                  <span className="text-gray-700 font-semibold">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{total.toFixed(3)} KWD</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 p-3 bg-gray-200 rounded-lg">
                <div className="flex items-center gap-2 text-gray-900 mb-2">
                  <Truck size={16} />
                  <span className="font-medium">Free Delivery</span>
                </div>
                <p className="text-sm text-gray-800">Estimated delivery: 2-3 business days</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={
                  loading ||
                  !orderData.fullName.trim() ||
                  !orderData.phone.trim() ||
                  !orderData.deliveryAddress.governorate ||
                  !orderData.deliveryAddress.area.trim()
                }
                className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 disabled:opacity-50 transition"
              >
                {loading ? "Placing Request..." : "Place Book Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
