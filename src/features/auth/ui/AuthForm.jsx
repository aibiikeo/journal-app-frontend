import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { login, register } from '@features/auth/model/authApi';

export const AuthForm = ({ isRegister, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { isRegister, email });

    try {
      if (isRegister) {
        console.log('Registering user with email:', email);
        await register({ email, password });
        alert('Registration successful! Please log in.');
      } else {
        console.log('Logging in user with email:', email);
        const data = await login({ email, password });

        console.log('Login successful, received token:', data.token);
        localStorage.setItem('authToken', data.token); // Save the token

        // Reset any existing error state
        setError(null);

        // Redirect to dashboard
        onAuthSuccess(); // Make sure this is correctly defined
      }
    } catch (err) {
      console.error('Error during submission:', err.response || err.message);

      // If unauthorized, clear any existing token and show the error message
      if (err.response?.status === 401) {
        alert('You are not registered. Please register.');
        localStorage.removeItem('authToken'); // Clear any stale token
      }

      // Set the error message for display
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegister ? 'Register' : 'Login'}
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
};

AuthForm.propTypes = {
  isRegister: PropTypes.bool.isRequired, // Validate isRegister as a required boolean prop
  onAuthSuccess: PropTypes.func.isRequired, // Validate onAuthSuccess as a required function prop
};