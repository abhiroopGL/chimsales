import AdminNavbar from "../../components/admin/admin-navbar.jsx";
import ProductList from "../../components/admin/product-list.jsx";

const ManageProducts = () => {
    const dummyProducts = [{ id: 1, name: "Chimney X", price: 1299 }]; // replace with API data

    return (
        <>
            <AdminNavbar />
            <div className="p-6 bg-white min-h-screen">
                <h2 className="text-xl font-bold mb-4">Manage Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dummyProducts.map(product => (
                        <ProductList key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ManageProducts;
