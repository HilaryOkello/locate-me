import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-3 text-center">
      &copy; {new Date().getFullYear()} All Rights Reserved
    </footer>
  );
};

export default Footer;