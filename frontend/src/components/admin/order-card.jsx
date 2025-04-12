const OrderCard = ({ order }) => (
    <div className="p-4 border border-black rounded-xl">
        <p>Order ID: #{order.id}</p>
        <p>User: {order.user}</p>
        <p>Status: <span className="font-semibold">{order.status}</span></p>
    </div>
);

export default OrderCard;
