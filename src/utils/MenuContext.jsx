// MenuContext.js
import React, { createContext, useState } from 'react'; // No debería haber JSX aquí

// Crear el contexto
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState({
    Almuerzo: {
      note: '',
      mainDish: '',
      drink: '',
      dessert: '',
      price: 0,
    },
    Refrigerio: {
      note: '',
      appetizer: '',
      drink: '',
      price: 0,
    },
  });

  return (
    <MenuContext.Provider value={{ menuData, setMenuData }}>
      {children}
    </MenuContext.Provider>
  );
};

