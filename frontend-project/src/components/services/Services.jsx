import { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    serviceCode: '',
    serviceName: '',
    servicePrice: ''
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { serviceCode, serviceName, servicePrice } = formData;
  
  // Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!serviceCode || !serviceName || !servicePrice) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/services', formData);
      
      // Reset form
      setFormData({
        serviceCode: '',
        serviceName: '',
        servicePrice: ''
      });
      
      // Show success message
      setSuccess('Service added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      // Refresh services list
      fetchServices();
    } catch (err) {
      console.error('Error adding service:', err);
      setFormError(err.response?.data?.msg || 'Failed to add service');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-800">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Services Management</h1>
      
      {/* Add Service Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Service</h2>
        
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-800 text-gray-800 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label htmlFor="serviceCode" className="block text-gray-800 text-sm font-medium mb-2">
                Service Code
              </label>
              <input
                type="text"
                id="serviceCode"
                name="serviceCode"
                value={serviceCode}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. ENG001"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="serviceName" className="block text-gray-800 text-sm font-medium mb-2">
                Service Name
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={serviceName}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. Engine repair"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="servicePrice" className="block text-gray-800 text-sm font-medium mb-2">
                Service Price (RWF)
              </label>
              <input
                type="number"
                id="servicePrice"
                name="servicePrice"
                value={servicePrice}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. 150000"
              />
            </div>
          </div>
          
          <div className="mt-2">
            <button
              type="submit"
              className="bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
      
      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Services List</h2>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-green-50 rounded-lg">
            <p className="text-gray-800 text-lg mb-4">No services found.</p>
            <p className="text-gray-700 text-sm max-w-md text-center">
              Add your first service using the form above to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Service Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Price (RWF)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service, index) => (
                  <tr key={service.ServiceCode} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800">
                      {service.ServiceCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {service.ServiceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {Number(service.ServicePrice).toLocaleString()} RWF
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
