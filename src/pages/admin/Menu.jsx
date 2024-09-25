import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import { Button, Input } from "antd";
import React, { useState } from "react";
const { TextArea } = Input;

const Menu = () => {
  const [selectedType, setSelectedType] = useState("Almuerzo");

  // fecha
  const todayDate = new Date().toLocaleDateString();

  // Estado para almacenar los valores de cada tipo de menú
  const [menuData, setMenuData] = useState({
    Almuerzo: {
      mainDish: "",
      drink: "",
      dessert: "",
      price: 0,
    },
    Refrigerio: {
      appetizer: "",
      drink: "",
      dessert: "",
      price: 0,
    },
  });

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
            />
          </div>

          {/* TextArea para Postre */}
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
            />
          </div>

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
            />
          </div>

          <div style={{ margin: "24px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
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
              >
                Editar
              </Button>
            </div>
          </div>
        </MenuBecas>
      </div>
    </>
  );
};

export default Menu;
