import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios-instance.js";
import {
  Users, Package, FileText, MessageSquare, ShoppingCart, DollarSign, CalendarDays
} from "lucide-react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import UsersTab from "./dashboard-tabs/users.jsx";
import ProductsTab from "./dashboard-tabs/productsTab.jsx";
import OrdersTab from "./dashboard-tabs/ordersTab.jsx";
import QueryTab from "./dashboard-tabs/query-tab.jsx";
import InvoicesTab from "./dashboard-tabs/invoicesTab.jsx";
import BookingsTab from "./dashboard-tabs/bookingsTab.jsx";
import StatCard from "./dashboard-tabs/StatCard.jsx";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
  const [activeTab, setActiveTab] = useState(() => {
    // Get saved tab from localStorage, fallback to "bookings"
    return localStorage.getItem("adminActiveTab") || "bookings";
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get("/api/admin/stats")
      .then(res => setStats(res.data.data))
      .catch(err => console.warn(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  if (!stats) return <p className="text-center mt-10">Loading stats...</p>;

  // const pieData = [
  //   { name: "Users", value: stats.totalUsers },
  //   { name: "Products", value: stats.totalProducts },
  //   { name: "Orders", value: stats.totalOrders },
  //   { name: "Revenue", value: stats.totalRevenue },
  // ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce platform</p>
        </div>

        {/* Stats */}
        <StatCard stats={stats} />

        {/* Pie Chart */}
        {/* IN CASE WE WANT PIE CHART, JUST UNCOMMENT IT. */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div> */}

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
          {activeTab === "bookings" && <BookingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
