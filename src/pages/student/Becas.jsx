import React, { useState, useEffect } from 'react';
import TopNavbar from '../../components/TopNavbar';
import BecasReservation from '../../components/global/BecasReservation';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

const Becas = () => {

  return (
    <>
      <TopNavbar />
      <BecasReservation />
      <FooterProfessionals />

    </>
  );
};


export default Becas;