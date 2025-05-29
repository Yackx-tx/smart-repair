import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServices: 0,
    totalRecords: 0,
    recentRecords: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch cars count
        const carsRes = await axios.get('http://localhost:5000/api/cars');

        // Fetch services count
        const servicesRes = await axios.get('http://localhost:5000/api/services');

        // Fetch service records
        const recordsRes = await axios.get('http://localhost:5000/api/service-records');

        setStats({
          totalCars: carsRes.data.length,
          totalServices: servicesRes.data.length,
          totalRecords: recordsRes.data.length,
          recentRecords: recordsRes.data.slice(0, 5) // Get only the 5 most recent records
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="py-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.fullName || 'User'}
          </h1>
          <p className="text-gray-700">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Link
          to="/reports"
          className="bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Generate Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-800">
          <h2 className="text-gray-800 text-sm font-medium uppercase mb-2">Total Cars</h2>
          <div>
            <p className="text-4xl font-bold text-gray-900">{stats.totalCars}</p>
            <Link to="/cars" className="text-sm text-green-800 font-medium hover:text-green-900 transition duration-300">
              View all cars
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-800">
          <h2 className="text-gray-800 text-sm font-medium uppercase mb-2">Total Services</h2>
          <div>
            <p className="text-4xl font-bold text-gray-900">{stats.totalServices}</p>
            <Link to="/services" className="text-sm text-green-800 font-medium hover:text-green-900 transition duration-300">
              View all services
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-800">
          <h2 className="text-gray-800 text-sm font-medium uppercase mb-2">Service Records</h2>
          <div>
            <p className="text-4xl font-bold text-gray-900">{stats.totalRecords}</p>
            <Link to="/service-records" className="text-sm text-green-800 font-medium hover:text-green-900 transition duration-300">
              View all records
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/cars"
            className="bg-white border border-green-700 text-gray-800 hover:bg-green-50 py-4 px-4 rounded-lg text-center transition duration-300"
          >
            <span className="font-medium">Add New Car</span>
          </Link>

          <Link
            to="/services"
            className="bg-white border border-green-700 text-gray-800 hover:bg-green-50 py-4 px-4 rounded-lg text-center transition duration-300"
          >
            <span className="font-medium">Add New Service</span>
          </Link>

          <Link
            to="/service-records"
            className="bg-white border border-green-700 text-gray-800 hover:bg-green-50 py-4 px-4 rounded-lg text-center transition duration-300"
          >
            <span className="font-medium">Record Service</span>
          </Link>

          <Link
            to="/reports"
            className="bg-white border border-green-700 text-gray-800 hover:bg-green-50 py-4 px-4 rounded-lg text-center transition duration-300"
          >
            <span className="font-medium">Generate Report</span>
          </Link>
        </div>
      </div>

      {/* Recent Service Records */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Service Records</h2>
          <Link to="/service-records" className="text-green-800 hover:text-green-900 font-medium transition duration-300">
            View all
          </Link>
        </div>

        {stats.recentRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Record #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentRecords.map((record, index) => (
                  <tr key={record.RecordNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.RecordNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.PlateNumber}</div>
                      <div className="text-xs text-gray-700">{record.type} {record.Model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-gray-800">
                        {record.ServiceName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{Number(record.AmountPaid).toLocaleString()} RWF</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(record.PaymentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-green-50 rounded-lg">
            <p className="text-gray-800 text-lg">No recent service records found.</p>
            <Link
              to="/service-records"
              className="mt-4 bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Add Service Record
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
