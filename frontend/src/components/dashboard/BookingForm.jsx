import React from 'react';
import { useDispatch } from 'react-redux';
import { setCustomerInfo } from '../../redux/slices/cartSlice';

const BookingForm = ({ onSubmit }) => {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value.trim(),
      email: e.target.email.value.trim(),
      phone: e.target.phone.value.trim(),
      address: e.target.address.value.trim(),
    };
    dispatch(setCustomerInfo(formData));
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-black">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-black bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-black">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border border-black bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-black">
          Phone Number <span className="text-red-600">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border border-black bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="+1234567890"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-black">
          Delivery Address <span className="text-red-600">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-black bg-white px-3 py-2 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="Enter your delivery address"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition duration-200"
      >
        Submit Order Request
      </button>
    </form>
  );
};

export default BookingForm;
