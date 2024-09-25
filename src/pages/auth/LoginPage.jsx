import { Fragment } from "react";
import TopNavbar from "../../components/TopNavbar";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/background.css"; // Asegúrate de importar tu archivo CSS

export default function LoginPage() {
  return (
    <Fragment>
      <TopNavbar />
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Cambiado a 100vh para ocupar toda la pantalla
          backgroundColor: "#F5F5F5", // Fondo de la página
        }}
      >
        <Card
          hoverable
          title={
            <div style={{ 
              textAlign: "center", 
              fontSize: "24px",  // Aumenta el tamaño del título
              color: "#C20E1A",  // Color rojo del título
               // Negrita para resaltar el título
            }}>
              Bienestar Universitario
            </div>
          }
          style={{
            width: 401,
            height: "auto",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)", // Sombra constante e intensa
            borderRadius: "8px", // Esquinas redondeadas 
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
              style={{
                width: "100%",
                height: 33,
                backgroundColor: "#C20E1A", // Color del botón
                borderColor: "#C20E1A", // Color del borde del botón para evitar cambios al pasar el mouse
              }}
            >
              Iniciar sesión
            </Button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a 
                href="reestablecerContrasena" 
                style={{ color: "#C20E1A" }} // Color rojo para el enlace
              >
                ¿Olvidó su nombre de usuario o contraseña?
              </a>
            </div>
          </form>
        </Card>
      </div>
    </Fragment>
  );
}


// export default function LoginPage() {
//   return (
//     <Fragment>
//       <TopNavbar />
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           backgroundColor: "#F5F5F5",
//         }}
//       >
//         <Card
//           hoverable
//           title={
//             <div
//               style={{
//                 textAlign: "center",
//                 fontSize: "24px",
//                 color: "#C20E1A",
//                 fontWeight: "bold",
//               }}
//             >
//               Bienestar Universitario
//             </div>
//           }
//           style={{
//             width: 401,
//             height: "auto",
//             boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
//             borderRadius: "8px",
//           }}
//         >
//           <form>
//             <Input
//               placeholder="Usuario"
//               prefix={<UserOutlined />}
//               style={{ height: 40, width: "100%", marginBottom: 20 }}
//             />

//             <Input.Password
//               placeholder="Contraseña"
//               iconRender={(visible) =>
//                 visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//               }
//               style={{ height: 40, width: "100%", marginBottom: 20 }}
//             />

//             <Button
//               type="primary"
//               style={{
//                 width: "100%",
//                 height: 40,
//                 backgroundColor: "#C20E1A",
//                 borderColor: "#C20E1A",
//               }}
//             >
//               Iniciar sesión
//             </Button>

//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <a href="reestablecerContrasena" style={{ color: "#C20E1A" }}>
//                 ¿Olvidó su nombre de usuario o contraseña?
//               </a>
//             </div>
//           </form>
//         </Card>
//       </div>
//     </Fragment>
//   );
// }