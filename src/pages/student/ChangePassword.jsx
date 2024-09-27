import React from 'react';
import TopNavbar from '../../components/TopNavbar';
import { Card, Space, Button, Form, Input } from 'antd';

const ChangePassword = () => {
  return (
    <>
      <TopNavbar />

      {/* Contenido principal */}
      <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>

        <Card
          bordered={true}
          style={{
              width: '500px',
              marginTop: '100px',
              margin: '3px auto',
              justifyContent: 'center',
          }}
        >

          {/* Título */}
          <Space style={{ marginTop: '5px',alignItems: 'center' }}>
          <h1 className="titleCard">Cambiar contraseña</h1>
          </Space>

          
          <p>La contraseña debe contener mínimo 8 caracteres.</p>

          {/* Formulario de cambio de contraseña */}
          <Form layout="vertical" style={{ marginTop: '8px' }} >

              {/* Campo Contraseña actual */}
              <Form.Item label="Contraseña">
                <Input.Password id="current-password" placeholder="Contraseña actual" />
              </Form.Item>

              {/* Campo Nueva contraseña */}
              <Form.Item label="Nueva contraseña">
                <Input.Password id="current-password" placeholder="Nueva contraseña" />
              </Form.Item>

              {/* Campo Confirmar nueva contraseña */}
              <Form.Item label="Confirmar nueva contraseña">
                <Input.Password id="current-password" placeholder="Confirmar nueva contraseña" />
              </Form.Item>



            {/* Botones */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>

              {/* Botón Guardar */}
              <Button
                type="default"
                htmlType="submit"
                className="button-save"
              >
                Guardar
              </Button>

              {/* Botón Cancelar */}
              <Button
                type="default"
                htmlType="reset"
                className="button-cancel"
              >
                Cancelar
              </Button>

            </div>
          </Form>

        </Card>
      </main>
    </>
  );
};

export default ChangePassword;

