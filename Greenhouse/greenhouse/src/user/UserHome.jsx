import React, { useEffect, useState } from 'react';
import Footer from '../authentication/Footer';
import Navigation from './Navigation';
import Cards from './Cards';
import { useNavigate } from 'react-router-dom';
import Status401 from '../status/Status401';

const UserHome = () => {
  const navigate = useNavigate();
  const [showStatus401, setShowStatus401] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowStatus401(true);
    } else {
      navigate('/home');
    }
  }, []);

  if (showStatus401) {
    return <Status401 status={401} />
  }

  return (
    <>
      <Navigation />
      <Cards />
      <Footer />
    </>
  )
}

export default UserHome;