import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Star, UtensilsCrossed, QrCode, Users, Clock, AlertCircle } from 'lucide-react';

// Dummy Data
const stats = [
  {
    title: "Today's Revenue",
    value: "₦245,890",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Orders Today",
    value: "48",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Avg Order Value",
    value: "₦5,123",
    change: "-2.1%",
    trend: "down",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.3",
    trend: "up",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

const topSellingItems = [
  { name: "Jollof Rice & Chicken", orders: 28, revenue: "₦84,000", change: "+15%" },
  { name: "Fried Rice Special", orders: 22, revenue: "₦66,000", change: "+8%" },
  { name: "Peppered Chicken", orders: 18, revenue: "₦54,000", change: "+12%" },
  { name: "Goat Meat Pepper Soup", orders: 15, revenue: "₦52,500", change: "-3%" },
  { name: "Plantain & Beans", orders: 12, revenue: "₦30,000", change: "+5%" },
];

const recentOrders = [
  { id: "#ORD-1234", item: "Jollof Rice & Chicken", time: "2 mins ago", status: "preparing", amount: "₦3,000" },
  { id: "#ORD-1233", item: "Fried Rice Special", time: "5 mins ago", status: "completed", amount: "₦3,500" },
  { id: "#ORD-1232", item: "Peppered Chicken", time: "8 mins ago", status: "completed", amount: "₦2,800" },
  { id: "#ORD-1231", item: "Goat Meat Soup", time: "12 mins ago", status: "pending", amount: "₦4,200" },
];

const categoryRevenue = [
  { category: "Main Dishes", amount: 145890, percentage: 59 },
  { category: "Sides", amount: 45000, percentage: 18 },
  { category: "Drinks", amount: 35000, percentage: 14 },
  { category: "Desserts", amount: 20000, percentage: 9 },
];

const peakHours = [
  { hour: "8AM", orders: 5 },
  { hour: "9AM", orders: 8 },
  { hour: "10AM", orders: 12 },
  { hour: "11AM", orders: 18 },
  { hour: "12PM", orders: 35 },
  { hour: "1PM", orders: 42 },
  { hour: "2PM", orders: 28 },
  { hour: "3PM", orders: 15 },
  { hour: "4PM", orders: 10 },
  { hour: "5PM", orders: 22 },
  { hour: "6PM", orders: 38 },
  { hour: "7PM", orders: 45 },
];

const HomePage = () => {
  const maxOrders = Math.max(...peakHours.map(h => h.orders));

  return (
    <div className="min-h-screen bg-gray-50 text-sm tracking-tighter">
      <div className="max-w-7xl mx-auto">


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Peak Hours Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {peakHours.map((hour, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                      style={{ height: `${(hour.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{hour.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
            <div className="space-y-4">
              {categoryRevenue.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₦{cat.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{cat.percentage}% of total</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Selling Items */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topSellingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.revenue}</p>
                    <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="space-y-6">
            {/* QR Code Scans */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <QrCode className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">QR Scans</h3>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">342</p>
              <p className="text-sm text-green-600 font-medium">+23% from yesterday</p>
            </div>

            {/* Active Customers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Now</h3>
                  <p className="text-xs text-gray-500">Browsing menu</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">28</p>
              <p className="text-sm text-gray-600">12 pending orders</p>
            </div>

            {/* Avg Prep Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Avg Prep Time</h3>
                  <p className="text-xs text-gray-500">Today's average</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">18 min</p>
              <p className="text-sm text-green-600 font-medium">-3 min from target</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Orders
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-medium text-gray-600">{order.id}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{order.item}</h4>
                    <p className="text-sm text-gray-500">{order.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">{order.amount}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Attention Required</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• 3 items are running low on stock</li>
                <li>• 2 pending customer feedback responses</li>
                <li>• Table #7 QR code needs replacement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;