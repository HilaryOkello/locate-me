import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ user, children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* pass the user prop to navbar */}
      <Navbar user={user} />
      <main className="flex-grow relative overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;