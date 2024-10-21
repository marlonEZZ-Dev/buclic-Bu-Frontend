import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import SmallInput from "../../components/global/SmallInput.jsx"; 
import DateSpanish from "../../components/global/DateSpanish.jsx";
import ComboBox from "../../components/global/ComboBox.jsx";
import TextArea from "../../components/global/TextArea.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";

import styles from "../../styles/Nurse/VisitsNurser.module.css"
import { inputs } from "../../styles/global/inputSmall.module.css"
import { comboboxes } from "../../styles/admin/managementUsers.module.css"

import {Card, Flex} from "antd";

export default function BecasNurse(){
  const cbxDiagnostic = [
    {value:"colicoMenstrual", label:"Cólicos Menstruales"},
    {value:"curacion", label:"Curación"},
    {value:"dolorCabeza", label:"Dolor de cabeza"},
    {value:"dolorEstomacal", label:"Dolor estomacal"},
    {value:"dolorMuscular", label:"Dolor muscular"},
    {value:"mareosDesmayos", label:"Mareos / Desmayos"},
    {value:"preservativos", label:"Preservativos"}
  ]

  const cbxGender = [
    {value:"m", label:"Masculino"},
    {value:"f", label:"Femenino"}
  ]
  
  return(
    <>
      <HeaderNurse/>
      <div className={styles.contentTitle}>
        <span>Registro de actividades</span>
        <p>Aquí se podrán registrar las actividades de usuarios al servicio</p>
      </div>
      <Card className={styles.card}>
      <Flex vertical justify="center" align="center">
        <Flex className={styles.divider} gap={30}>
          <DateSpanish
          title="Fecha"
          isRenderAsteric
          placeholder="Fecha de la visita"
          required
          className={inputs}
          // onBlur={e => {e.}} 
          />
          <SmallInput
          title="Nombre"
          isRenderAsteric
          placeholder="Nombre del paciente"
          required
          />
        </Flex>
        <Flex className={styles.divider} gap={30}>
          <SmallInput
          title="Teléfono"
          isRenderAsteric
          placeholder="Teléfono del paciente"
          required
          />
          <SmallInput
          title="Código / cédula"
          isRenderAsteric
          placeholder="Código/cédula del paciente"
          required
          />
        </Flex>
        <Flex className={styles.divider} gap={30}>
          <SmallInput
          title="Plan / área dependencia"
          isRenderAsteric
          placeholder="Plan / área dependencia"
          required
          />
          <SmallInput
          title="Semestre"
          placeholder="Semestre del paciente"
          />
        </Flex>
        <Flex className={styles.divider} gap={30}>
          <ComboBox
          title="Género"
          isRenderAsteric
          placeholder="Seleccione"
          options={cbxGender}
          className={comboboxes}
          />
          <ComboBox
          title="Diagnóstico"
          isRenderAsteric
          placeholder="Seleccione"
          options={cbxDiagnostic}
          className={comboboxes}
          />
        </Flex>
      </Flex>
      <TextArea
        title="Conducta"
        labelClass={styles.textAlignLeft}
        placeholder="Conducta de la actividad"
        className={`${styles.textArea} ${styles.divider}`}
        autoSize={{minRows:3, maxRows:8}}
        required
      />
      <Flex justify="center" align="center" className={styles.divider} gap={30}>
        <button className="button-save">Guardar</button>
        <button className="button-cancel">Cancelar</button>
      </Flex>
      </Card>
      <FooterProfessionals/>
    </>
  );
}