import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getAllOrders,
    getSalesStats,
    updateOrderStatus,
    ORDER_STATUS,
    getTopSellingBooks,
    getRevenueByCategory,
    getSalesByDay,
    getTopAuthors,
    getOrdersByCity,
    getCustomerInsights
} from '../lib/orders';
import { getBooks } from '../lib/books';
import { Button } from '../components/ui/Button';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    Plus,
    Edit,
    Trash2,
    X,
    BookOpen,
    Eye,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    MapPin,
    Mail,
    User,
    CreditCard,
    Truck,
    RefreshCw,
    BarChart3,
    AlertCircle,
    PieChart,
    Users,
    Award,
    TrendingDown,
    Percent
} from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('analytics');
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0, avgOrderValue: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Analytics data
    const [topBooks, setTopBooks] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [topAuthors, setTopAuthors] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [customerInsights, setCustomerInsights] = useState({ totalCustomers: 0, repeatCustomers: 0, repeatRate: 0, topCustomers: [] });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [ordersData, booksData, statsData, topBooksData, categoryData, dailyData, authorsData, citiesData, customersData] = await Promise.all([
                getAllOrders(),
                getBooks(),
                getSalesStats(),
                getTopSellingBooks(5),
                getRevenueByCategory(),
                getSalesByDay(7),
                getTopAuthors(5),
                getOrdersByCity(),
                getCustomerInsights()
            ]);
            setOrders(ordersData);
            setBooks(booksData);
            setStats(statsData);
            setTopBooks(topBooksData);
            setCategoryRevenue(categoryData);
            setDailySales(dailyData);
            setTopAuthors(authorsData);
            setCityData(citiesData);
            setCustomerInsights(customersData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    }

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const lowStockBooks = books.filter(b => (b.stock || 0) < 15);

    const StatCard = ({ icon: Icon, label, value, subValue, change, changeType, color, bgColor }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-500'
                        }`}>
                        {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {change}
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
            {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
        </motion.div>
    );

    // Simple Bar Chart Component
    const BarChart = ({ data, maxHeight = 120 }) => {
        const maxValue = Math.max(...data.map(d => d.revenue), 1);
        return (
            <div className="flex items-end justify-between gap-2 h-[140px] pt-4">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <motion.div
                            className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg min-h-[4px]"
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max((item.revenue / maxValue) * maxHeight, 4)}px` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                        <span className="text-xs text-slate-500 mt-2 text-center">{item.date}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Progress Bar Component
    const ProgressBar = ({ value, max, color = 'bg-amber-500' }) => (
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
                className={`h-full ${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
    );

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case ORDER_STATUS.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
            case ORDER_STATUS.CONFIRMED: return 'bg-blue-100 text-blue-700 border-blue-200';
            case ORDER_STATUS.PROCESSING: return 'bg-purple-100 text-purple-700 border-purple-200';
            case ORDER_STATUS.SHIPPED: return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case ORDER_STATUS.DELIVERED: return 'bg-green-100 text-green-700 border-green-200';
            case ORDER_STATUS.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const categoryColors = ['bg-amber-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="w-7 h-7 text-amber-500" />
                                Admin Dashboard
                            </h1>
                            <p className="text-slate-500 text-sm">Analytics, inventory & order management</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">
                                Last updated: {new Date().toLocaleTimeString()}
                            </span>
                            <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 border-b border-slate-200 -mb-px overflow-x-auto">
                        {[
                            { id: 'analytics', label: 'Analytics', icon: PieChart },
                            { id: 'orders', label: 'Orders', icon: ShoppingCart },
                            { id: 'inventory', label: 'Inventory', icon: Package }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-amber-500 text-amber-600 bg-amber-50/50'
                                        : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-36 bg-white animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-8">
                                {/* Main Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={DollarSign}
                                        label="Total Revenue"
                                        value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
                                        change="+12.5%"
                                        changeType="up"
                                        color="text-green-600"
                                        bgColor="bg-green-50"
                                    />
                                    <StatCard
                                        icon={ShoppingCart}
                                        label="Total Orders"
                                        value={stats.totalOrders}
                                        subValue={`${stats.deliveredOrders} delivered`}
                                        change="+8%"
                                        changeType="up"
                                        color="text-blue-600"
                                        bgColor="bg-blue-50"
                                    />
                                    <StatCard
                                        icon={TrendingUp}
                                        label="Avg. Order Value"
                                        value={`₹${Math.round(stats.avgOrderValue).toLocaleString('en-IN')}`}
                                        change="+5%"
                                        changeType="up"
                                        color="text-purple-600"
                                        bgColor="bg-purple-50"
                                    />
                                    <StatCard
                                        icon={Users}
                                        label="Customers"
                                        value={customerInsights.totalCustomers}
                                        subValue={`${customerInsights.repeatRate}% repeat rate`}
                                        color="text-amber-600"
                                        bgColor="bg-amber-50"
                                    />
                                </div>

                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Sales Chart */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">Revenue Trend</h3>
                                                <p className="text-sm text-slate-500">Last 7 days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-800">
                                                    ₹{dailySales.reduce((a, b) => a + b.revenue, 0).toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                                                    <ArrowUpRight className="w-3 h-3" /> +12% from last week
                                                </p>
                                            </div>
                                        </div>
                                        <BarChart data={dailySales} />
                                        <div className="flex justify-between mt-4 text-sm text-slate-500">
                                            <span>{dailySales.reduce((a, b) => a + b.orders, 0)} orders</span>
                                            <span>Avg: ₹{Math.round(dailySales.reduce((a, b) => a + b.revenue, 0) / 7).toLocaleString('en-IN')}/day</span>
                                        </div>
                                    </div>

                                    {/* Category Revenue */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Revenue by Category</h3>
                                        <p className="text-sm text-slate-500 mb-6">Sales distribution</p>
                                        <div className="space-y-4">
                                            {categoryRevenue.map((cat, index) => (
                                                <div key={cat.category}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${categoryColors[index % categoryColors.length]}`} />
                                                            <span className="font-medium text-slate-700">{cat.category}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-bold text-slate-800">₹{cat.revenue.toLocaleString('en-IN')}</span>
                                                            <span className="text-slate-400 text-sm ml-2">({cat.percentage}%)</span>
                                                        </div>
                                                    </div>
                                                    <ProgressBar
                                                        value={cat.percentage}
                                                        max={100}
                                                        color={categoryColors[index % categoryColors.length]}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Second Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Top Selling Books */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Award className="w-5 h-5 text-amber-500" />
                                            <h3 className="text-lg font-bold text-slate-800">Top Selling Books</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {topBooks.map((book, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                            index === 1 ? 'bg-slate-200 text-slate-700' :
                                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-800 text-sm truncate">{book.title}</p>
                                                        <p className="text-xs text-slate-500">{book.totalSold} sold</p>
                                                    </div>
                                                    <span className="font-bold text-amber-600 text-sm">₹{book.revenue.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Authors */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-6">
                                            <BookOpen className="w-5 h-5 text-purple-500" />
                                            <h3 className="text-lg font-bold text-slate-800">Best Authors</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {topAuthors.map((author, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800 text-sm">{author.name}</p>
                                                            <p className="text-xs text-slate-500">{author.booksSold} books sold</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-sm">₹{author.revenue.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Orders by City */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-6">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                            <h3 className="text-lg font-bold text-slate-800">Top Cities</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {cityData.slice(0, 5).map((city, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                            <MapPin className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <span className="font-medium text-slate-700">{city.city}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-800">{city.orders} orders</p>
                                                        <p className="text-xs text-slate-500">₹{city.revenue.toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Insights */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Top Customers */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Users className="w-5 h-5 text-green-500" />
                                            <h3 className="text-lg font-bold text-slate-800">Top Customers</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
                                                        <th className="pb-3">Customer</th>
                                                        <th className="pb-3">Orders</th>
                                                        <th className="pb-3">Spent</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {customerInsights.topCustomers.map((customer, index) => (
                                                        <tr key={index}>
                                                            <td className="py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                                                                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-slate-800 text-sm">{customer.name}</p>
                                                                        <p className="text-xs text-slate-500">{customer.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 font-medium text-slate-700">{customer.orderCount}</td>
                                                            <td className="py-3 font-bold text-amber-600">₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                                            <Percent className="w-8 h-8 mb-2 opacity-80" />
                                            <p className="text-3xl font-bold">{customerInsights.repeatRate}%</p>
                                            <p className="text-amber-100">Repeat Rate</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
                                            <Clock className="w-8 h-8 mb-2 opacity-80" />
                                            <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                                            <p className="text-blue-100">Pending Orders</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                                            <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
                                            <p className="text-3xl font-bold">{stats.deliveredOrders}</p>
                                            <p className="text-green-100">Delivered</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                                            <Package className="w-8 h-8 mb-2 opacity-80" />
                                            <p className="text-3xl font-bold">{books.length}</p>
                                            <p className="text-purple-100">Products</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="p-6 border-b border-slate-100">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search orders..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                        >
                                            <option value="all">All Status</option>
                                            {Object.values(ORDER_STATUS).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Order</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Items</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-slate-50">
                                                    <td className="p-4"><span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">#{order.id.slice(0, 8)}</span></td>
                                                    <td className="p-4"><p className="font-medium text-slate-800">{order.customer?.name}</p></td>
                                                    <td className="p-4">{order.items?.length} items</td>
                                                    <td className="p-4 font-bold text-slate-800">₹{order.total?.toLocaleString('en-IN')}</td>
                                                    <td className="p-4">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(order.status)}`}
                                                        >
                                                            {Object.values(ORDER_STATUS).map(status => (
                                                                <option key={status} value={status}>{status}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-amber-600 rounded-lg">
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Inventory Tab */}
                        {activeTab === 'inventory' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Inventory</h2>
                                        <p className="text-sm text-slate-500">{books.length} books in catalog</p>
                                    </div>
                                    <Button className="gap-2"><Plus className="w-4 h-4" />Add Book</Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Book</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Price</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                                                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {books.map((book) => (
                                                <tr key={book.id} className="hover:bg-slate-50">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-lg" />
                                                            <div>
                                                                <p className="font-medium text-slate-800">{book.title}</p>
                                                                <p className="text-sm text-slate-500">{book.author}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4"><span className="px-3 py-1 bg-slate-100 rounded-full text-sm">{book.category}</span></td>
                                                    <td className="p-4 font-bold text-slate-800">₹{book.price}</td>
                                                    <td className="p-4">
                                                        <span className={`font-medium ${(book.stock || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {book.stock || 0}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-1">
                                                            <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Order Details</h3>
                                    <p className="text-sm text-slate-500 font-mono">#{selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <h4 className="font-semibold mb-2">Customer</h4>
                                    <p>{selectedOrder.customer?.name}</p>
                                    <p className="text-sm text-slate-500">{selectedOrder.customer?.email}</p>
                                    <p className="text-sm text-slate-500">{selectedOrder.customer?.address}, {selectedOrder.customer?.city}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Items</h4>
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
                                            <img src={item.cover} alt={item.title} className="w-10 h-14 object-cover rounded" />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-amber-600">₹{selectedOrder.total}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-slate-50 flex justify-end">
                                <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
