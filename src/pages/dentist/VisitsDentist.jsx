import React, { useState } from "react";
import { DatePicker, Form, Card, Space, Input, Select, Row, Col, Button, message } from "antd";
import esLocale from "antd/es/date-picker/locale/es_ES";
import HeaderDentist from "../../components/dentist/HeaderDentist";

const VisitsDentist = () => {
  const [fecha, setFecha] = useState(null);
  const [codigoCedula, setCodigoCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [planArea, setPlanArea] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [form] = Form.useForm();

  const motivoOptions = [
    "Ayudas diagnósticas",
    "Formulación de medicamentos",
    "Higiene oral",
    "Remisión a otras dependencias",
    "Resina de fotocurado",
    "Revaloración",
    "Urgencia odontológica",
    "Valoración primera vez",
  ];

  const handleRegisterVisit = () => {
    form.validateFields().then(() => {
      const payload = {
        fecha,
        codigoCedula,
        nombre,
        apellido,
        planArea,
        motivo,
        descripcion,
      };
      console.log("Datos del formulario:", payload);
      message.success("Visita registrada exitosamente");
      resetFields();
    }).catch(() => {
      message.error("Por favor, complete todos los campos obligatorios");
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
                    <Input
                      placeholder="Código/cédula paciente"
                      value={codigoCedula}
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
                      options={motivoOptions.map((option) => ({ value: option, label: option }))}
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
            <Button type="primary" className='button-save' onClick={handleRegisterVisit}>Guardar</Button>
            <Button className='button-cancel' onClick={resetFields}>Cancelar</Button>
          </div>
        </Card>
      </main>
    </>
  );
};

export default VisitsDentist;
