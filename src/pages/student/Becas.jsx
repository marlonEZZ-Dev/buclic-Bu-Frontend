import React, { useState } from 'react';
import TopNavbar from '../../components/TopNavbar';
import Tables from '../../components/global/Tables'; 
import MenuBecas from '../../components/global/MenuBecas';
import { Card, Button } from 'antd'; 

const Becas = () => {
  const [selectedType, setSelectedType] = useState(''); // Estado para el tipo de beca

  // Datos de las tablas
  const almuerzoRows = [
    ['Dato 1-1', 'Dato 1-2', 'Dato 1-3'],
  ];

  const refrigerioRows = [
    ['Dato 2-1', 'Dato 2-2'],
    ['Dato 2-3', 'Dato 2-4'],
  ];

  const columnsAlmuerzo = ['Columna 1', 'Columna 2', 'Columna 3'];
  const columnsRefrigerio = ['Columna 1', 'Columna 2'];

  return (
    <>
      <TopNavbar />
      
      <div className="becas-section">
        <h1 className="text-xl font-bold">Becas de Alimentación</h1>
        <p className="text-md">Nota: La beca de alimentación finaliza el 09 de diciembre.</p>
        
        <MenuBecas onSelect={setSelectedType} />
        
        <Card
          title={selectedType === 'refrigerio' ? "Menú Refrigerio" : "Menú Almuerzo"}
          bordered={true}
          style={{ width: '100%', maxWidth: '800px', marginTop: '0' }}
        >
          <Tables 
            rows={selectedType === 'refrigerio' ? refrigerioRows : almuerzoRows} 
            columns={selectedType === 'refrigerio' ? columnsRefrigerio : columnsAlmuerzo} 
          />
          <p style={{ textAlign: 'left', marginTop: '8px' }}>
            Eres beneficiario/a de la beca tipo {selectedType === 'refrigerio' ? 'refrigerio' : 'almuerzo'}
          </p>

          {/* Botones "Reservar" y "Cancelar reserva" */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            <Button 
              type="primary"
              style={{
                backgroundColor: '#C20E1A',
                color: '#FFFFFF',
                border: 'none',
                height: '30px',
                width: '90px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#841F1C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C20E1A';
              }}
            >
              Reservar
            </Button>

            <Button 
              type="default"
              style={{
                backgroundColor: '#C20E1A',
                color: '#FFFFFF',
                border: 'none',
                height: '30px',
                width: '149px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#841F1C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C20E1A';
              }}
            >
              Cancelar reserva
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Becas;

