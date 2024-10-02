import React from 'react';
import TopNavbar from '../../components/TopNavbar';
import { Card, Space, Button, Form, Input } from 'antd';

const ChangePassword = () => {
  return (
    <>
      <TopNavbar />

      {/* Contenido principal */}
      <main style={styles.main}>
        <Card bordered={true} style={styles.card}>
          {/* Título */}
          <Space style={styles.titleSpace}>
            <h1 className="titleCard">Cambiar contraseña</h1>
          </Space>

          <p style={styles.paragraph}>La contraseña debe contener mínimo 8 caracteres.</p>

          {/* Formulario de cambio de contraseña */}
          <Form layout="vertical" style={styles.form}>
            {/* Campo Contraseña actual */}
            <Form.Item label="Contraseña">
              <Input.Password id="current-password" placeholder="Contraseña actual" />
            </Form.Item>

            {/* Campo Nueva contraseña */}
            <Form.Item label="Nueva contraseña">
              <Input.Password id="new-password" placeholder="Nueva contraseña" />
            </Form.Item>

            {/* Campo Confirmar nueva contraseña */}
            <Form.Item label="Confirmar nueva contraseña">
              <Input.Password id="confirm-password" placeholder="Confirmar nueva contraseña" />
            </Form.Item>

            {/* Botones */}
            <div style={styles.buttonContainer}>
              {/* Botón Guardar */}
              <Button type="default" htmlType="submit" className="button-save">
                Guardar
              </Button>

              {/* Botón Cancelar */}
              <Button type="default" htmlType="reset" className="button-cancel">
                Cancelar
              </Button>
            </div>
          </Form>
        </Card>
      </main>

      {/* Estilos en línea para la responsividad */}
      <style jsx>{`
        main {
          margin-top: 100px;
          padding: 0 20px;
          display: flex;
          justify-content: center;
        }

        .card {
          width: 100%;       /* Ancho del 100% para ser flexible */
          max-width: 500px;  /* Limitar el ancho máximo a 500px */
          margin-top: 100px;
          margin: 3px auto;
          justify-content: center;
        }

        .titleCard {
          color: #C20E1A; /* Cambia el color según sea necesario */
        }

        p {
          text-align: center; /* Centrar texto */
          margin: 10px 0;    /* Margen para el párrafo */
        }

        /* Media query para ajustar el diseño en pantallas más pequeñas */
        @media (max-width: 768px) {
          main {
            padding: 0 10px; /* Reducir el padding en pantallas pequeñas */
          }

          .titleCard {
            font-size: 1.5rem; /* Ajustar el tamaño del título en pantallas pequeñas */
          }

          p {
            font-size: 0.9rem; /* Ajustar el tamaño del texto en pantallas pequeñas */
          }
        }
      `}</style>
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

export default ChangePassword;