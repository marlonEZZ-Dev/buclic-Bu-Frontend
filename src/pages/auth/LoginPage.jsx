import { Fragment } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function LoginPage() {
  return (
    <Fragment>
      <TopNavbar />
      {/* Contenedor principal con estilo flex */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh", // Ajusta la altura según sea necesario
        }}
      >
        <Card
          hoverable
          title={
            <div style={{ textAlign: "center" }}>Bienestar Universitario</div>
          }
          style={{ width: 401, height: "auto" }}
          styles={{
            header: { borderBottom: "none" },
          }}
        >
          <form>
            <Input
              placeholder="Usuario"
              prefix={<UserOutlined />}
              style={{ height: 33, width: "100%", marginBottom: 20 }} // Ancho 100% para ajustar al contenedor
            />

            <Input.Password
              placeholder="Contraseña"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ height: 33, width: "100%", marginBottom: 20 }} // Ancho 100% para ajustar al contenedor
            />

            <Button
              type="primary"
              style={{ width: "100%", height: 33 }} // Ancho 100% para igualar a los inputs
            >
              Iniciar sesión
            </Button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a href="#">¿Olvidó su nombre de usuario o contraseña?</a>
            </div>
          </form>
        </Card>
      </div>
    </Fragment>
  );
}
