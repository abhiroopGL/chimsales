"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
// import { toast } from "react-hot-toast"
import { showNotification } from "../../redux/slices/notificationSlice"
import { User, Phone, Mail, MapPin } from "lucide-react"
import axios from "axios"
import axiosInstance from "../../api/axios-instance"

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
      const response = await axiosInstance.put("/api/auth/profile", formData)

      if (response.data.success) {
        dispatch(showNotification({
          type: "success",
          message: "Profile updated successfully!",
        }))
      }
    } catch (error) {
      dispatch(showNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile",
      }))
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600 flex items-center justify-center gap-2 mt-2">
                  <Phone size={16} />
                  {user?.phoneNumber}
                </p>
                {user?.email && (
                  <p className="text-gray-600 flex items-center justify-center gap-2 mt-1">
                    <Mail size={16} />
                    {user.email}
                  </p>
                )}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-4 ${
                    user?.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Personal Information</h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="text" value={user?.phoneNumber} className="input-field bg-gray-100" disabled />
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Address Information
              </h4>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Governorate</label>
                  <select
                    name="address.governorate"
                    value={formData.address.governorate}
                    onChange={handleInputChange}
                    className="input-field"
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
                  <label className="block text-sm font-medium mb-2">Area</label>
                  <input
                    type="text"
                    name="address.area"
                    value={formData.address.area}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Block</label>
                  <input
                    type="text"
                    name="address.block"
                    value={formData.address.block}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Building</label>
                  <input
                    type="text"
                    name="address.building"
                    value={formData.address.building}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Floor</label>
                  <input
                    type="text"
                    name="address.floor"
                    value={formData.address.floor}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Apartment</label>
                  <input
                    type="text"
                    name="address.apartment"
                    value={formData.address.apartment}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
