import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../redux/slices/productSlice.jsx";
import useAppNavigation from '../../hooks/useAppNavigation.jsx';
import AdminNavbar from "../../components/admin/admin-navbar.jsx";
import FilterTabs from "../../components/admin/Products/filter-tabs.jsx";
import ProductCard from "../../components/admin/Products/product-card.jsx";

const ManageProducts = () => {
    const dispatch = useDispatch();
    const { goToAddNewProduct } = useAppNavigation();
    const items = useSelector((state) => state.products.allProducts);
    const loading = useSelector((state) => state.products.isLoading);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
    };

    const handleAddProduct = () => {
        goToAddNewProduct()
    };

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
                        {items && items.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageProducts;
