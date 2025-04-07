import React from 'react';
import { Link } from '@inertiajs/react';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white py-2 shadow-md z-10">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Application Name */}
        <Link href="/" className="text-xl font-bold text-white transition duration-150 ease-in-out hover:text-indigo-100">
          Locate-me
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          <span className="text-indigo-100">Hi, Hilary</span>
          <Link href="/logout" className="text-indigo-100 hover:text-white transition duration-150 ease-in-out">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;