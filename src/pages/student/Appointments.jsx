import React from 'react';
import TopNavbar from '../../components/TopNavbar';
import AppointmentMenu from '../../components/global/AppointmentMenu';

const Appointments = () => {
  return (
    <>
      <TopNavbar />
      
      {/* Contenido principal */}
      <main style={{ marginTop: '100px', padding: '0 20px' }}> 
        
        {/* Título principal */}
        <header>
          <h1 className="text-xl font-bold" style={{ color: '#C20E1A', textAlign: 'center' }}>Área de citas</h1>
        </header>
        
        {/* Sección de opciones de citas */}
        <section style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', flexWrap: 'wrap' }}>
          
          {/* Opción 1: Psicología */}
          <article>
            <AppointmentMenu
              image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" // Cambia la URL según necesites
              title="Psicología"
              style={{
                backgroundColor: 'white', // Fondo blanco
                borderRadius: '8px', // Bordes redondeados
                width: '329px', 
                marginBottom: '20px', // Espacio entre las tarjetas en pantallas pequeñas
              }}
            />
          </article>

          {/* Opción 2: Enfermería - Médico general */}
          <article>
            <AppointmentMenu
              image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" // Cambia la URL según necesites
              title="Enfermería - Médico general"
              style={{
                backgroundColor: 'white', // Fondo blanco
                borderRadius: '8px', // Bordes redondeados
                width: '329px', 
                marginBottom: '20px',
              }}
            />
          </article>

          {/* Opción 3: Odontología */}
          <article>
            <AppointmentMenu
              image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" // Cambia la URL según necesites
              title="Odontología"
              style={{
                backgroundColor: 'white', 
                borderRadius: '8px', 
                width: '329px', 
                marginBottom: '20px',
              }}
            />
          </article>
          
        </section>
      </main>
    </>
  );
};

export default Appointments;