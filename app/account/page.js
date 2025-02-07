"use client";

import { useState, useEffect } from "react";

const formatDate = (date) => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function AccountPage({ id, email, subscription, license }) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log('Account page props:', { id, email, subscription, license });
  }, [id, email, subscription, license]);
  
  const handlePortalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No portal URL received');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!id || !email) {
    console.log('No user data available');
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

          {/* Account Information */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account ID</p>
                  <p className="mt-1 text-sm text-gray-900">{id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Subscription Status
                </h2>
                {subscription?.customer_id && (
                  <form onSubmit={handlePortalSubmit}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : 'Manage Billing'}
                    </button>
                  </form>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {subscription?.status || 'No active subscription'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Renewal Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {subscription?.current_period_end ? formatDate(subscription.current_period_end) : 'N/A'}
                  </p>
                </div>
                {subscription?.cancel_at_period_end && (
                  <div className="col-span-2">
                    <p className="text-sm text-amber-600">
                      Your subscription will end on {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* License Information */}
          {license && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  License Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">License Key</p>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        readOnly
                        value={license.key}
                        className="block w-full pr-10 bg-gray-50 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(license.key)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 rounded-r-md hover:bg-gray-200"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {license.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expires</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(license.expires_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 