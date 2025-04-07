import React from 'react';
import { Link } from '@inertiajs/react';
import {
  MapPinIcon,
  UserCircleIcon,
  PowerIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-indigo-700 text-white py-3 shadow-lg z-10">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Application Name with Icon */}
        <Link href="/" className="text-xl font-semibold flex items-center transition duration-200 ease-in-out hover:text-indigo-200">
          <MapPinIcon className="h-6 w-6 mr-2" />
          Locate-me
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          <span className="text-indigo-200 flex items-center">
            <UserCircleIcon className="h-5 w-5 mr-1" />
            Hi, {user.name}
          </span>
          {user.role === 'admin' && (
            <Link
              href="/dashboard"
              className="text-indigo-200 hover:text-white transition duration-200 ease-in-out flex items-center"
            >
              <CogIcon className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
          )}
          <form method="POST" action="/users/sign_out" data-turbo="false">
            {/* Rails uses _method for HTTP verb override */}
            <input type="hidden" name="_method" value="delete" />
            {/* Rails authenticity token */}
            <input type="hidden" name="authenticity_token" value={getCSRFToken()} />
            <button
              type="submit"
              className="text-indigo-200 hover:text-white transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
            >
              <PowerIcon className="h-5 w-5 mr-1" />
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