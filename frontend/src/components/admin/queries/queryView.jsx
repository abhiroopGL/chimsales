"use client";

import { useState } from "react";
import { X } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Process": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
};

const QueryView = ({ query, onClose, onStatusChange, updatingId }) => {
  const [localStatus, setLocalStatus] = useState(query.status);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    await onStatusChange(query._id, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold">Query Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 text-sm sm:text-base">
          <div>
            <h3 className="font-semibold mb-2">Full Name</h3>
            <p>{query.fullName}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Phone Number</h3>
            <p>{query.phoneNumber}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Subject</h3>
            <p>{query.subject}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Message</h3>
            <p className="whitespace-pre-wrap">{query.message}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <select
              value={localStatus}
              onChange={handleChange}
              disabled={updatingId === query._id}
              className="border rounded px-3 py-2 text-base w-full max-w-xs"
            >
              <option value="Pending">Pending</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
            </select>
            <span
              className={`inline-flex mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                statusColors[localStatus] || ""
              }`}
            >
              {localStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryView;
