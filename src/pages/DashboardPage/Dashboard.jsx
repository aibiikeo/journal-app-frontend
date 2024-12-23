import { jwtDecode } from 'jwt-decode'; // Fix import, jwtDecode is not a named export
import { useEffect, useState } from 'react';
import { Header } from '@widgets/Header/Header';
import { Footer } from '@widgets/Footer/Footer';
import { EntryList } from '@features/journalEntry/ui/EntryList.jsx';
import { apiClient } from '@shared/api/axios.js';

export const DashboardPage = () => {
  const [userId, setUserId] = useState(null); // State for storing userId
  const [token, setToken] = useState(null); // State for storing token
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const rawToken = localStorage.getItem('authToken'); // e.g., "Bearer eyJhbGciOiJIUzI1NiIs..."
        const extractedToken = rawToken?.split(' ')[1]; // Extract just the token part
        console.log('Extracted token:', extractedToken);

        if (!extractedToken) {
          console.warn('No auth token found. Redirecting to /auth');
          window.location.href = '/auth';
          return;
        }

        // Save the token to state
        setToken(extractedToken);

        // Decode the token to get the email
        const decodedToken = jwtDecode(extractedToken);
        console.log('Decoded token:', decodedToken);

        const email = decodedToken?.sub; // Replace with the correct claim name if necessary
        console.log('email:', email);

        if (!email) {
          console.error('Email not found in token. Redirecting to /auth');
          window.location.href = '/auth';
          return;
        }

        // Fetch the userId from the backend using the email
        const response = await apiClient.get(`/trusted/auth/email`, {
          params: { email },
        });

        console.log('Fetched userId from backend:', response.data.userId);
        setUserId(response.data.userId.toString()); // Convert to string when setting state
      } catch (err) {
        console.error('Error while fetching userId:', err);
        setError('Failed to load user data. Please try again later.');
        window.location.href = '/auth'; // Redirect to login on error
      }
    };

    // Explicitly handle the promise to satisfy React's warning
    fetchUserId().catch((err) => {
      console.error('Unhandled error in fetchUserId:', err);
    });
  }, []); // Dependency array

  if (error) return <p className="text-red-500">{error}</p>;
  if (!userId || !token) return <p>Loading...</p>; // Show a loading message until userId and token are available

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4 mt-16">
        <div className="h-[415px] overflow-y-auto bg-transparent rounded-lg p-4">
          {/* Scrollable container for EntryList */}
          <EntryList userId={parseInt(userId, 10)} token={token} />
        </div>
      </main>

      <Footer />
    </div>
  );
};
