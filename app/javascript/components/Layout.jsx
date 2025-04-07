import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-grow relative overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;