"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page handles redirecting logged-in users based on their role
// In a real app, you would check authentication state and user role from your auth provider
const AppRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Mock logic to determine user role
    // In a real app, you would get this from your authentication context/state
    const userRole = localStorage.getItem('userRole') || null;
    
    if (!userRole) {
      // If no role found, redirect to login
      router.push('/login');
    } else if (userRole === 'doctor') {
      router.push('/doctor/dashboard');
    } else if (userRole === 'tenant-admin') {
      router.push('/tenant-admin/dashboard');
    } else {
      // Fallback to login if unknown role
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default AppRedirectPage;
