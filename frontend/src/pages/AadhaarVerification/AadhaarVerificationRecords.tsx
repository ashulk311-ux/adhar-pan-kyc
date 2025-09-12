import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  IdentificationIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface VerificationRecord {
  _id: string;
  batchId: string;
  status: string;
  createdAt: string;
  processedAt?: string;
    aadhaarNumber: string;
    name: string;
  dateOfBirth: string;
    gender: string;
  address?: string;
  pinCode?: string;
  state?: string;
    district?: string;
  careOf?: string;
  photo?: string;
  verificationDetails?: {
    apiResponse?: any;
    verificationDate?: string;
    remarks?: string;
    source?: string;
    confidence?: number;
    dataMatch?: boolean;
    nameMatch?: boolean;
    dobMatch?: boolean;
    genderMatch?: boolean;
    addressMatch?: boolean;
    transactionId?: string;
    fullAddress?: string;
    careOf?: string;
    photo?: string;
    emailHash?: string;
    mobileHash?: string;
    yearOfBirth?: string;
    shareCode?: string;
  };
  processingTime?: number;
  errorMessage?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AadhaarVerificationRecords: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNext: false,
    hasPrev: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load verification records
  const loadRecords = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3002/api'}/aadhaar-verification/records`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalRecords: data.data.length,
          hasNext: false,
          hasPrev: false
        });
      } else {
        toast.error(data.message || 'Failed to load verification records');
      }
    } catch (error) {
      console.error('Error loading verification records:', error);
      toast.error('Failed to load verification records');
    } finally {
      setIsLoading(false);
    }
  };

  // Load records on component mount
  useEffect(() => {
    loadRecords();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'expired':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'otp_sent':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'otp_sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'failed':
        return 'Failed';
      case 'expired':
        return 'Expired';
      case 'otp_sent':
        return 'OTP Sent';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const handlePageChange = (page: number) => {
    loadRecords(page);
  };

  const handleViewDetails = (record: VerificationRecord) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative p-6 bg-white rounded-full shadow-2xl border-4 border-white/50 transform group-hover:scale-110 transition-transform duration-300">
                <IdentificationIcon className="w-16 h-16 text-blue-600" />
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-pulse">
            📋 Verification Records
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            🔍 View your complete Aadhaar verification history with detailed information and status tracking
          </p>
          
          {/* Back to Verification Button */}
          <button
            onClick={() => navigate('/aadhaar-verification')}
            className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ArrowLeftIcon className="w-6 h-6 mr-3 relative z-10" />
            <span className="relative z-10 text-lg">Back to Verification</span>
          </button>
        </div>

        {/* Records Table */}
        <div className="bg-white/95 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                  <div className="relative p-4 bg-white rounded-full shadow-xl">
                    <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                </div>
                <span className="text-xl font-semibold text-gray-600">Loading verification records...</span>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gray-300 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative p-8 bg-white rounded-full shadow-xl mx-auto w-32 h-32 flex items-center justify-center">
                  <IdentificationIcon className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No verification records found</h3>
              <p className="text-lg text-gray-500 mb-8">You haven't performed any Aadhaar verifications yet.</p>
              <button
                onClick={() => navigate('/aadhaar-verification')}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <span className="mr-2">🚀</span>
                  Start Verification
                </span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-max divide-y divide-gray-200" id="aadhaarTable" style={{ minWidth: '1200px' }}>
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-gradient-to-r from-blue-50 to-purple-50 z-10">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                          Aadhaar Number
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider sticky left-32 bg-gradient-to-r from-blue-50 to-purple-50 z-10">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                          Name
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Status
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Date
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          Gender
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                          Date Of Birth
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          District
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          State
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                          Address
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Care Of
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                          Photo
                        </span>
                      </th>
                      <th className="px-4 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {records.map((record, index) => (
                      <tr key={record._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.01]">
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-bold text-gray-900 font-mono sticky left-0 bg-white z-10">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                            {record.aadhaarNumber ? 
                              record.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : 
                              '-'
                            }
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-semibold text-gray-900 sticky left-32 bg-white z-10">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800">
                            {record.name || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(record.status)}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {getStatusText(record.status)}
                            </span>
                            </div>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                          {formatDate(record.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                            {record.gender === 'M' ? 'Male' : record.gender === 'F' ? 'Female' : 'Other'}
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800">
                            {record.dateOfBirth || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800">
                            {record.district || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            {record.state || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-6 text-sm font-semibold text-gray-900 max-w-xs">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-cyan-800">
                            {record.address ? 
                              (record.address.length > 30 ? record.address.substring(0, 30) + '...' : record.address) 
                              : '-'
                            }
                          </span>
                        </td>
                        <td className="px-4 py-6 text-sm font-semibold text-gray-900 max-w-xs truncate">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                            {record.careOf || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm text-gray-900">
                          {record.photo ? (
                            <img 
                              src={`data:image/jpeg;base64,${record.photo}`} 
                              alt="Photo" 
                              className="w-12 h-16 object-cover rounded border-2 border-green-200 shadow-sm"
                            />
                          ) : (
                            <span className="w-12 h-16 bg-gray-200 rounded border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-500">-</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleViewDetails(record)}
                            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <EyeIcon className="w-4 h-4 mr-2 relative z-10" />
                            <span className="relative z-10">View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                {records.map((record, index) => (
                  <div key={record._id} className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-end mb-3">
                      <div className="flex items-center">
                        {getStatusIcon(record.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="mb-2">
                        <span className="text-gray-500 font-semibold">Aadhaar Number:</span>
                        <span className="ml-2 font-bold text-indigo-600 font-mono">
                          {record.aadhaarNumber ? 
                            record.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : 
                            '-'
                          }
                      </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500 font-semibold">Name:</span>
                        <span className="ml-2 font-bold text-pink-600">{record.name || '-'}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="ml-1 font-medium">{record.gender === 'M' ? 'Male' : record.gender === 'F' ? 'Female' : 'Other'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">DOB:</span>
                        <span className="ml-1 font-medium">{record.dateOfBirth || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">State:</span>
                        <span className="ml-1 font-medium">{record.state || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Care Of:</span>
                        <span className="ml-1 font-medium">{record.careOf || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Photo:</span>
                        <span className="ml-1 font-medium">
                          {record.photo ? (
                            <img 
                              src={`data:image/jpeg;base64,${record.photo}`} 
                              alt="Photo" 
                              className="w-8 h-12 object-cover rounded border border-gray-300"
                            />
                          ) : (
                            <span className="w-8 h-12 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-500">-</span>
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    {/* Address Section */}
                    {record.address && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 font-semibold block mb-1">Address:</span>
                        <div className="text-sm text-gray-700 font-medium">
                          {record.address.length > 50 ? record.address.substring(0, 50) + '...' : record.address}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>Date: {formatDate(record.createdAt)}</span>
                      </div>
                      {record.aadhaarNumber && (
                        <div>
                          <span className="text-gray-500">Aadhaar:</span>
                          <span className="ml-1 font-mono">
                            {record.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                          </span>
                        </div>
                      )}
                      <div className="pt-2">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-6 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">← Previous</span>
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">Next →</span>
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-700">
                        📄 Showing page <span className="font-bold text-blue-600">{pagination.currentPage}</span> of{' '}
                        <span className="font-bold text-purple-600">{pagination.totalPages}</span> 
                        <span className="ml-2 text-sm font-semibold text-gray-600">({pagination.totalRecords} total records)</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-xl shadow-lg space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10">← Previous</span>
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10">Next →</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Record Details Modal */}
        {showDetails && selectedRecord && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Verification Details</h3>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Status and Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1 flex items-center">
                        {getStatusIcon(selectedRecord.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                          {getStatusText(selectedRecord.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created At</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRecord.createdAt)}</p>
                    </div>
                    
                    {selectedRecord.processedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Processed At</label>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRecord.processedAt)}</p>
                      </div>
                    )}
                    
                    {selectedRecord.processingTime && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Processing Time</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.processingTime}ms</p>
                      </div>
                    )}
                    
                  </div>

                  {/* Aadhaar Information */}
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Aadhaar Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                          <p className="mt-1 text-sm text-gray-900 font-mono">
                          {selectedRecord.aadhaarNumber ? 
                            selectedRecord.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : 
                              '-'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.name || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.gender === 'M' ? 'Male' : selectedRecord.gender === 'F' ? 'Female' : 'Other'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.dateOfBirth || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">District</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.district || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.state || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.pinCode || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.address || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Care Of</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.careOf || '-'}</p>
                        </div>
                      {selectedRecord.photo && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Photo</label>
                          <div className="mt-1">
                            <img 
                              src={`data:image/jpeg;base64,${selectedRecord.photo}`} 
                              alt="Aadhaar Photo" 
                              className="w-24 h-32 object-cover border rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Details */}
                  {selectedRecord.verificationDetails && (
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Verification Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRecord.verificationDetails.source && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Source</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedRecord.verificationDetails.source}</p>
                          </div>
                        )}
                        {selectedRecord.verificationDetails.confidence && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Confidence</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedRecord.verificationDetails.confidence}%</p>
                          </div>
                        )}
                        {selectedRecord.verificationDetails.dataMatch !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Data Match</label>
                            <div className="mt-1 flex items-center">
                              {selectedRecord.verificationDetails.dataMatch ? (
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircleIcon className="w-4 h-4 text-red-500" />
                              )}
                              <span className="ml-1 text-sm text-gray-900">
                                {selectedRecord.verificationDetails.dataMatch ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        )}
                        {selectedRecord.verificationDetails.remarks && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Remarks</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedRecord.verificationDetails.remarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleCloseDetails}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AadhaarVerificationRecords;
