import React from 'react';
import Login from './Login';
import Footer from './Footer';

const HomePage = () => {
  return (
    <>
      <div>
        <Login />
      </div>

      <div>
        <Footer></Footer>
      </div>
    </>
  );
};

export default HomePage;