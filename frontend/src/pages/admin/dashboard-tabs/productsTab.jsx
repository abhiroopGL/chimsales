import {
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react"

const ProductsTab = ({ data }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Products Management</h2>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.price.toFixed(3)} KWD</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.status === "published"
                                            ? "bg-green-100 text-green-800"
                                            : product.status === "draft"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button className="text-blue-600 hover:text-blue-800" aria-label={`View ${product.name}`}>
                                            <Eye size={16} />
                                        </button>
                                        <button className="text-green-600 hover:text-green-800" aria-label={`Edit ${product.name}`}>
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem("products", product._id)}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label={`Delete ${product.name}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card/List View */}
            <div className="sm:hidden space-y-4">
                {data.products.map((product) => (
                    <div key={product._id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.status === "published"
                                    ? "bg-green-100 text-green-800"
                                    : product.status === "draft"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {product.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize mb-1">Category: {product.category}</p>
                        <p className="text-sm text-gray-600 mb-1">Price: {product.price.toFixed(3)} KWD</p>
                        <p className="text-sm text-gray-600 mb-3">Stock: {product.stock}</p>

                        <div className="flex gap-4">
                            <button className="text-blue-600 hover:text-blue-800" aria-label={`View ${product.name}`}>
                                <Eye size={20} />
                            </button>
                            <button className="text-green-600 hover:text-green-800" aria-label={`Edit ${product.name}`}>
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => handleDeleteItem("products", product._id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete ${product.name}`}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductsTab;