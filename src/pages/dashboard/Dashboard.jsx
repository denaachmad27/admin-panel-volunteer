import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null); // ✅ REMOVE - tidak digunakan

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Loading dashboard data...');
      
      // Use dashboard service - ini SELALU return mock data jika API gagal
      const statsData = await dashboardService.getStats();
      console.log('Dashboard data loaded:', statsData);
      
      setDashboardData(statsData.data);
      // setError(null); // ✅ REMOVE - tidak digunakan
    } catch (err) {
      console.error('Dashboard error:', err); // ✅ USE error variable
      
      // Jika error, gunakan mock data sebagai fallback
      const mockData = {
        total_users: 1248,
        total_programs: 24,
        total_complaints: 89,
        total_news: 156,
        pending_applications: 15,
        active_programs: 18
      };
      
      setDashboardData(mockData);
      // setError(null); // ✅ REMOVE
      console.log('Using mock data as fallback:', mockData);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Always render dashboard
  console.log('Rendering DashboardLayout with data:', dashboardData);
  return <DashboardLayout data={dashboardData} />;
};

export default Dashboard;