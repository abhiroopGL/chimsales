import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, deleteProduct, restoreProduct   } from "../../redux/slices/productSlice.jsx";
import useAppNavigation from '../../hooks/useAppNavigation.jsx';
import AdminNavbar from "../../components/admin/admin-navbar.jsx";
import FilterTabs from "../../components/admin/Products/filter-tabs.jsx";
import ProductCard from "../../components/admin/Products/product-card.jsx";
import { showNotification } from "../../redux/slices/notificationSlice.js";

const ManageProducts = () => {
    const dispatch = useDispatch();
    const { goToAddNewProduct } = useAppNavigation();
    const items = useSelector((state) => state.products.adminProducts);
    const loading = useSelector((state) => state.products.isLoading);
    const filter = useSelector((state) => state.products.filter);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
        dispatch(showNotification({
            message: 'Product deleted successfully',
            type: 'success'
        }))
    };

    const handleRestore = (id) => {
        dispatch(restoreProduct(id));
        dispatch(showNotification({
            message: 'Product restored successfully',
            type: 'success'
        }))
    };


    const handleAddProduct = () => {
        goToAddNewProduct()
        showNotification({
            message: 'Product added successfully',
            type: 'success'
        })
    };

    const filteredItems = items.filter(product => {
        switch (filter) {
            case "published":
                return product.status === "published" && !product.deleted;
            case "draft":
                return product.status === "draft" && !product.deleted;
            case "archived":
                return product.deleted;
            case "all":
                return product;
            default:
                return !product.deleted; // Show all non-deleted products
        }
    });


    return (
        <>
            <AdminNavbar />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Manage Products</h2>
                    <button
                        onClick={handleAddProduct}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Add Product
                    </button>
                </div>
                <FilterTabs />
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {items && filteredItems.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageProducts;
