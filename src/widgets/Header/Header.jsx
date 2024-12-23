import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

/**
 * Header Component
 * This component renders the header section of the application.
 * It includes the application's title and a logout button with a green theme.
 */
export const Header = () => {
  console.log('Header component rendered'); // Debug log to indicate the Header component is rendered

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-green-500 text-white p-4 shadow-md flex justify-between items-center fixed top-0 left-0 w-full z-10">
      {/* Application title displayed in the header */}
      <h1 className="text-2xl font-extrabold tracking-wide ml-10">Journal App</h1>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="bg-green-700 px-6 py-2 rounded-full text-white font-bold hover:bg-green-800 hover:shadow-lg transition duration-200 ease-in-out"
      >
        Logout
      </button>
    </header>
  );
};
