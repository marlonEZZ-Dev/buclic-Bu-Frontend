import React, { useState, useContext, useEffect } from 'react';
import { MenuContext } from '../../utils/MenuContext';  // Importar el contexto
import { Button, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import api from '../../api.js';
import { ACCESS_TOKEN } from "../../constants";

const { TextArea } = Input;

const Menu = () => {
  const navigate = useNavigate();
  const { menuData, setMenuData } = useContext(MenuContext);  // Acceder a datos del contexto
  const [selectedType, setSelectedType] = useState('Almuerzo');
  const [isEditable, setIsEditable] = useState({
    Almuerzo: false,
    Refrigerio: false,
  });

  // Estado temporal para manejar los datos durante la edición
  const [tempMenuData, setTempMenuData] = useState({
    Almuerzo: {},
    Refrigerio: {}
  });

  useEffect(() => {
    // Realiza la solicitud GET para obtener los datos del menú desde el backend
    const fetchMenuData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          message.error('Por favor, inicie sesión nuevamente');
          navigate('/login');
          return;
        }

        const response = await api.get('/menu', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const menus = response.data;

        const almuerzoMenu = menus.find(menu => menu.id === 1) || {};
        const refrigerioMenu = menus.find(menu => menu.id === 2) || {};

        setMenuData({
          Almuerzo: almuerzoMenu,
          Refrigerio: refrigerioMenu
        });

        setTempMenuData({
          Almuerzo: almuerzoMenu,
          Refrigerio: refrigerioMenu
        });

      } catch (error) {
        message.error('Error al obtener los datos del menú');
        console.error(error);
      }
    };

    fetchMenuData(); // Llama a la función para obtener los datos al cargar el componente

  }, [navigate, setMenuData]);

  // Maneja los cambios de los inputs en el estado temporal
  const handleInputChange = (field, value) => {
    setTempMenuData((prevData) => ({
      ...prevData,
      [selectedType]: {
        ...prevData[selectedType],
        [field]: value,
      },
    }));
  };

  const saveMenu = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const menuTypeData = tempMenuData[selectedType]; // Usar datos temporales para guardar
    
    if (!token) {
      console.error("No se encontró el token de autenticación");
      message.error("Por favor, inicie sesión nuevamente");
      navigate("/login");
      return;
    }
    
    try {
      let response;
      
      // Verifica si ya existe un id para determinar si es PUT (actualización) o POST (creación)
      if (menuData[selectedType] && menuData[selectedType].id) {
        // Actualización usando PUT
        response = await api.put(
          "/menu", 
          {
            id: menuData[selectedType].id,  // Incluye el ID en el cuerpo de la solicitud
            note: menuTypeData.note,
            mainDish: menuTypeData.mainDish,  // Enviar mainDish directamente
            drink: menuTypeData.drink,
            dessert: menuTypeData.dessert,
            price: menuTypeData.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Menú actualizado exitosamente");
      } else {
        // Si no hay menú previo (es decir, no hay ID), hacer una solicitud POST
        response = await api.post(
          "/menu",  // POST para crear un nuevo menú
          {
            note: menuTypeData.note,
            mainDish: menuTypeData.mainDish,  // Enviar mainDish directamente
            drink: menuTypeData.drink,
            dessert: menuTypeData.dessert,
            price: menuTypeData.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Menú creado exitosamente");
      }
  
      // Actualizar los datos en el contexto solo después de guardar
      setMenuData((prevMenuData) => ({
        ...prevMenuData,
        [selectedType]: response.data, // Guardar la respuesta actualizada en el contexto
      }));
  
      // Deshabilitar la edición después de guardar
      setIsEditable({ ...isEditable, [selectedType]: false });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        message.error("Conflicto al guardar el menú: el recurso ya existe o hay un problema con los datos.");
      } else if (error.response && error.response.status === 401) {
        message.error("Sesión expirada. Por favor, inicie sesión nuevamente");
        navigate("/login");
      } else {
        message.error("Error al guardar el menú. Por favor, intente de nuevo");
      }
      console.error("Error al guardar el menú:", error);
    }
  };

  const handleEdit = () => {
    setTempMenuData(menuData); // Copiar los datos actuales a tempMenuData
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: true,
    }));
  };

  const handleCreateClick = () => {
    // Inicia la edición para crear un nuevo menú
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: true,
    }));

    // Inicializa los datos temporales para un nuevo menú vacío
    setTempMenuData((prevData) => ({
      ...prevData,
      [selectedType]: {
        note: '',
        mainDish: '',
        appetizer: '',
        drink: '',
        dessert: '',
        price: 0,
      },
    }));
  };

  const handleCancel = () => {
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: false,
    }));
    setTempMenuData(menuData); // Revertir cambios, volviendo al estado original
  };

  const isLunch = selectedType === "Almuerzo";
  const mainDishLabel = isLunch ? "Plato Principal" : "Aperitivo";
  const mainDishPlaceholder = isLunch
    ? "Describe el plato principal"
    : "Describe el aperitivo";

  const buttons = [
    { type: "Almuerzo", label: "Almuerzo" },
    { type: "Refrigerio", label: "Refrigerio" },
  ];

  return (
    <>
      <HeaderAdmin />
      <div className="becas-section">
        <MenuBecas
          onSelect={setSelectedType}
          buttons={buttons}
          selectedType={selectedType}
        >
          {/* TextArea para Nota */}
          <div
            style={{
              width: "100%",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <label
              style={{
                marginRight: "12px", // Espacio entre el label y el TextArea
                textAlign: "left",
                width: "50px", // Ancho del label para alinear con el TextArea
              }}
            >
              Nota
            </label>
            <TextArea
              placeholder="Añade una nota"
              autoSize
              style={{ width: "100%" }}
              value={tempMenuData[selectedType].note}  // Mostrar valor temporal
              onChange={(e) => handleInputChange("note", e.target.value)}
              disabled={!isEditable[selectedType]} // Hacer el input no editable
            />
          </div>
          <p
            style={{
              textAlign: "center",
              margin: "4px 0 12px 0",
              fontSize: "16px",
            }}
          >
            Diligencia los datos para el {selectedType} - {new Date().toLocaleDateString()}
          </p>

          {/* TextArea para el plato principal o aperitivo */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              {mainDishLabel}
            </label>
            <TextArea
              placeholder={mainDishPlaceholder}
              autoSize
              style={{ width: "100%" }}
              value={tempMenuData[selectedType].mainDish}  // Siempre usaremos mainDish en el frontend, ya que es el mismo campo en backend
              onChange={(e) =>
                handleInputChange(
                  "mainDish", // Siempre se actualiza como mainDish en el frontend
                  e.target.value
                )
              }
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* TextArea para Bebida */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              Bebida
            </label>
            <TextArea
              placeholder="Describe la bebida"
              autoSize
              style={{ width: "100%" }}
              value={tempMenuData[selectedType].drink}  // Mostrar valor temporal
              onChange={(e) => handleInputChange("drink", e.target.value)}
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* TextArea para Postre */}
          {isLunch && (
            <div style={{ width: "100%", marginBottom: "12px" }}>
              <label
                style={{
                  marginBottom: "6px",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Postre
              </label>
              <TextArea
                placeholder="Describe el postre"
                autoSize
                style={{ width: "100%" }}
                value={tempMenuData[selectedType].dessert}  // Mostrar valor temporal
                onChange={(e) => handleInputChange("dessert", e.target.value)}
                disabled={!isEditable[selectedType]}
              />
            </div>
          )}

          {/* Input para el precio */}
          <div style={{ width: "100%", marginBottom: "12px" }}>
            <label
              style={{
                marginBottom: "6px",
                textAlign: "left",
                display: "block",
              }}
            >
              Precio
            </label>
            <Input
              type="text"
              placeholder="Ingresa el precio"
              value={
                tempMenuData[selectedType].price === 0
                  ? ""
                  : tempMenuData[selectedType].price  // Mostrar valor temporal
              }
              onChange={(e) => {
                const value = e.target.value;

                // Validar que el valor sea un número entero positivo
                const validatedValue = value.replace(/[^0-9]/g, "");
                handleInputChange(
                  "price",
                  validatedValue === "" ? 0 : parseInt(validatedValue, 10)
                );
              }}
              style={{ width: "100%" }}
              disabled={!isEditable[selectedType]}
            />
          </div>

          {/* Botones Crear, Editar, Guardar y Cancelar */}
          <div style={{ margin: "24px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {!isEditable[selectedType] ? (
                !menuData[selectedType] || !menuData[selectedType].id ? (
                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#C20E1A",
                      color: "#FFFFFF",
                      border: "none",
                      height: "30px",
                      width: "149px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#841F1C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#C20E1A";
                    }}
                    onClick={handleCreateClick} // Habilitar creación del menú
                  >
                    Crear
                  </Button>
                ) : (
                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#C20E1A",
                      color: "#FFFFFF",
                      border: "none",
                      height: "30px",
                      width: "149px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#841F1C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#C20E1A";
                    }}
                    onClick={handleEdit} // Habilitar edición solo del menú seleccionado
                  >
                    Editar
                  </Button>
                )
              ) : (
                <>
                  <Button
                    type="default"
                    className="button-save"
                    onClick={saveMenu} // Llamar a la función para guardar el menú
                  >
                    Guardar
                  </Button>

                  <Button
                    type="default"
                    className="button-cancel"
                    onClick={handleCancel} // Cancelar edición solo del menú seleccionado
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </MenuBecas>
      </div>
    </>
  );
};

export default Menu;
