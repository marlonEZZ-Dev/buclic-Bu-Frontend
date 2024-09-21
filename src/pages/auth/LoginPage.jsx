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
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh", 
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
              style={{ height: 33, width: "100%", marginBottom: 20 }} 
            />

            <Input.Password
              placeholder="Contraseña"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ height: 33, width: "100%", marginBottom: 20 }} 
            />

            <Button
              type="primary"
              style={{ width: "100%", height: 33 }} 
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
