import { useState } from "react";
import { showNotification } from "../redux/slices/notificationSlice.js";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import axiosInstance from "../api/axios-instance.js";
import { useDispatch } from "react-redux";

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        subject: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Contact form data:", formData);
            const response = await axiosInstance.post("/api/queries", formData);
            console.log("Contact form response:", response);
            if (response.data.success) {
                dispatch(
                    showNotification({
                        message: "Message sent successfully! We'll get back to you soon.",
                        type: "success",
                    })
                );

                setFormData({
                    fullName: "",
                    phoneNumber: "",
                    email: "",
                    address: "",
                    subject: "",
                    message: "",
                });
            }
        } catch (error) {
            dispatch(
                showNotification({
                    message: error.response?.data?.message || "Failed to send message",
                    type: "error",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                        Get in touch with our team for any questions about our products or
                        services. We're here to help!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <div className="space-y-10">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Get in Touch</h2>

                        {[
                            {
                                icon: <Phone size={22} />,
                                title: "Phone",
                                lines: ["+965 2222 3333", "+965 9999 8888 (WhatsApp)"],
                            },
                            {
                                icon: <Mail size={22} />,
                                title: "Email",
                                lines: ["info@metalcosteel.com", "support@metalcosteel.com"],
                            },
                            {
                                icon: <MapPin size={22} />,
                                title: "Address",
                                lines: ["Kuwait City, Kuwait", "Serving all Kuwait governorates"],
                            },
                            {
                                icon: <Clock size={22} />,
                                title: "Business Hours",
                                lines: [
                                    "Sunday - Thursday: 8:00 AM - 6:00 PM",
                                    "Friday: 2:00 PM - 6:00 PM",
                                    "Saturday: 8:00 AM - 4:00 PM",
                                ],
                            },
                        ].map(({ icon, title, lines }, i) => (
                            <div key={i} className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-black text-white rounded-lg flex items-center justify-center shadow-md">
                                    {icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                                    {lines.map((line, idx) => (
                                        <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Service Areas */}
                        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Areas</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-gray-700 text-sm leading-relaxed">
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
                    <div className="bg-gray-50 rounded-lg shadow-md p-8">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phoneNumber">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="+965 XXXX XXXX"
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                        placeholder="example@mail.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Your location in Kuwait"
                                        className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subject">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    required
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Tell us how we can help you..."
                                    className="w-full rounded-md border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
