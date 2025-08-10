import Footer from "../../components/footer.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard.jsx";

export default function Dashboard() {
  const products = useSelector((state) => state.products.publicProducts);
  const isLoading = useSelector((state) => state.products.isLoading);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
            <div className="mx-auto max-w-md text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-light mb-6 leading-tight">
                Kuwait's Premier{" "}
                <span className="block font-semibold text-gray-800">Chimney Store</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Professional chimney and fireplace solutions across Kuwait. Quality products, expert installation, and reliable service.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
                <Link
                to="/products"
                className="bg-black text-white px-6 py-3 rounded-md shadow-sm hover:shadow-md transition transform hover:scale-105"
                >
                Shop Now
                </Link>
                <Link
                to="/contact"
                className="border border-black text-black px-6 py-3 rounded-md hover:bg-black hover:text-white transition transform hover:scale-105"
                >
                Get Quote
                </Link>
            </div>
            </div>
            <div className="relative">
            <img
                src="https://www.kuche7.com/Content/images/blogs8/Modular%20kitchen%20chimney.jpg?height=600&width=500"
                alt="Premium chimney installation in Kuwait"
                className="rounded-xl shadow-lg w-full object-cover"
            />
            </div>
        </div>
        </section>


      {/* Featured Products */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light mb-6 text-center">Featured Products</h2>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="text-black border-b border-black hover:text-gray-600 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900">
            Our Services
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Professional Installation",
                description: "Expert installation by certified technicians across all Kuwait governorates",
                icon: "🔧",
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
            ].map((service, idx) => (
              <div
                key={idx}
                className="text-center p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-900">
            Why Choose MetalcoSteel?
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10">
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
            ].map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-5 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
