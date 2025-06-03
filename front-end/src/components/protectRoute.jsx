"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/utils/authContext';

const ProtectedRoute = ({ children, requiredLevel, allowedLevels = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If user is not logged in, redirect to auth page
      if (!user.isLoggedIn) {
        router.push('/auth');
        return;
      }

      // Check for specific required level
      if (requiredLevel && user.level !== requiredLevel) {
        // Redirect based on user's actual level
        if (user.level === 'admin') {
          router.push('/page/admin');
        } else if (user.level === 'kasir') {
          router.push('/page/kasir');
        } else {
          router.push('/order');
        }
        return;
      }

      // Check for allowed levels
      if (allowedLevels.length > 0 && !allowedLevels.includes(user.level)) {
        // Redirect based on user's actual level
        if (user.level === 'admin') {
          router.push('/page/admin');
        } else if (user.level === 'kasir') {
          router.push('/page/kasir');
        } else {
          router.push('/order');
        }
        return;
      }
    }
  }, [user, loading, requiredLevel, allowedLevels, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show loading if user is not authenticated (redirect in progress)
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  // Show loading if user doesn't have required permissions (redirect in progress)
  if (requiredLevel && user.level !== requiredLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Akses Ditolak</p>
          <p className="text-gray-600 text-sm">Anda tidak memiliki izin untuk mengakses halaman ini</p>
        </div>
      </div>
    );
  }

  if (allowedLevels.length > 0 && !allowedLevels.includes(user.level)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Akses Ditolak</p>
          <p className="text-gray-600 text-sm">Anda tidak memiliki izin untuk mengakses halaman ini</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;