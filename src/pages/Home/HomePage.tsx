import BannerPage from '@/components/layout/BannerPage';
import Footer from '@/components/layout/Footer';
import NavHome from '@/components/layout/NavHome';
import React from 'react';


const HomePage: React.FC = () => {


  return (
    <>
          <NavHome></NavHome>
          <BannerPage></BannerPage>
          <Footer></Footer>
    </>
  );
};

export default HomePage;