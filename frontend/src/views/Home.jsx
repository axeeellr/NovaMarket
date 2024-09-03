import React, { useEffect } from 'react';
import axios from 'axios';

import { useUser } from '../UserContext';

import Header from '../components/Header';
import Hero from '../components/Hero';
import IndexContent from '../components/IndexContent';
import Menu from '../components/Menu';

import '../css/root.css';

function Home() {
  const { user } = useUser();
  
  if (user) {
    const userId = user.id;
    const checkVerificationStatus = async () => {
      try {
        const response = await axios.get(`https://novamarket.onrender.com/check-verification-status?userId=${userId}`);
        if (!response.data.verified) {
          localStorage.removeItem('firstVisit')
          localStorage.removeItem('user')
          localStorage.removeItem('isAuthenticated')
          window.location.reload();
        }
      } catch (error) {
        console.error('Error al verificar el estado de verificación:', error);
      }
    };
  
    useEffect(() => {
      checkVerificationStatus();
    }, []);
  }
  

  return (
    <>
      <Header />
      <Hero />
      <IndexContent />
      <Menu />
    </>
  );
};

export default Home;
