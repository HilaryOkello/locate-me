import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white py-1.5 text-center text-sm z-10">
      &copy; {new Date().getFullYear()} All Rights Reserved
    </footer>
  );
};

export default Footer;