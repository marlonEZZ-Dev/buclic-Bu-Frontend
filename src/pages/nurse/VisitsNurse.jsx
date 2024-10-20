import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import {Card, Flex, Select, TextArea} from "antd";
import SmallInput from "../../components/global/SmallInput.jsx"; 

export default function BecasNurse(){
  return(
    <>
      <HeaderNurse/>
      <Flex justify="center" align="center">
        <span>Registro de actividades</span>
        <p>Aquí se podrán registrar las actividades de usuarios al servicio</p>
      </Flex>
      <Card>
      <Flex>
        <Flex>
          <SmallInput/>
          <SmallInput/>
        </Flex>
        <Flex>
          <SmallInput/>
          <SmallInput/>
        </Flex>
        <Flex>
          <SmallInput/>
          <SmallInput/>
        </Flex>
        <Flex>
          <label>
            <Select/>
          </label>
          <label>
            <Select/>
          </label>
        </Flex>
        <Flex>
          <label>
            <TextArea></TextArea>
          </label>
        </Flex>
      </Flex>
      </Card>

    </>
  );
}