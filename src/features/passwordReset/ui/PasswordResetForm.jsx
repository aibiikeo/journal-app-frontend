import  { useState } from 'react';
import { passwordResetApi } from '../model/passwordResetApi';

/**
 * PasswordResetForm Component
 * Handles both requesting a password reset and resetting the password.
 */
export const PasswordResetForm = () => {
  // State for storing email input for requesting a reset
  const [email, setEmail] = useState('');
  // State for storing reset token for password resetting
  const [token, setToken] = useState('');
  // State for storing new password input
  const [newPassword, setNewPassword] = useState('');
  // Tracks whether the user is in the "request" or "reset" step
  const [step, setStep] = useState('request');
  // State for displaying success messages
  const [message, setMessage] = useState('');
  // State for displaying error messages
  const [error, setError] = useState('');

  /**
   * Handle requesting a password reset.
   * Sends a request to the API with the provided email.
   */
  const handleRequestReset = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('handleRequestReset called with email:', email); // Debug log
    setError(''); // Clear any previous errors
    setMessage(''); // Clear any previous messages
    try {
      console.log('Sending request to passwordResetApi.requestPasswordReset'); // Debug log
      const response = await passwordResetApi.requestPasswordReset(email);
      console.log('Password reset request successful, response:', response); // Debug log
      setMessage(response); // Display success message from API response
      setStep('reset'); // Move to the reset password step
    } catch (err) {
      console.error('Error during password reset request:', err); // Log error
      setError(err.message); // Display error message to the user
    }
  };

  /**
   * Handle resetting the password.
   * Sends the token and new password to the API to complete the reset process.
   */
  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('handleResetPassword called with token:', token, 'and newPassword:', newPassword); // Debug log
    setError(''); // Clear any previous errors
    setMessage(''); // Clear any previous messages
    try {
      console.log('Sending request to passwordResetApi.resetPassword'); // Debug log
      const response = await passwordResetApi.resetPassword({ token, newPassword });
      console.log('Password reset successful, response:', response); // Debug log
      setMessage(response); // Display success message from API response
      setStep('request'); // Return to the request step after success
      setEmail(''); // Clear email input
      setToken(''); // Clear token input
      setNewPassword(''); // Clear password input
    } catch (err) {
      console.error('Error during password reset:', err); // Log error
      setError(err.message); // Display error message to the user
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      {/* Dynamic title based on the current step */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        {step === 'request' ? 'Request Password Reset' : 'Reset Password'}
      </h2>

      {/* Display success or error messages */}
      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Render the form for requesting a reset or resetting the password */}
      {step === 'request' ? (
        <form onSubmit={handleRequestReset}>
          {/* Email input field for password reset request */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                console.log('Email input changed:', e.target.value); // Debug log
                setEmail(e.target.value);
              }}
              required
              className="mt-1 block w-full p-2 border rounded focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Request Reset
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          {/* Token input field for password reset */}
          <div className="mb-4">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Reset Token
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => {
                console.log('Token input changed:', e.target.value); // Debug log
                setToken(e.target.value);
              }}
              required
              className="mt-1 block w-full p-2 border rounded focus:ring focus:ring-blue-200"
            />
          </div>
          {/* New password input field */}
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                console.log('New password input changed'); // Debug log
                setNewPassword(e.target.value);
              }}
              required
              className="mt-1 block w-full p-2 border rounded focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};