// Becas.jsx
import React from 'react';
import TopNavbar from '../../components/TopNavbar';
import Tabla from '../../components/global/Tabla'; 
import MenuBecas from '../../components/global/MenuBecas'; 

const rows = [
  ['Dato 1-1', 'Dato 1-2', 'Dato 1-3'],
];

const columns = ['Columna 1', 'Columna 2', 'Columna 3'];

const Becas = () => (
  <>
    <TopNavbar />
    
    <div className="becas-section">
      <h1 className="text-xl font-bold">Becas de Alimentación</h1>
      <p className="text-md">Nota: La beca de alimentación finaliza el 13 de diciembre.</p>
      
      <MenuBecas className="menu-becas" />
      
      <Tabla rows={rows} columns={columns} />
    </div>
  </>
);

export default Becas;
