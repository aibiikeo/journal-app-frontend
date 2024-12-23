/**
 * Footer Component
 * This component renders the footer section of the application.
 * It can include application metadata or additional links.
 */
export const Footer = () => {
  console.log('Footer component rendered'); // Debug log to indicate the Footer component is rendered

  return (
    <footer className="bg-green-800 text-white p-4 mt-8">
      {/* Footer container with background color and padding */}
      <p className="text-center text-sm">
        {/* Centered footer text with copyright notice */}
        &copy; 2024 Journal App. All rights reserved.
      </p>
    </footer>
  );
};
