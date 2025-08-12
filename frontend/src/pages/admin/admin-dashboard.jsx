import { useState } from "react";
import {
  Users, Package, FileText, MessageSquare, ShoppingCart, DollarSign, CalendarDays
} from "lucide-react";

import UsersTab from "./dashboard-tabs/users.jsx";
import ProductsTab from "./dashboard-tabs/productsTab.jsx";
import OrdersTab from "./dashboard-tabs/ordersTab.jsx";
import QueryTab from "./dashboard-tabs/query-tab.jsx";
import InvoicesTab from "./dashboard-tabs/invoicesTab.jsx";
import BookingsTab from "./dashboard-tabs/bookingsTab.jsx"; // new import

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}>
            {change > 0 ? "+" : ""}{change}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors 
      ${activeTab === id ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-100"}`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const stats = {
    totalUsers: 156,
    totalProducts: 24,
    totalOrders: 89,
    totalRevenue: 12450.5,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" change={12} />
          <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="bg-green-500" change={8} />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-purple-500" change={-3} />
          <StatCard title="Revenue" value={`${stats.totalRevenue.toFixed(3)} KWD`} icon={DollarSign} color="bg-yellow-500" change={15} />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton id="users" label="Users" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="products" label="Products" icon={Package} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="bookings" label="Bookings" icon={CalendarDays} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="orders" label="Orders" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="queries" label="Queries" icon={MessageSquare} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="invoices" label="Invoices" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "queries" && <QueryTab />}
          {activeTab === "invoices" && <InvoicesTab />}
          {activeTab === "bookings" && <BookingsTab />} {/* render bookings tab */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
