import React from 'react';
import IconCircle from '../../components/global/IconCircle';
import LogoBecas from '../../assets/logo_becas.svg';

const MainStudentView = () => {
  return (
    <div className="p-4">
      <IconCircle 
        icon={<img src={LogoBecas} alt="Logo Becas" className="w-full h-full object-contain" />}
        text="Becas de alimentación"
        size="xxl"
        bgColor="bg-gray-200"
      />
    </div>
  );
};

export default MainStudentView;
