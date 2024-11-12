import React, { useState } from "react";
import { DatePicker, Form, Card, Space, Input, Select, Row, Col, Button, message } from "antd";
import esLocale from "antd/es/date-picker/locale/es_ES";
import HeaderDentist from "../../components/dentist/HeaderDentist";
import SearchInputR from '../../components/global/SearchInputR.jsx';
import api from '../../api';

const VisitsDentist = () => {
  const [fecha, setFecha] = useState(null);
  const [codigoCedula, setCodigoCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [planArea, setPlanArea] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [form] = Form.useForm();

  // Opciones para el campo "Motivo" en mayúsculas
  const motivoOptions = ["AYUDAS_DIAGNOSTICAS", "FORMULACION_DE_MEDICAMENTOS", "HIGIENE_ORAL", "REMISION_A_OTRAS_DEPENDENCIAS", "RESINA_DE_FOTOCURADO", "REVALORACION", "URGENCIA_ODONTOLOGICA", "VALORACION_PRIMERA_VEZ"];

  // Función para formatear las opciones (como en enfermería)
  const formatOptions = (options) => {
    return options.map(option => {
      return option
        .replace(/_/g, ' ')     // Reemplaza el guión bajo por espacio
        .toLowerCase()          // Convierte todo a minúscula
        .replace(/^\w/, c => c.toUpperCase()); // Convierte la primera letra en mayúscula
    });
  };

  // Opciones formateadas para mostrar en el select
  const formattedMotivoOptions = formatOptions(motivoOptions);

  const handleSearchUser = async () => {
    try {
      const { data } = await api.get(`/odontology-visits/search/${codigoCedula}`);
      setNombre(data.name);      // Asignar solo el nombre
      setApellido(data.lastName); // Asignar solo el apellido
      setPlanArea(data.plan);
      message.success("Usuario encontrado");
  
      // Actualizar valores del formulario con los datos encontrados
      form.setFieldsValue({
        nombre: data.name,
        apellido: data.lastName,
        planArea: data.plan,
      });
    } catch (error) {
      message.error("Usuario no registrado. Realice el registro para crearlo.");
      console.error("Error en la búsqueda de usuario:", error);
    }
  };
  
  // Función para registrar una visita
  const handleRegisterVisit = async () => {
    // Validar campos requeridos antes de enviar el payload
    form.validateFields()
      .then(async () => {
        const payload = {
          date: fecha ? fecha.format("YYYY-MM-DD") : null,
          time: "00:00:00", // Hora fija por ahora
          username: codigoCedula,
          name: nombre,
          lastname: apellido,
          plan: planArea,
          reason: motivo,
          description: descripcion,
        };

        console.log("Payload enviado al backend:", payload); // Imprimir el payload en consola

        try {
          await api.post("/odontology-visits/register", payload);
          message.success("Visita registrada exitosamente");
          resetFields();
        } catch (error) {
          message.error("Ocurrió un error al registrar la visita.");
          console.error("Error en el registro:", error);
        }
      })
      .catch(() => {
        message.error("Por favor, complete todos los campos obligatorios.");
      });
  };

  const resetFields = () => {
    setFecha(null);
    setCodigoCedula("");
    setNombre("");
    setApellido("");
    setPlanArea("");
    setMotivo("");
    setDescripcion("");
    form.resetFields();
  };

  return (
    <>
      <HeaderDentist />
      <main style={{ marginTop: "100px" }}>
        <h1 style={{ textAlign: "center", color: "#d32f2f", fontSize: "24px", fontWeight: "bold" }}>Registro de visitas</h1>
        <p style={{ textAlign: "center", color: "#555", fontSize: "16px", marginBottom: "20px" }}>
          Aquí se podrán registrar las visitas de usuarios al servicio
        </p>
        <Card bordered style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "La fecha es obligatoria" }]}>
                    <DatePicker
                      locale={esLocale}
                      onChange={(date) => setFecha(date)}
                      value={fecha}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Código/Cédula" name="codigoCedula" rules={[{ required: true, message: "El código/cedula es obligatorio" }]}>
                    <SearchInputR 
                      value={codigoCedula} 
                      onSearch={handleSearchUser} 
                      onChange={(e) => setCodigoCedula(e.target.value)} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "El nombre es obligatorio" }]}>
                    <Input
                      placeholder="Nombre del paciente"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Apellido" name="apellido" rules={[{ required: true, message: "El apellido es obligatorio" }]}>
                    <Input
                      placeholder="Apellido del paciente"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Plan/Área Dependencia" name="planArea" rules={[{ required: true, message: "El plan de dependencia es obligatorio" }]}>
                    <Input
                      placeholder="Plan o área de dependencia"
                      value={planArea}
                      onChange={(e) => setPlanArea(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Motivo" name="motivo" rules={[{ required: true, message: "El motivo es obligatorio" }]}>
                    <Select
                      value={motivo}
                      onChange={(value) => setMotivo(value)}
                      options={motivoOptions.map((option) => ({
                        value: option,
                        label: formatOptions([option])[0] // Mostrar opción formateada en el selector
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Descripción de la visita" name="descripcion" rules={[{ required: true, message: "La descripción es obligatoria" }]}>
                    <Input.TextArea
                      placeholder="Descripción de la visita"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={4}
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <Button type="primary" className='button-save'onClick={handleRegisterVisit}>Guardar</Button>
            <Button className='button-cancel' onClick={resetFields}>Cancelar</Button>
          </div>
        </Card>
      </main>
    </>
  );
};

export default VisitsDentist;
