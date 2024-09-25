import {
  Col, 
  Flex,
  Row 
} from "antd";

import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";

export default function ManagementUsers(){
  //const [changeTypeUser, setChangeTypeUser] = useState(false);

  return (
    <>
      <HeaderAdmin/>
      <Row>
        <Col span={5}></Col>
        <Col span={14}>
        <nav className="bg-transparent">
          <button/>
          <Flex 
          justify="center" 
          align="flex-end" 
          gap="large">
            <button className="rounded-t-lg">
              Estudiantes
            </button>
            <button className="rounded-t-lg">
              Funcionarios
            </button>
          </Flex>
        </nav>
        </Col>
        <Col span={5}></Col>
      </Row>
    </>
  )
}