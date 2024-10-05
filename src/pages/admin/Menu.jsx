import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import { Button, Input, TimePicker, Space, DatePicker } from "antd";
import React, { useState } from "react";
const { TextArea } = Input;
import axios from "axios";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

<RangePicker
  style={{ width: '100%' }}
  showTime={{ format: 'HH:mm', use12Hours: false }} // Ajusta según tus necesidades
/>

const Menu = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Almuerzo");
  const [isEditable, setIsEditable] = useState({
    Almuerzo: false,
    Refrigerio: false,
    Ajustes: false, // Añadir "Hola" aquí
  });

  // fecha actual
  const todayDate = new Date().toLocaleDateString();

  // Estado para que me diferencie si es almuerzo, refrigerio o hola
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
    Ajustes: {
      text: "Este es el texto para ajustes",
    },
  });

  const saveMenu = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const menuTypeData = menuData[selectedType];

    if (!token) {
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
    { type: "Ajustes", label: "Ajustes" }, // Añadir botón Ajustes
  ];

  const handleInputChange = (field, value) => {
    setMenuData((prevData) => ({
      ...prevData,
      [selectedType]: {
        ...prevData[selectedType],
        [field]: value,
      },
    }));
  };

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

  // Determinar si es Almuerzo, Refrigerio o Hola para cambiar el label y el placeholder
  const isLunch = selectedType === "Almuerzo";
  const SettingsA = selectedType === "Ajustes"; // Nuevo estado para Hola
  const mainDishLabel = isLunch ? "Plato Principal" : "Aperitivo";
  const mainDishPlaceholder = isLunch
    ? "Describe el plato principal"
    : "Describe el aperitivo";

  // Datos para la tabla
  const columns = [
    {
      title: 'Columna 1',
      dataIndex: 'col1',
      key: 'col1',
    },
    {
      title: 'Columna 2',
      dataIndex: 'col2',
      key: 'col2',
    },
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
          {selectedType === "Ajustes" ? (
            <div style={{ marginBottom: "10px", textAlign: 'left' }}> {/* Asegúrate de que todo esté alineado a la izquierda */}
              <h3>Aquí hay ajustes adicionales relacionados a las becas de alimentación.</h3>

              <p style={{ marginTop: "20px", textAlign: "left" }}>Duración del semestre</p>
              <Space direction="vertical" size={12}>
                <RangePicker style={{ width: '100%' }} />
              </Space>

              {/* Inputs para el número de becas */}
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ width: '48%' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>No. Becas almuerzo</label>
                    <Input
                      type="number"
                      placeholder="Ingrese el número de becas para almuerzo"
                      min={0}
                      step={1}
                      style={{ width: '100%' }} // Asegúrate de que el input ocupe todo el ancho disponible
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) || value === "") {
                          // Actualiza el estado o realiza alguna acción si es necesario
                        } else {
                          console.error("Por favor, ingresa solo números positivos.");
                        }
                      }}
                    />
                  </div>
                  <div style={{ width: '48%' }}>
                    <label style={{ display: 'block' }}>No. Becas refrigerio</label>
                    <Input
                      type="number"
                      placeholder="Ingrese el número de becas para refrigerio"
                      min={0}
                      step={1}
                      style={{ width: '100%' }} // Asegúrate de que el input ocupe todo el ancho disponible
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) || value === "") {
                          // Actualiza el estado o realiza alguna acción si es necesario
                        } else {
                          console.error("Por favor, ingresa solo números positivos.");
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Secciones para acceso */}
                <p style={{ marginTop: "20px", textAlign: "left" }}>Acceso para beneficiarios almuerzo</p>
                <Space direction="vertical" size={12}>
                  <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                    <TimePicker placeholder="Inicio" style={{ width: '58%' }} format="HH:mm" />
                    <TimePicker placeholder="Fin" style={{ width: '48%' }} format="HH:mm" />
                  </Space>
                </Space>

                {/* Acceso para venta libre almuerzo */}
                <p style={{ marginTop: "20px", textAlign: "left" }}>Acceso para venta libre almuerzo</p>
                <Space direction="vertical" size={12}>
                  <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                    <TimePicker placeholder="Inicio" style={{ width: '58%' }} format="HH:mm" />
                    <TimePicker placeholder="Fin" style={{ width: '48%' }} format="HH:mm" />
                  </Space>
                </Space>

                {/* Acceso para beneficiarios refrigerio */}
                <p style={{ marginTop: "20px", textAlign: "left" }}>Acceso para beneficiarios refrigerio</p>
                <Space direction="vertical" size={12}>
                  <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                    <TimePicker placeholder="Inicio" style={{ width: '58%' }} format="HH:mm" />
                    <TimePicker placeholder="Fin" style={{ width: '48%' }} format="HH:mm" />
                  </Space>
                </Space>

                {/* Acceso para venta libre refrigerio */}
                <p style={{ marginTop: "20px", textAlign: "left" }}>Acceso para venta libre refrigerio</p>
                <Space direction="vertical" size={12}>
                  <Space direction="horizontal" size={12} style={{ width: '100%' }}>
                    <TimePicker placeholder="Inicio" style={{ width: '58%' }} format="HH:mm" />
                    <TimePicker placeholder="Fin" style={{ width: '48%' }} format="HH:mm" />
                  </Space>
                </Space>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: "12px" }}>
                <Button
                  type="default"
                  className="button-save"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  Editar
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* TextArea para Nota */}
              <div style={{ width: "100%", marginBottom: "12px", display: "flex", alignItems: "center" }}>
                <label style={{ marginRight: "12px", textAlign: "left", width: "50px" }}>Nota</label>
                <TextArea
                  placeholder="Añade una nota"
                  autoSize
                  style={{ width: "100%" }}
                  value={menuData[selectedType].note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  disabled={!isEditable[selectedType]}
                />
              </div>
              <p style={{ textAlign: "center", margin: "4px 0 12px 0", fontSize: "16px" }}>
                Diligencia los datos para el {selectedType} - {todayDate}
              </p>

              {/* TextArea para el plato principal o aperitivo */}
              <div style={{ width: "100%", marginBottom: "12px" }}>
                <label style={{ marginBottom: "6px", textAlign: "left", display: "block" }}>
                  {mainDishLabel}
                </label>
                <TextArea
                  placeholder={mainDishPlaceholder}
                  autoSize
                  style={{ width: "100%" }}
                  value={menuData[selectedType][isLunch ? "mainDish" : "appetizer"]}
                  onChange={(e) =>
                    handleInputChange(isLunch ? "mainDish" : "appetizer", e.target.value)
                  }
                  disabled={!isEditable[selectedType]}
                />
              </div>

              {/* TextArea para Bebida */}
              <div style={{ width: "100%", marginBottom: "12px" }}>
                <label style={{ marginBottom: "6px", textAlign: "left", display: "block" }}>Bebida</label>
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
                  <label style={{ marginBottom: "6px", textAlign: "left", display: "block" }}>Postre</label>
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
                <label style={{ marginBottom: "6px", textAlign: "left", display: "block" }}>Precio</label>
                <Input
                  type="text"
                  placeholder="Ingresa el precio"
                  value={menuData[selectedType].price === 0 ? "" : menuData[selectedType].price}
                  onChange={(e) => {
                    const value = e.target.value;
                    const validatedValue = value.replace(/[^0-9]/g, "");
                    handleInputChange("price", validatedValue === "" ? 0 : parseInt(validatedValue, 10));
                  }}
                  style={{ width: "100%" }}
                  disabled={!isEditable[selectedType]}
                />
              </div>

              {/* Botones Editar, Guardar y Cancelar */}
              <div style={{ margin: "24px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                  {!isEditable[selectedType] ? (
                    <Button
                      type="default"
                      style={{ backgroundColor: "#C20E1A", color: "#FFFFFF", border: "none", height: "30px", width: "149px" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#841F1C"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C20E1A"; }}
                      onClick={handleEdit} // Habilitar edición solo del menú seleccionado
                    >
                      Editar
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="default"
                        style={{ backgroundColor: "#C20E1A", color: "#FFFFFF", border: "none", height: "30px", width: "149px" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#841F1C"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C20E1A"; }}
                        onClick={() => {
                          saveMenu(); // Llamar a la función para guardar el menú
                          setIsEditable({ ...isEditable, [selectedType]: false });
                        }}
                      >
                        Guardar
                      </Button>

                      <Button
                        type="default"
                        style={{ backgroundColor: "#FFFFFF", color: "#C20E1A", border: "1px solid #C20E1A", height: "30px", width: "149px" }}
                        onClick={handleCancel} // Cancelar edición solo del menú seleccionado
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </MenuBecas>
      </div>
    </>
  );
};

export default Menu;

