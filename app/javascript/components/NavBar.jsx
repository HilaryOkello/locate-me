import React from 'react';
import { Link } from '@inertiajs/react';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-indigo-600 text-white py-2 shadow-md z-10">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Application Name */}
        <Link href="/" className="text-xl font-bold text-white transition duration-150 ease-in-out hover:text-indigo-100">
          Locate-me
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          <span className="text-indigo-100">Hi, {user.name}</span>
          <form method="POST" action="/users/sign_out" data-turbo="false">
            {/* Rails uses _method for HTTP verb override */}
            <input type="hidden" name="_method" value="delete" />
            {/* Rails authenticity token */}
            <input type="hidden" name="authenticity_token" value={getCSRFToken()} />
            <button
              type="submit"
              className="text-indigo-100 hover:text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

// Helper function to get the Rails CSRF token from the meta tag
const getCSRFToken = () => {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute('content') : '';
};

export default Navbar;