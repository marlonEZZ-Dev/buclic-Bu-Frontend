import React from 'react';
import TopNavbar from '../../components/TopNavbar';
import AppointmentMenu from '../../components/global/AppointmentMenu';


const Appointments = () => {
  return (
    <>
      <TopNavbar />
      <div style={{ display: 'flex', marginTop: '100px', alignContent:'center', width: '100%' }}>
      <h1 className="text-xl font-bold #C20E1A">Área de citas</h1>

      </div>
      
      
      <div style={{ display: 'flex', marginTop: '9px', justifyContent: 'space-between', width: '100%' }}>
        <AppointmentMenu
          image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" // Cambia la URL según necesites
          title="Psicología"
          style={{
            backgroundColor: 'white', // Fondo azul
            borderRadius: '2px', // Bordes de 8px
            width: '329px', 
          }}
        />

        <AppointmentMenu
          image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" // Cambia la URL según necesites
          title="Enfermería - Médico general"
          style={{
            backgroundColor: 'white', // Fondo azul
            borderRadius: '2px', // Bordes de 8px
            width: '329px', 
          }}
        />

        <AppointmentMenu
          image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" // Cambia la URL según necesites
          title="Odontología"
          style={{
            backgroundColor: 'white', // Fondo azul
            borderRadius: '2px', // Bordes de 8px
            width: '329px', 
          }}
        />
      </div>
    </>
  );
};

export default Appointments;
