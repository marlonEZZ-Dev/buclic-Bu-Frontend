import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de importar axios
import TopNavbar from '../../components/TopNavbar';
import Tables from '../../components/global/Tables';
import MenuBecas from '../../components/global/MenuBecas';
import { Button } from 'antd';


const Becas = () => {
  const [selectedType, setSelectedType] = useState('almuerzo'); // Estado para el tipo de beca
  const [almuerzoRows, setAlmuerzoRows] = useState([]);
  const [refrigerioRows, setRefrigerioRows] = useState([]);

  const buttons = [
    { type: 'Almuerzo', label: 'Almuerzo' },
    { type: 'Refrigerio', label: 'Refrigerio' }
  ];

  const columnsAlmuerzo = ['Plato Principal', 'Bebida', 'Postre', 'Precio', 'Nota'];
  const columnsRefrigerio = ['Plato Principal', 'Bebida', 'Postre', 'Precio', 'Nota'];

  // useEffect para cargar datos cuando se monta el componente
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // Llama al backend para obtener el menú de almuerzo
        const almuerzoResponse = await axios.get('/menu/1');  // Asegúrate de usar la ruta correcta
        console.log('Almuerzo data:', almuerzoResponse.data);
        setAlmuerzoRows([[
          almuerzoResponse.data.mainDish,
          almuerzoResponse.data.drink,
          almuerzoResponse.data.dessert,
          almuerzoResponse.data.price,
          almuerzoResponse.data.note
        ]]);

        // Llama al backend para obtener el menú de refrigerio
        const refrigerioResponse = await axios.get('/menu/2');
        console.log('Refrigerio data:', refrigerioResponse.data);
        setRefrigerioRows([[
          refrigerioResponse.data.mainDish,
          refrigerioResponse.data.drink,
          refrigerioResponse.data.dessert,
          refrigerioResponse.data.price,
          refrigerioResponse.data.note
        ]]);
      } catch (error) {
        console.error('Error al obtener los menús:', error);
      }
    };

    fetchMenus();
  }, []); // Solo se ejecuta cuando el componente se monta
  return (
    <>
      <TopNavbar />
      <main className="becas-section" style={{ marginTop: '100px' }}>

        <h1 className="text-xl font-bold">Becas de Alimentación</h1>
        <p>Nota: La beca de alimentación finaliza el 09 de diciembre.</p>

        <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>
          <Tables
            rows={selectedType === 'refrigerio' ? refrigerioRows : almuerzoRows}
            columns={selectedType === 'refrigerio' ? columnsRefrigerio : columnsAlmuerzo}
          />

          {/* Párrafo antes de los botones */}
          <p style={{ textAlign: 'left', marginTop: '8px' }}>
            Eres beneficiario/a de la beca tipo {selectedType}
          </p>

          {/* Botones "Reservar" y "Cancelar reserva" */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            {/* Botón Guardar */}
            <Button
              type="default"
              htmlType="submit"
              className="button-save"
            >
              Reservar
            </Button>

            {/* Botón Cancelar */}
            <Button
              type="default"
              htmlType="reset"
              className="button-cancel"
            >
              Cancelar reserva
            </Button>
          </div>
        </MenuBecas>
      </main>
    </>
  );
};

export default Becas;



