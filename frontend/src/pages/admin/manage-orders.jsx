import AdminNavbar from "../../components/admin/admin-navbar.jsx";
import OrderCard from "../../components/admin/order-card.jsx";

const ManageOrders = () => {
    const orders = [
        { id: 101, user: "Bob", status: "In Transit" },
        { id: 102, user: "Eva", status: "Delivered" },
    ];

    return (
        <>
            <AdminNavbar />
            <div className="p-6 bg-white min-h-screen">
                <h2 className="text-xl font-bold mb-4">Orders</h2>
                <div className="space-y-4">
                    {orders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            </div>
        </>
    );
};

export default ManageOrders;
