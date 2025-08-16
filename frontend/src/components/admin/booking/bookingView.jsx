import React, { useState } from "react";

const statusOptions = ["pending", "confirmed", "cancelled"];

const BookingView = ({ booking, onClose, onStatusUpdate }) => {
    const [status, setStatus] = useState(booking.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>

                <div className="mb-2"><strong>Booking #:</strong> {booking.bookingNumber}</div>

                <div className="mb-2">
                    <strong>Status:</strong>
                    <select
                        className="ml-2 border rounded px-2 py-1"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2"><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}</div>
                <div className="mb-2"><strong>Customer Name:</strong> {booking.customerFullName}</div>
                <div className="mb-2"><strong>Phone:</strong> {booking.customerPhone}</div>
                <div className="mb-2"><strong>Email:</strong> {booking.customerEmail}</div>
                <div className="mb-4"><strong>Total:</strong> {booking.total.toFixed(3)} KWD</div>

                <div className="mb-4">
                    <strong>Products:</strong>
                    <ul className="mt-2 space-y-2">
                        {booking.items && booking.items.length > 0 ? (
                            booking.items.map((item, idx) => {
                                const prod = item.product;
                                return (
                                    <li key={idx} className="border rounded p-2 flex gap-3 items-center">
                                        {prod?.imageUrl && (
                                            <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-cover rounded" />
                                        )}
                                        <div>
                                            <div><strong>Name:</strong> {prod?.name || "Unknown Product"}</div>
                                            <div><strong>Quantity:</strong> {item.quantity}</div>
                                            <div><strong>Price:</strong> {item.price} KWD</div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li>No products found.</li>
                        )}
                    </ul>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => onStatusUpdate(booking.id, status)}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-200 px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingView;
