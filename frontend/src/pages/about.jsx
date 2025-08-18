const About = () => {
    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            {/* Hero Section */}
            <section className="bg-black text-white py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extralight mb-6 tracking-tight">
                        About MetalcoSteel
                    </h1>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Leading Kuwait's chimney and fireplace industry with over a decade of excellence, innovation, and unwavering
                        commitment to quality.
                    </p>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Our Story</h2>
                        <div className="space-y-5 text-gray-700 leading-relaxed text-base max-w-xl">
                            <p>
                                Founded in 2014, MetalcoSteel began as a small family business with a simple mission: to provide
                                Kuwait with the finest chimney and fireplace solutions available. What started as a passion project
                                has grown into Kuwait's most trusted name in the industry.
                            </p>
                            <p>
                                Over the years, we've installed thousands of chimneys and fireplaces across all six governorates of
                                Kuwait, building lasting relationships with homeowners, contractors, and architects who trust our
                                expertise and quality.
                            </p>
                            <p>
                                Today, we continue to innovate and expand our services while maintaining the personal touch and
                                attention to detail that has made us who we are.
                            </p>
                        </div>
                    </div>
                    <div>
                        <img
                            src="/placeholder.svg?height=400&width=600"
                            alt="MetalcoSteel team"
                            className="rounded-lg shadow-lg w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 px-6 bg-gray-50 max-w-7xl mx-auto rounded-lg shadow-md">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">Our Values</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base">
                        The principles that guide everything we do
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Quality First",
                            description:
                                "We never compromise on quality. Every product we sell and every installation we complete meets the highest standards.",
                            icon: "⭐",
                        },
                        {
                            title: "Customer Focus",
                            description:
                                "Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that exceed expectations.",
                            icon: "❤️",
                        },
                        {
                            title: "Innovation",
                            description: "We continuously seek new technologies and methods to improve our products and services.",
                            icon: "💡",
                        },
                    ].map((value, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-5xl mb-5">{value.icon}</div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                            <p className="text-gray-700 text-base">{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">Our Team</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base">
                        Meet the experts behind MetalcoSteel's success
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        {
                            name: "Ahmed Al-Rashid",
                            position: "Founder & CEO",
                            image: "/placeholder.svg?height=300&width=300",
                        },
                        {
                            name: "Sarah Al-Sabah",
                            position: "Head of Operations",
                            image: "/placeholder.svg?height=300&width=300",
                        },
                        {
                            name: "Mohammed Al-Qattan",
                            position: "Lead Installation Engineer",
                            image: "/placeholder.svg?height=300&width=300",
                        },
                    ].map((member, index) => (
                        <div
                            key={index}
                            className="text-center bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-48 h-48 rounded-full mx-auto mb-5 object-cover border-4 border-gray-200"
                            />
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">{member.name}</h3>
                            <p className="text-gray-700">{member.position}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { number: "10+", label: "Years of Experience" },
                            { number: "5000+", label: "Happy Customers" },
                            { number: "50+", label: "Product Varieties" },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-extrabold mb-2">{stat.number}</div>
                                <div className="text-gray-300 text-sm uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 px-6 bg-gray-100">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-900">Find Us on the Map</h2>
                    <p className="text-gray-600 mb-8">
                        Visit our store or get directions to MetalcoSteel in Kuwait.
                    </p>

                    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg relative">
                        {/* Google Map */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.977181047021!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzM0LjAiTiA3MsKwNTInMzkuOSJF!5e0!3m2!1sen!2sin!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

                        {/* ✅ Directions Button - top right */}
                        <button
                            onClick={() =>
                                window.open(
                                    "https://www.google.com/maps/dir/?api=1&destination=19.0760,72.8777",
                                    "_blank"
                                )
                            }
                            className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                            📍 Get Directions
                        </button>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default About
