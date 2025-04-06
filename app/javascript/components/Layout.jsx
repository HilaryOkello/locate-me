import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;