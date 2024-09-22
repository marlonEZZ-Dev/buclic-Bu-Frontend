import React from 'react';
import IconCircle from '../../components/global/IconCircle';
import LogoBecas from '../../assets/icons/logo_becas.svg'; // SVG con el color rojo
import LogoBecasLight from '../../assets/icons/logo_becas_light.svg'; // SVG con el color blanco
import Calendar from '../../assets/icons/calendar.svg'
import CalendarLight from '../../assets/icons/calendar_light.svg'

const MainStudentView = () => {
  return (
    <div className="main-student-view">
      {/* Título centrado */}
      <h1>Título</h1>

      {/* Contenedor para los iconos */}
      <div className="icon-container">
        <IconCircle 
          icon={<img src={LogoBecas} alt="Logo Becas" className="w-full h-full object-contain" />}
          hoverIcon={<img src={LogoBecasLight} alt="Logo Becas Light" className="w-full h-full object-contain" />}
          text="Becas de alimentación"
          size="xxl"
          url="/student/becas"
        />

        <IconCircle
          icon={<img src={Calendar} alt="Logo Citas" className="w-full h-full object-contain" />}
          hoverIcon={<img src={CalendarLight} alt="Logo Citas Light" className="w-full h-full object-contain" />}
          text="Citas"
          size="xxl"
          url="/student/citas"
        />
      </div>
    </div>
  );
};

export default MainStudentView;