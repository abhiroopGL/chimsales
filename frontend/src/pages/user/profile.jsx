"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { showNotification } from "../../redux/slices/notificationSlice"
import { User, Phone, Mail, MapPin } from "lucide-react"

const Profile = () => {
  const { user } = useSelector((state) => state.authorization)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    address: {
      street: "",
      area: "",
      governorate: "",
      block: "",
      building: "",
      floor: "",
      apartment: "",
    },
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        address: {
          street: user.address?.street || "",
          area: user.address?.area || "",
          governorate: user.address?.governorate || "",
          block: user.address?.block || "",
          building: user.address?.building || "",
          floor: user.address?.floor || "",
          apartment: user.address?.apartment || "",
        },
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call logic here (left as is)
      // Example: await axiosInstance.put("/api/auth/profile", formData)

      dispatch(
        showNotification({
          type: "success",
          message: "Profile updated successfully!",
        })
      )
    } catch (error) {
      dispatch(
        showNotification({
          type: "error",
          message: error.response?.data?.message || "Failed to update profile",
        })
      )
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl text-black mb-2">My Profile</h1>
          <p className="text-gray-600 max-w-xs mb-6 mx-auto text-center lg:mx-0 lg:text-left">
            Manage your account information
          </p>

        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Summary */}
          <section className="bg-gray-100 rounded-lg p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-5">
              <User size={40} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-black">{user?.fullName || user?.name}</h2>
            <p className="flex items-center gap-2 mt-3 text-gray-700">
              <Phone size={18} />
              <span>{user?.phoneNumber || "N/A"}</span>
            </p>
            {user?.email && (
              <p className="flex items-center gap-2 mt-2 text-gray-700">
                <Mail size={18} />
                <span>{user.email}</span>
              </p>
            )}
            <span
              className={`inline-block mt-6 px-4 py-1 rounded-full text-sm font-semibold ${user?.role === "admin"
                ? "bg-purple-200 text-purple-900"
                : "bg-green-200 text-green-900"
                }`}
            >
              {user?.role === "admin" ? "Administrator" : "Customer"}
            </span>
          </section>

          {/* Profile Form */}
          <section className="lg:col-span-2 bg-white rounded-lg p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-2xl mb-6 text-black">Personal Information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-800">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-800">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-800">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={user?.phoneNumber || ""}
                      disabled
                      className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-xl font-semibold mb-6 text-black">
                  <MapPin size={24} />
                  Address Information
                </h4>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="governorate" className="block mb-2 text-sm font-medium text-gray-800">
                      Governorate
                    </label>
                    <select
                      id="governorate"
                      name="address.governorate"
                      value={formData.address.governorate}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
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
                    <label htmlFor="area" className="block mb-2 text-sm font-medium text-gray-800">
                      Area
                    </label>
                    <input
                      id="area"
                      type="text"
                      name="address.area"
                      value={formData.address.area}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Area"
                    />
                  </div>
                  <div>
                    <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-800">
                      Street
                    </label>
                    <input
                      id="street"
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Street"
                    />
                  </div>
                  <div>
                    <label htmlFor="block" className="block mb-2 text-sm font-medium text-gray-800">
                      Block
                    </label>
                    <input
                      id="block"
                      type="text"
                      name="address.block"
                      value={formData.address.block}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Block"
                    />
                  </div>
                  <div>
                    <label htmlFor="building" className="block mb-2 text-sm font-medium text-gray-800">
                      Building
                    </label>
                    <input
                      id="building"
                      type="text"
                      name="address.building"
                      value={formData.address.building}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Building"
                    />
                  </div>
                  <div>
                    <label htmlFor="floor" className="block mb-2 text-sm font-medium text-gray-800">
                      Floor
                    </label>
                    <input
                      id="floor"
                      type="text"
                      name="address.floor"
                      value={formData.address.floor}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Floor"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="apartment" className="block mb-2 text-sm font-medium text-gray-800">
                      Apartment
                    </label>
                    <input
                      id="apartment"
                      type="text"
                      name="address.apartment"
                      value={formData.address.apartment}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Apartment"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-md text-lg font-semibold hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
