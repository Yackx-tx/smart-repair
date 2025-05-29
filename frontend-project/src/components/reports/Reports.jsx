import { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);
    
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/daily?date=${reportDate}`);
      setReportData(res.data);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateChange = (e) => {
    setReportDate(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    generateReport();
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString() + ' RWF';
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle print with proper styling
  const handlePrint = () => {
    const printContent = document.getElementById('report-content');
    const originalContents = document.body.innerHTML;
    
    const printStyles = `
      <style>
        @media print {
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h2, h3 { margin-top: 20px; }
          .print-header { text-align: center; margin-bottom: 20px; }
          .report-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .signature-section { margin-top: 50px; }
          .signature-line { border-top: 1px solid #000; width: 200px; display: inline-block; margin-top: 70px; }
          .signature-container { display: flex; justify-content: space-between; margin-top: 50px; }
          .signature-box { text-align: center; }
        }
      </style>
    `;
    
    if (printContent) {
      document.body.innerHTML = printStyles + `
        <div class="print-header">
          <h1>Daily Report: ${formatDate(reportData?.summary?.date)}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      ` + printContent.innerHTML;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      
      {/* Report Generator Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Daily Report</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label htmlFor="reportDate" className="block text-gray-800 text-sm font-medium mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="reportDate"
              name="reportDate"
              value={reportDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
          <span className="ml-3 text-gray-700">Generating report...</span>
        </div>
      )}
      
      {/* Report Results */}
      {reportData && !loading && (
        <div id="report-content" className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Daily Report: {formatDate(reportData.summary?.date)}
            </h2>
            
            <button
              onClick={handlePrint}
              className="bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Print Report
            </button>
          </div>
          
          {/* Detailed Records */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Detailed Records</h3>
            {!reportData.records || reportData.records.length === 0 ? (
              <p className="text-gray-700">No records found for this date.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border">
                        Record #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border">
                        Plate Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border">
                        Car Type/Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border">
                        Amount Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider border">
                        Received By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.records.map((record, index) => (
                      <tr key={record.RecordNumber || record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border">
                          {record.RecordNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800 border">
                          {record.PlateNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border">
                          {record.type || 'N/A'} / {record.Model || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border">
                          {record.ServiceName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border">
                          {formatCurrency(record.AmountPaid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border">
                          {record.ReceivedBy || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="mt-16">
            <div className="flex justify-between">
              <div className="text-center">
                <div className="border-t border-gray-400 w-48 mt-16"></div>
                <p className="mt-2 text-sm text-gray-700">Prepared By</p>
              </div>
              
              <div className="text-center">
                <div className="border-t border-gray-400 w-48 mt-16"></div>
                <p className="mt-2 text-sm text-gray-700">Approved By</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
