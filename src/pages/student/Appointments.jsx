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
          <h1 className="text-xl font-bold" style={{ color: '#C20E1A', textAlign: 'center' }}>
            Área de citas
          </h1>
        </header>
        
        {/* Sección de opciones de citas */}
        <section 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: '20px', 
            marginTop: '20px', 
            flexWrap: 'wrap'  // Permitir que las tarjetas se envuelvan
          }}
        >
          
          {/* Opción 1: Psicología */}
          <article style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }}>
            <AppointmentMenu
              image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              title="Psicología"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%', // Ajusta el ancho al contenedor
                marginBottom: '20px',
              }}
            />
          </article>

          {/* Opción 2: Enfermería - Médico general */}
          <article style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }}>
            <AppointmentMenu
              image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              title="Enfermería - Médico general"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%',
                marginBottom: '20px',
              }}
            />
          </article>

          {/* Opción 3: Odontología */}
          <article style={{ width: 'calc(33.33% - 20px)', minWidth: '300px' }}>
            <AppointmentMenu
              image="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              title="Odontología"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '100%',
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