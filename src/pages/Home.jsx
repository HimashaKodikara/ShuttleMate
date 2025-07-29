import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Video, Users, MapPin, ShoppingBag, Clock, Settings, Bell, Search, Filter, Download, Eye, UserCheck, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  // State for API data
  const [apiData, setApiData] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    totalCourts: 0,
    totalVideos: 0,
    totalShops: 0,
    totalMatches: 0,
    totalItems: 0,
    loading: true,
    error: null
  });

  // Fetch data from all APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setApiData(prev => ({ ...prev, loading: true, error: null }));

        // Define your API endpoints
        const endpoints = {
          users: 'http://localhost:5000/api/user',
          coaches: 'http://localhost:5000/api/Coachers', 
          courts: 'http://localhost:5000/api/courts',
          videos: 'http://localhost:5000/api/videos',
          shops: 'http://localhost:5000/api/shops',
          matches: 'http://localhost:5000/api/matches',
          items: 'http://localhost:5000/api/items'
        };

        // Fetch all data concurrently
        const promises = Object.entries(endpoints).map(async ([key, endpoint]) => {
          try {
            const response = await fetch(endpoint);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${key}: ${response.statusText}`);
            }
            const data = await response.json();
            
            return { 
              key, 
              count: Array.isArray(data) ? data.length : (data.count || data.total || 0) 
            };
          } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            return { key, count: 0 };
          }
        });

        const results = await Promise.all(promises);
        
        // Update state with fetched data
        const newData = { loading: false, error: null };
        results.forEach(({ key, count }) => {
          switch(key) {
            case 'users':
              newData.totalUsers = count;
              break;
            case 'coaches':
              newData.totalCoaches = count;
              break;
            case 'courts':
              newData.totalCourts = count;
              break;
            case 'videos':
              newData.totalVideos = count;
              break;
            case 'shops':
              newData.totalShops = count;
              break;
            case 'matches':
              newData.totalMatches = count;
              break;
            case 'items':
              newData.totalItems = count;
              break;
          }
        });

        setApiData(prev => ({ ...prev, ...newData }));

      } catch (error) {
        console.error('Error fetching data:', error);
        setApiData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load data. Please try again.' 
        }));
      }
    };

    fetchAllData();
  }, []);

  // Static data for charts (you can also fetch this from APIs later)
  const platformStatsData = [
    { name: 'Jan', users: 1200, coaches: 45, courts: 28, revenue: 15000 },
    { name: 'Feb', users: 1450, coaches: 52, courts: 32, revenue: 18500 },
    { name: 'Mar', users: 1680, coaches: 58, courts: 35, revenue: 22000 },
    { name: 'Apr', users: 1920, coaches: 65, courts: 38, revenue: 25500 },
    { name: 'May', users: 2150, coaches: 72, courts: 42, revenue: 28000 },
    { name: 'Jun', users: apiData.totalUsers, coaches: apiData.totalCoaches, courts: apiData.totalCourts, revenue: 31200 }
  ];

  const userEngagementData = [
    { name: 'Video Uploads', value: 45, color: '#3b82f6' },
    { name: 'Coach Bookings', value: 25, color: '#10b981' },
    { name: 'Court Bookings', value: 20, color: '#f59e0b' },
    { name: 'Shop Purchases', value: 10, color: '#ef4444' }
  ];

  const revenueData = [
    { name: 'Mon', coaching: 3200, courts: 1800, shop: 2400, videos: 800 },
    { name: 'Tue', coaching: 3800, courts: 2100, shop: 2200, videos: 900 },
    { name: 'Wed', coaching: 4200, courts: 2300, shop: 2800, videos: 1100 },
    { name: 'Thu', coaching: 3900, courts: 2000, shop: 2600, videos: 950 },
    { name: 'Fri', coaching: 4500, courts: 2500, shop: 3200, videos: 1200 },
    { name: 'Sat', coaching: 5200, courts: 3100, shop: 3800, videos: 1400 },
    { name: 'Sun', coaching: 4800, courts: 2800, shop: 3400, videos: 1300 }
  ];

  // Dynamic admin cards with API data
  const adminCards = [
    {
      id: 1,
      title: 'Total Users',
      value: apiData.loading ? 'Loading...' : apiData.totalUsers.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      trend: 'up',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      title: 'Video Uploads',
      value: apiData.loading ? 'Loading...' : apiData.totalVideos.toLocaleString(),
      change: '+8.3%',
      icon: Video,
      trend: 'up',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 3,
      title: 'Active Coaches',
      value: apiData.loading ? 'Loading...' : apiData.totalCoaches.toLocaleString(),
      change: '+15.4%',
      icon: UserCheck,
      trend: 'up',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 4,
      title: 'Available Courts',
      value: apiData.loading ? 'Loading...' : apiData.totalCourts.toLocaleString(),
      change: '+6.7%',
      icon: MapPin,
      trend: 'up',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      id: 5,
      title: 'Total Matches',
      value: apiData.loading ? 'Loading...' : apiData.totalMatches.toLocaleString(),
      change: '+11.2%',
      icon: Activity,
      trend: 'up',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'uploaded a video', time: '2 min ago', type: 'video' },
    { id: 2, user: 'Sarah Wilson', action: 'booked Coach Mike', time: '5 min ago', type: 'booking' },
    { id: 3, user: 'Alex Chen', action: 'reserved Court A', time: '8 min ago', type: 'court' },
    { id: 4, user: 'Emma Davis', action: 'purchased equipment', time: '12 min ago', type: 'shop' },
    { id: 5, user: 'Michael Brown', action: 'completed session', time: '15 min ago', type: 'session' }
  ];

  // Show error state if needed
  if (apiData.error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{apiData.error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
       <Navbar />

      <div className="p-6">
        {/* Admin Control Panel */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Platform Overview</h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {apiData.loading ? 'Loading...' : 'All Systems Operational'}
            </span>
          </div>
         
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
          {adminCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.id} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {card.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-indigo-50">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.2%
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {apiData.loading ? 'Loading...' : apiData.totalShops.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-gray-900">Total Shops</p>
              <p className="text-xs text-gray-500 mt-1">Active shop listings</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-pink-50">
                <Settings className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.1%
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {apiData.loading ? 'Loading...' : apiData.totalItems.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-gray-900">Total Items</p>
              <p className="text-xs text-gray-500 mt-1">Equipment & accessories</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-50">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex items-center text-sm text-blue-600 font-medium">
                <span>Live Data</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {apiData.loading ? 'Loading...' : new Date().toLocaleTimeString()}
              </p>
              <p className="text-sm font-medium text-gray-900">Last Updated</p>
              <p className="text-xs text-gray-500 mt-1">Real-time sync</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          {/* Platform Growth Chart */}
          <div className="col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Growth & Revenue</h3>
              <div className="flex space-x-2 text-sm">
                <button className="px-3 py-1 text-blue-600 bg-blue-50 rounded-lg font-medium">6M</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg">1Y</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg">All</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={platformStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} name="Total Users" />
                <Line type="monotone" dataKey="coaches" stroke="#10b981" strokeWidth={3} name="Coaches" />
                <Line type="monotone" dataKey="courts" stroke="#f59e0b" strokeWidth={3} name="Courts" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Engagement Pie Chart */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
              <button className="text-blue-600 text-sm hover:underline">View Details</button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userEngagementData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {userEngagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userEngagementData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          <div className="col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue by Service</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Coaching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Courts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Shop</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Videos</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="coaching" stackId="a" fill="#3b82f6" />
                <Bar dataKey="courts" stackId="a" fill="#10b981" />
                <Bar dataKey="shop" stackId="a" fill="#f59e0b" />
                <Bar dataKey="videos" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 text-sm hover:underline flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>View All</span>
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'video' ? 'bg-purple-500' :
                    activity.type === 'booking' ? 'bg-green-500' :
                    activity.type === 'court' ? 'bg-orange-500' :
                    activity.type === 'shop' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Home;