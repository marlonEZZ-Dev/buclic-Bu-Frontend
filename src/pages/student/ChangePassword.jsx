import React from 'react'; // Importar React
import TopNavbar from '../../components/TopNavbar'; // Importar el componente de navegación
import { Card, Flex, Input, Space, Button } from 'antd'; // Importa todos los componentes necesarios de 'antd'


const ChangePassword = () => {
  return (
    <>
      <TopNavbar />
      <Card
        bordered={true}
        style={{
          width: '400px',
          marginTop: '110px',
          margin: '3px auto',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column', // Asegúrate de que los elementos se coloquen en columna
          alignItems: 'center', // Centra horizontalmente
          justifyContent: 'center', // Centra verticalmente
       
        }}
      >

        <Space style={{ marginTop: '8px' }}>
          <h1 style={{ margin: 0, fontSize: 19 }}>Cambiar contraseña</h1>
        </Space>


        <Space direction="vertical" style={{ marginTop: '30px', display: 'flex', alignItems: 'flex-start' }} >

          <label style={{ width: '100%' }}>Contraseña actual</label>
          <Input.Password placeholder="input password" />

          <label style={{ width: '100%' }}>Nueva contraseña</label>
          <Input.Password placeholder="input password" />

          <label style={{ width: '100%' }}>Confirmar nueva contraseña</label>
          <Input.Password placeholder="input password" />

        </Space>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          <Button
            type="default"
            style={{
              backgroundColor: '#C20E1A',
              color: '#FFFFFF',
              border: 'none',
              height: '30px',
              width: '149px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#841F1C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C20E1A';
            }}
          >
            Guardar
          </Button>

          <Button
            type="default"
            style={{
              backgroundColor: '#FFFFFF', // Cambia a blanco
              color: '#C20E1A', // Color del texto rojo
              border: 'none', // Elimina el borde
              height: '30px',
              width: '149px',
              marginTop: '80 px',
              transition: 'background-color 0.3s, color 0.3s', // Transición suave
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#841F1C'; // Cambia a rojo oscuro
              e.currentTarget.style.color = '#FFFFFF'; // Cambia el texto a blanco
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF'; // Vuelve a blanco
              e.currentTarget.style.color = '#C20E1A'; // Vuelve el texto a rojo
            }}
          >
            Cancelar
          </Button>

        </div>

      </Card >
    </>
  );
};

export default ChangePassword;
