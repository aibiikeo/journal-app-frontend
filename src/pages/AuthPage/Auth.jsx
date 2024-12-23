import React from 'react';
import { AuthForm } from '@features/auth/ui/AuthForm';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = React.useState(false); // State to toggle login/register modes
  const handleAuthSuccess = () => {
    console.log('Authentication successful. Redirecting to dashboard...');
    window.location.href = '/dashboard'; // Redirect to dashboard page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded p-6">
        {/* Pass handleAuthSuccess as a prop to AuthForm */}
        <AuthForm isRegister={isRegister} onAuthSuccess={handleAuthSuccess} />

        <div className="mt-4 text-center">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsRegister(false)}
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsRegister(true)}
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
