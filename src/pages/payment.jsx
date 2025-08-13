import React, { useState, useEffect } from 'react';
import PaymentTable from '../components/Payments/PaymentTable';
import { CreditCard, AlertCircle, RefreshCw, Filter, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPayments, setTotalPayments] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        succeeded: 0,
        pending: 0,
        failed: 0,
        canceled: 0,
        refunded: 0
    });

    // Fetch payments from API
    const fetchPayments = async (status = '') => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = new URLSearchParams({
                limit: '100',
                skip: '0'
            });
            
            if (status) {
                queryParams.append('status', status);
            }
            
            console.log('Fetching payments with URL:', `http://localhost:5000/api/payment/payments?${queryParams}`);
            
            const response = await fetch(`http://localhost:5000/api/payment/payments?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            // Handle the API response structure based on your routes
            if (data.payments && Array.isArray(data.payments)) {
                setPayments(data.payments);
                setTotalPayments(data.total || data.payments.length);
            } else if (Array.isArray(data)) {
                // Fallback if API returns array directly
                setPayments(data);
                setTotalPayments(data.length);
            } else {
                console.error('Unexpected API Response structure:', data);
                throw new Error('Invalid response format: Expected payments array');
            }
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch payment statistics
    const fetchPaymentStats = async () => {
        try {
            console.log('Fetching payment stats...');
            const response = await fetch('http://localhost:5000/api/payment/payments');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch payment stats: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Stats API Response:', data);
            
            // Get payments array from response
            const allPayments = data.payments || data;
            
            if (Array.isArray(allPayments)) {
                const newStats = {
                    total: allPayments.length,
                    succeeded: allPayments.filter(p => p.status === 'succeeded').length,
                    pending: allPayments.filter(p => p.status === 'pending').length,
                    failed: allPayments.filter(p => p.status === 'failed').length,
                    canceled: allPayments.filter(p => p.status === 'canceled' || p.status === 'cancelled').length,
                    refunded: allPayments.filter(p => p.status === 'refunded').length
                };
                console.log('Calculated stats:', newStats);
                setStats(newStats);
            } else {
                console.error('Stats: Expected array of payments, got:', typeof allPayments);
            }
        } catch (err) {
            console.error('Error fetching payment stats:', err);
        }
    };

    // Fetch payments on component mount and when filter changes
    useEffect(() => {
        fetchPayments(statusFilter);
        fetchPaymentStats();
    }, [statusFilter]);

    // Handle delete payment
    const handleDeletePayment = async (paymentId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/payments/${paymentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete payment: ${response.status} ${response.statusText}`);
            }

            // Remove payment from local state
            setPayments(prevPayments => prevPayments.filter(payment => payment._id !== paymentId));
            setTotalPayments(prev => prev - 1);
            
            // Refresh stats
            fetchPaymentStats();
            
            // Show success message
            Swal.fire({
                title: 'Deleted!',
                text: 'Payment has been deleted successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        } catch (err) {
            console.error('Error deleting payment:', err);
            Swal.fire({
                title: 'Error!',
                text: `Failed to delete payment: ${err.message}`,
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    // Handle payment status update
    const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update payment status: ${response.status} ${response.statusText}`);
            }

            // Update payment in local state
            setPayments(prevPayments => 
                prevPayments.map(payment => 
                    payment._id === paymentId 
                        ? { ...payment, status: newStatus, updatedAt: new Date().toISOString() }
                        : payment
                )
            );
            
            // Refresh stats
            fetchPaymentStats();
            
            // Show success message
            Swal.fire({
                title: 'Updated!',
                text: `Payment status has been updated to ${newStatus}.`,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error('Error updating payment status:', err);
            Swal.fire({
                title: 'Error!',
                text: `Failed to update payment status: ${err.message}`,
                icon: 'error',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchPayments(statusFilter);
        fetchPaymentStats();
    };

    // Handle status filter change
    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
    };

    // Calculate total amount for succeeded payments
    const totalSucceededAmount = payments
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Format currency
    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount / 100); // Assuming amount is in cents
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-600">Loading payments...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Payments</h2>
                <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
         
            <div className="pt-10 pb-6">
                <h1 className="text-4xl font-bold text-center mb-6">Payment Management</h1>
                
                
            </div>

       
            <PaymentTable
                payments={payments}
                onDelete={handleDeletePayment}
                onUpdateStatus={handleUpdatePaymentStatus}
            />
        </div>
    );
};

export default Payments;