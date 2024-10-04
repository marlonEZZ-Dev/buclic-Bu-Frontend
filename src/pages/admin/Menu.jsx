import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import { Button, Input } from "antd";
import React, { useState } from "react";
const { TextArea } = Input;
import axios from "axios";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Almuerzo");
  const [isEditable, setIsEditable] = useState({
    Almuerzo: false,
    Refrigerio: false,
  }); // Estado para controlar la edición

  // fecha actual
  const todayDate = new Date().toLocaleDateString();

  // Estado para que me diferencie si es almuerzo o refrigerio
  const [menuData, setMenuData] = useState({
    Almuerzo: {
      note: "",
      mainDish: "",
      drink: "",
      dessert: "",
      price: 0,
    },
    Refrigerio: {
      note: "",
      appetizer: "",
      drink: "",
      price: 0,
    },
  });

  const saveMenu = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const menuTypeData = menuData[selectedType];

    if (!token) {
      //Pa verificar si falló :)
      console.error("No se encontró el token de autenticación");
      message.error("Por favor, inicie sesión nuevamente");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/menu",
        {
          note: menuTypeData.note,
          mainDish:
            selectedType === "Almuerzo"
              ? menuTypeData.mainDish
              : menuTypeData.appetizer,
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

      console.log("Menu guardado:", response.data);
      message.success("Menú guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar el menú:", error);
      if (error.response && error.response.status === 401) {
        message.error("Sesión expirada. Por favor, inicie sesión nuevamente");
        navigate("/login");
      } else {
        message.error("Error al guardar el menú. Por favor, intente de nuevo");
      }
    }
  };

  const buttons = [
    { type: "Almuerzo", label: "Almuerzo" },
    { type: "Refrigerio", label: "Refrigerio" },
  ];

  // Maneja los cambios de los inputs y actualiza el estado correspondiente
  const handleInputChange = (field, value) => {
    setMenuData((prevData) => ({
      ...prevData,
      [selectedType]: {
        ...prevData[selectedType],
        [field]: value,
      },
    }));
  };

  // Habilitar/deshabilitar edición
  const handleEdit = () => {
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: true,
    }));
  };

  const handleCancel = () => {
    setIsEditable((prevEditable) => ({
      ...prevEditable,
      [selectedType]: false,
    }));
  };

  // Determinar si es Almuerzo o Refrigerio para cambiar el label y el placeholder
  const isLunch = selectedType === "Almuerzo";
  const mainDishLabel = isLunch ? "Plato Principal" : "Aperitivo";
  const mainDishPlaceholder = isLunch
    ? "Describe el plato principal"
    : "Describe el aperitivo";

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
              value={menuData[selectedType].note}
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
            Diligencia los datos para el {selectedType} - {todayDate}
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
              value={menuData[selectedType][isLunch ? "mainDish" : "appetizer"]}
              onChange={(e) =>
                handleInputChange(
                  isLunch ? "mainDish" : "appetizer",
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
              value={menuData[selectedType].drink}
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
                value={menuData[selectedType].dessert}
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
                menuData[selectedType].price === 0
                  ? ""
                  : menuData[selectedType].price
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

          {/* Botones Editar, Guardar y Cancelar */}
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
              ) : (
                <>
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
                    onClick={() => {
                      saveMenu(); // Llamar a la función para guardar el menú
                      setIsEditable({ ...isEditable, [selectedType]: false });
                    }}
                  >
                    Guardar
                  </Button>

                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#C20E1A",
                      border: "1px solid #C20E1A",
                      height: "30px",
                      width: "149px",
                    }}
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
