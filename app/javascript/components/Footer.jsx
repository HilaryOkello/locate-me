import React from 'react';

const Footer = () => {
  const websiteLink = "https://github.com/HilaryOkello";
  const websiteName = "Hilary Okello";

  return (
    <footer className="bg-indigo-600 text-white py-1.5 text-center text-sm z-10">
      &copy; {new Date().getFullYear()} All Rights Reserved |
      <a
        href={websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-100 hover:text-white ml-1"
      >
        {websiteName}
      </a>
    </footer>
  );
};

export default Footer;