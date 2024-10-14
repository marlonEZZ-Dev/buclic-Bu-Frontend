import React, { useState } from 'react';
import api from '../../api';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import { Card, Space, Button, Form, Input, message } from 'antd';
import Modal from '../../components/global/Modal';

const PasswordAdmin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [confirmLoading, setConfirmLoading] = useState(false); // Estado para la carga del botón de confirmar

  // Obtener el nombre de usuario del almacenamiento local
  const username = localStorage.getItem('username');

  // Función que se llama al confirmar el cambio de contraseña
  const handleConfirmChangePassword = async (values) => {
    try {
      setConfirmLoading(true);

      const response = await api.post('/users/changePassword', {
        username: username, // Incluir el nombre de usuario
        password: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      message.success(response.data.message || 'Contraseña cambiada con éxito');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setConfirmLoading(false);
      setModalVisible(false); // Cierra el modal después de confirmar
    }
  };

  // Función que se llama al enviar el formulario
  const onFinish = (values) => {
    setModalVisible(true); // Mostrar modal de confirmación
  };

  return (
    <>
      <HeaderAdmin />

      {/* Contenido principal */}
      <main style={styles.main}>
        <Card bordered={true} style={styles.card}>
          {/* Título */}
          <Space style={styles.titleSpace}>
            <h1 className="titleCard">Cambiar contraseña</h1>
          </Space>

          <p style={styles.paragraph}>La contraseña debe contener mínimo 8 caracteres.</p>

          {/* Formulario de cambio de contraseña */}
          <Form
            form={form}
            layout="vertical"
            style={styles.form}
            onFinish={onFinish}
          >
            {/* Campo Contraseña actual */}
            <Form.Item
              label="Contraseña actual"
              name="currentPassword"
              rules={[{ required: true, message: 'Por favor ingresa tu contraseña actual' }]}
            >
              <Input.Password placeholder="Contraseña actual" />
            </Form.Item>

            {/* Campo Nueva contraseña */}
            <Form.Item
              label="Nueva contraseña"
              name="newPassword"
              rules={[{ required: true, message: 'Por favor ingresa la nueva contraseña' }]}
            >
              <Input.Password placeholder="Nueva contraseña" />
            </Form.Item>

            {/* Campo Confirmar nueva contraseña */}
            <Form.Item
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Por favor confirma tu nueva contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirmar nueva contraseña" />
            </Form.Item>

            {/* Botones */}
            <div style={styles.buttonContainer}>
              {/* Botón Guardar */}
              <Button className="button-save" type="default" htmlType="submit" loading={loading} >
                Guardar
              </Button>

              {/* Botón Cancelar */}
              <Button className="button-cancel" type="default" htmlType="reset" onClick={() => form.resetFields()} >
                Cancelar
              </Button>
            </div>
          </Form>

          {/* Modal de confirmación */}
          <Modal 
            open={modalVisible} 
            onClose={setModalVisible} 
            modalTitle="Confirmar cambio de contraseña"
          >
            <p>¿Estás seguro de que deseas cambiar la contraseña?</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button className="button-cancel" onClick={() => setModalVisible(false)}>Cancelar</Button>
              <Button 
                className="button-save"
                type="primary" 
                loading={confirmLoading}
                onClick={() => {
                  const values = form.getFieldsValue(); // Obtener los valores del formulario
                  handleConfirmChangePassword(values); // Llamar a la función para confirmar el cambio de contraseña
                }}
              >
                Confirmar
              </Button>
            </div>
          </Modal>
        </Card>
      </main>
    </>
  );
};

// Estilos en línea
const styles = {
  main: {
    marginTop: '100px',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    marginTop: '100px',
    margin: '3px auto',
    justifyContent: 'center',
  },
  titleSpace: {
    marginTop: '5px',
    alignItems: 'center',
  },
  paragraph: {
    textAlign: 'center',
    margin: '10px 0',
  },
  form: {
    marginTop: '8px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
};

export default PasswordAdmin;
