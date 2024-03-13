import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import IndexContent from '../components/IndexContent';
import Menu from '../components/Menu';

import '../css/root.css';

function Home() {
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
