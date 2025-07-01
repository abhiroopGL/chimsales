import HeroBanner from "../../components/dashboard/hero-banner.jsx";
import FilterChips from "../../components/dashboard/filter-chips.jsx";
import ItemCardsGrid from "../../components/dashboard/item-cards-grid.jsx";
import SuggestedCarousel from "../../components/dashboard/suggested-carousel.jsx";
import Footer from "../../components/footer.jsx";
import LoggedInUser from "../../components/dashboard/loggedInUser.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import ProductCard from "../../components/common/ProductCard.jsx";

export default function Dashboard() {


    const products = useSelector(state => state.products.publicProducts);
    const isLoading = useSelector(state => state.products.isLoading);

    // return (
    //     <div className="bg-white min-h-screen text-black">
    //         {
    //             !isLoggedIn && (
    //                 <HeroBanner />
    //             )
    //         }
    //         <div className="flex justify-between items-center px-6 py-4">
    //             <FilterChips />
    //             <LoggedInUser />
    //         </div>
    //         <ItemCardsGrid />
    //         <SuggestedCarousel />
    //         <Footer />
    //     </div>
    // );
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                Kuwait's Premier
                                <span className="block text-gray-300">Chimney Store</span>
                            </h1>
                            <p className="text-xl mb-8 text-gray-300 max-w-lg">
                                Professional chimney and fireplace solutions across Kuwait. Quality products, expert installation, and
                                reliable service.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/products" className="btn-primary bg-white text-black hover:bg-gray-100">
                                    Shop Now
                                </Link>
                                <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-black">
                                    Get Quote
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://www.kuche7.com/Content/images/blogs8/Modular%20kitchen%20chimney.jpg?height=600&width=500"
                                alt="Premium chimney installation in Kuwait"
                                className="rounded-lg shadow-2xl w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our most popular chimney and fireplace solutions, trusted by Kuwait homeowners
                        </p>
                    </div>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/products" className="btn-primary">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive chimney and fireplace services throughout Kuwait
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Professional Installation",
                                description: "Expert installation by certified technicians across all Kuwait governorates",
                                icon: "🔧",
                            },
                            {
                                title: "Maintenance & Cleaning",
                                description: "Regular maintenance services to keep your chimney operating safely",
                                icon: "🧹",
                            },
                            {
                                title: "Repair Services",
                                description: "Quick and reliable repair services for all types of chimneys",
                                icon: "⚡",
                            },
                            {
                                title: "Custom Solutions",
                                description: "Tailored chimney solutions designed for your home's needs",
                                icon: "🏠",
                            },
                        ].map((service, index) => (
                            <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose MetalcoSteel?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Trusted by thousands of Kuwait residents for quality, reliability, and professional service
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Kuwait's Leading Experts",
                                description: "Over 10 years of experience serving Kuwait homes and businesses",
                            },
                            {
                                title: "Quality Guaranteed",
                                description: "Premium products with comprehensive warranties and quality assurance",
                            },
                            {
                                title: "Fast Delivery",
                                description: "Quick delivery across Kuwait City, Hawalli, Ahmadi, and all governorates",
                            },
                            {
                                title: "Professional Support",
                                description: "Arabic and English customer support with expert technical guidance",
                            },
                        ].map((reason, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                                    <p className="text-gray-600">{reason.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
