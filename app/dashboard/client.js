'use client';

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";

const formatDate = (date) => {
  if (!date) return 'N/A';
  // Handle Unix timestamp (seconds) or ISO string
  const dateObj = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// New CopyButton component
const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`absolute inset-y-0 right-0 px-3 flex items-center rounded-r-md transition-colors
        ${copied ? 'bg-gray-50' : 'bg-gray-100 hover:bg-gray-200'}`}
      onMouseEnter={() => setCopied(false)}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

export default function DashboardClient({ id, email, subscription, activeLicense }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handlePortalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.assign(data.url);
      } else {
        setError(data.error || 'Failed to access billing portal');
        console.error('Portal error:', data);
      }
    } catch (error) {
      setError('Error accessing billing portal');
      console.error('Error accessing billing portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Account Information */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Account Information
                </h2>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging out...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </span>
                  )}
                </button>
              </div>
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

          {/* Download App */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Download Clipbrd
                </h2>
                <Link
                  href="/download"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download Now
                </Link>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Get started with Clipbrd on your device. Available for Windows.
              </p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Subscription Status
                </h2>
                <form onSubmit={handlePortalSubmit}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Manage Billing'}
                  </button>
                </form>
              </div>
              {error && (
                <div className="mb-4 text-sm text-red-600">
                  {error}
                </div>
              )}
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
          {activeLicense && (
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
                    value={activeLicense.display_key}
                    className="block w-full pr-10 bg-gray-50 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <CopyButton textToCopy={activeLicense.display_key} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {activeLicense.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expires</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(activeLicense.expires_at)}
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