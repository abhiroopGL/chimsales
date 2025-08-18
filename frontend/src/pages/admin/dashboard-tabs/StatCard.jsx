import {
  Users, Package, FileText, MessageSquare, ShoppingCart, DollarSign, CalendarDays
} from "lucide-react";


const Stats = ({ title, value, icon: Icon, color, change }) => (
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


const StatCard = ({ stats }) => {

  if (!stats) return <p className="text-center mt-10">Loading stats...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Stats title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
      <Stats title="Total Products" value={stats.totalProducts} icon={Package} color="bg-green-500" />
      <Stats title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-purple-500" />
      <Stats title="Revenue" value={`${stats.totalRevenue.toFixed(3)} KWD`} icon={DollarSign} color="bg-yellow-500" />
    </div>
  )
}

export default StatCard;