const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">About MetalcoSteel</h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Leading Kuwait's chimney and fireplace industry with over a decade of excellence, innovation, and unwavering
                        commitment to quality.
                    </p>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600">
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
                                className="rounded-lg shadow-lg w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
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
                            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Meet the experts behind MetalcoSteel's success</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
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
                            <div key={index} className="text-center">
                                <img
                                    src={member.image || "/placeholder.svg"}
                                    alt={member.name}
                                    className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-gray-600">{member.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "10+", label: "Years of Experience" },
                            { number: "5000+", label: "Happy Customers" },
                            { number: "50+", label: "Product Varieties" },
                            { number: "24/7", label: "Customer Support" },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
