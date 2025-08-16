import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, Plus, RotateCcw } from "lucide-react";
import {
    fetchAdminProducts,
    deleteProduct,
    restoreProduct,
    setFilter
} from "../../../redux/slices/productSlice.jsx";
import { showNotification } from "../../../redux/slices/notificationSlice.js";
import useAppNavigation from "../../../hooks/useAppNavigation.jsx";
import FilterTabs from "../../../components/admin/Products/filter-tabs.jsx";


const ProductsTab = () => {
    const dispatch = useDispatch();
    const { goToEditProduct, goToAddNewProduct } = useAppNavigation();

    const { adminProducts: products, isLoading: loading, filter } = useSelector(
        (state) => state.products
    );

    const truncate = (text, maxLength = 30) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        dispatch(deleteProduct(id)).then(() => {
            dispatch(showNotification({ message: "Product deleted successfully", type: "success" }));
            dispatch(fetchAdminProducts()); // Refresh products after deletion
        });
    };

    const handleRestore = (id) => {
        dispatch(restoreProduct(id, dispatch)).then(() => {
            dispatch(showNotification({ message: "Product restored successfully", type: "success" }));
        });
    };

    const filteredItems = products.filter((product) => {
        switch (filter) {
            case "published":
                return product.status === "published" && !product.deleted;
            case "draft":
                return product.status === "draft" && !product.deleted;
            case "archived":
                return product.deleted;
            default:
                return !product.deleted;
        }
    });

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            </div>
        );
    }
    debugger
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Products Management</h2>
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={goToAddNewProduct}
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            <FilterTabs onChange={(newFilter) => dispatch(setFilter(newFilter))} />

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto mt-4">
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
                        {filteredItems.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-left font-medium text-gray-900">
                                    {truncate(product.name, 30)}
                                </td>
                                <td className="px-6 py-4 text-left text-sm text-gray-600 capitalize">
                                    {truncate(product.category, 20)}
                                </td>
                                <td className="px-6 py-4 text-left text-sm text-gray-600 whitespace-nowrap">
                                    {product.price.toFixed(3)} KWD
                                </td>
                                <td className="px-6 py-4 text-left text-sm text-gray-600 whitespace-nowrap">
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 text-left">
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
                                <td className="px-6 py-4 text-left text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            className="text-green-600 hover:text-green-800"
                                            aria-label={`Edit ${product.name}`}
                                            onClick={() => goToEditProduct(product.id)}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {filter === "archived" ? (
                                            <button
                                                onClick={() => handleRestore(product.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                                aria-label={`Restore ${product.name}`}
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-800"
                                                aria-label={`Delete ${product.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card/List View */}
            <div className="sm:hidden space-y-4 mt-4">
                {filteredItems.map((product) => (
                    <div key={product._id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{truncate(product.name, 30)}</h3>
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
                        <p className="text-sm text-gray-600 capitalize mb-1">
                            Category: {truncate(product.category, 20)}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">Price: {product.price.toFixed(3)} KWD</p>
                        <p className="text-sm text-gray-600 mb-3">Stock: {product.stock}</p>

                        <div className="flex gap-4">
                            <button
                                className="text-green-600 hover:text-green-800"
                                aria-label={`Edit ${product.name}`}
                                onClick={() => goToEditProduct(product._id)}
                            >
                                <Edit size={20} />
                            </button>
                            {filter === "archived" ? (
                                <button
                                    onClick={() => handleRestore(product._id)}
                                    className="text-blue-600 hover:text-blue-800"
                                    aria-label={`Restore ${product.name}`}
                                >
                                    <RotateCcw size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="text-red-600 hover:text-red-800"
                                    aria-label={`Delete ${product.name}`}
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsTab;
