import { useState } from "react"
import {showNotification} from "../redux/slices/notificationSlice.js";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import axios from "axios"
import {useDispatch} from "react-redux";

const Contact = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        subject: "",
        message: "",
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post("/api/contact", formData)
            if (response.data.success) {
                dispatch(showNotification({
                    message: 'Message sent successfully! We\'ll get back to you soon.',
                    type: 'success'
                }))

                setFormData({
                    fullName: "",
                    phoneNumber: "",
                    email: "",
                    address: "",
                    subject: "",
                    message: "",
                })
            }
        } catch (error) {
            dispatch(showNotification({
                message: error.response?.data?.message || "Failed to send message",
                type: 'error'
            }))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get in touch with our team for any questions about our products or services. We're here to help!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Phone</h3>
                                    <p className="text-gray-600">+965 2222 3333</p>
                                    <p className="text-gray-600">+965 9999 8888 (WhatsApp)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <p className="text-gray-600">info@metalcosteel.com</p>
                                    <p className="text-gray-600">support@metalcosteel.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Address</h3>
                                    <p className="text-gray-600">Kuwait City, Kuwait</p>
                                    <p className="text-gray-600">Serving all Kuwait governorates</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Business Hours</h3>
                                    <p className="text-gray-600">Sunday - Thursday: 8:00 AM - 6:00 PM</p>
                                    <p className="text-gray-600">Friday: 2:00 PM - 6:00 PM</p>
                                    <p className="text-gray-600">Saturday: 8:00 AM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="font-semibold mb-4">Service Areas</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>• Kuwait City</div>
                                <div>• Hawalli</div>
                                <div>• Ahmadi</div>
                                <div>• Jahra</div>
                                <div>• Mubarak Al-Kabeer</div>
                                <div>• Farwaniya</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
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
                                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="+965 XXXX XXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
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
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Your location in Kuwait"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Subject *</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="Product Inquiry">Product Inquiry</option>
                                    <option value="Installation Service">Installation Service</option>
                                    <option value="Maintenance Request">Maintenance Request</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="General Question">General Question</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="input-field resize-none"
                                    placeholder="Tell us how we can help you..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
