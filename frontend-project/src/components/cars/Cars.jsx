import { useState, useEffect } from 'react';
import axios from 'axios';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    model: '',
    manufacturingYear: '',
    driverPhone: '',
    mechanicName: ''
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const { plateNumber, type, model, manufacturingYear, driverPhone, mechanicName } = formData;

  // Fetch all cars
  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cars');
      setCars(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!plateNumber || !type || !model || !manufacturingYear || !driverPhone || !mechanicName) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cars', formData);

      // Reset form
      setFormData({
        plateNumber: '',
        type: '',
        model: '',
        manufacturingYear: '',
        driverPhone: '',
        mechanicName: ''
      });

      // Show success message
      setSuccess('Car added successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

      // Refresh cars list
      fetchCars();
    } catch (err) {
      console.error('Error adding car:', err);
      setFormError(err.response?.data?.msg || 'Failed to add car');
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
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cars Management</h1>

      {/* Add Car Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Car</h2>

        {formError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            {formError}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-800 text-gray-800 p-4 rounded-md mb-6">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="plateNumber" className="block text-gray-800 text-sm font-medium mb-2">
                Plate Number
              </label>
              <input
                type="text"
                id="plateNumber"
                name="plateNumber"
                value={plateNumber}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. RAD123A"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-800 text-sm font-medium mb-2">
                Car Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                value={type}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. Sedan, SUV, Truck"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="model" className="block text-gray-800 text-sm font-medium mb-2">
                Car Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={model}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. Toyota Corolla"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="manufacturingYear" className="block text-gray-800 text-sm font-medium mb-2">
                Manufacturing Year
              </label>
              <input
                type="number"
                id="manufacturingYear"
                name="manufacturingYear"
                value={manufacturingYear}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. 2020"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="driverPhone" className="block text-gray-800 text-sm font-medium mb-2">
                Driver Phone
              </label>
              <input
                type="text"
                id="driverPhone"
                name="driverPhone"
                value={driverPhone}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. +250 78 123 4567"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="mechanicName" className="block text-gray-800 text-sm font-medium mb-2">
                Mechanic Name
              </label>
              <input
                type="text"
                id="mechanicName"
                name="mechanicName"
                value={mechanicName}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            >
              Add Car
            </button>
          </div>
        </form>
      </div>

      {/* Cars List */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Cars List</h2>
          <div className="text-sm text-gray-700">
            Total: <span className="font-semibold text-green-800">{cars.length}</span> cars
          </div>
        </div>

        {error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-green-50 rounded-lg">
            <p className="text-gray-800 text-lg mb-4">No cars found in the system</p>
            <p className="text-gray-700 text-sm max-w-md text-center mb-6">
              Add your first car using the form above to get started with car repair management.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Driver Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Mechanic
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car, index) => (
                  <tr key={car.PlateNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-800">{car.PlateNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-gray-800">
                        {car.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{car.Model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {car.ManufacturingYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{car.DriverPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {car.MechanicName}
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

export default Cars;
