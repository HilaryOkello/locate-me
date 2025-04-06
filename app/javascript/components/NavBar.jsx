import React from 'react';
import { Link } from '@inertiajs/react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Application Name */}
        <Link href="/" className="text-xl font-bold text-indigo-300">
          Locate-me
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          <Link href="/logout" className="hover:text-indigo-200 transition duration-150 ease-in-out">
            logout
          </Link>
          <span className="text-gray-400">Hi, Hilary</span>
          <button className="bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
            Add Your Location
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;