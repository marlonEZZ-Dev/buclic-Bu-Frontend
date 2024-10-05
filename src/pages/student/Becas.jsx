import React, { useState, useContext } from 'react';
import { MenuContext } from '../../utils/MenuContext';  // Importar el contexto
import TopNavbar from '../../components/TopNavbar';
import Tables from '../../components/global/Tables';
import MenuBecas from '../../components/global/MenuBecas';
import { Button } from 'antd';

const Becas = () => {
  const { menuData } = useContext(MenuContext);  // Acceder a datos del contexto
  const [selectedType, setSelectedType] = useState('Almuerzo');  // Estado para el tipo de menú seleccionado (corregido)

  // Definir las columnas para cada tipo de menú
  const columnsAlmuerzo = ['Plato Principal', 'Bebida', 'Postre', 'Precio', 'Nota'];
  const columnsRefrigerio = ['Aperitivo', 'Bebida', 'Precio', 'Nota'];

  // Convertir los datos del menú en filas para la tabla
  const almuerzoRows = [
    [
      menuData.Almuerzo.mainDish,
      menuData.Almuerzo.drink,
      menuData.Almuerzo.dessert,
      menuData.Almuerzo.price,
      menuData.Almuerzo.note,
    ],
  ];

  const refrigerioRows = [
    [
      menuData.Refrigerio.appetizer,
      menuData.Refrigerio.drink,
      menuData.Refrigerio.price,
      menuData.Refrigerio.note,
    ],
  ];

  // Botones para seleccionar el tipo de menú
  const buttons = [
    { type: 'Almuerzo', label: 'Almuerzo' },  // Usar las mismas claves del contexto
    { type: 'Refrigerio', label: 'Refrigerio' },
  ];

  return (
    <>
      <TopNavbar />
      <main className="becas-section" style={{ marginTop: '100px' }}>

        <h1 className="text-xl font-bold">Becas de Alimentación</h1>
        <p>Nota: La beca de alimentación finaliza el 09 de diciembre.</p>

        <MenuBecas onSelect={setSelectedType} buttons={buttons} selectedType={selectedType}>
          <Tables
            rows={selectedType === 'Refrigerio' ? refrigerioRows : almuerzoRows}  // Corregir para que coincidan las claves
            columns={selectedType === 'Refrigerio' ? columnsRefrigerio : columnsAlmuerzo}
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
