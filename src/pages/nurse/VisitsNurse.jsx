import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import SmallInput from "../../components/global/SmallInput.jsx"; 
import DateSpanish from "../../components/global/DateSpanish.jsx";
import ComboBox from "../../components/global/ComboBox.jsx";
import TextArea from "../../components/global/TextArea.jsx";
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import Modal from "../../components/global/Modal.jsx"

import styles from "../../styles/Nurse/VisitsNurser.module.css"
import { inputs } from "../../styles/global/inputSmall.module.css"
import { comboboxes } from "../../styles/admin/managementUsers.module.css"

import {Card, Flex} from "antd";
import { useEffect, useState } from "react";
import { validCodeOrNuip, validDate, validFullName, validListEmpty, validPhone, validPlanOrArea, validSemester } from "../../services/validations.js";

export default function BecasNurse(){
  const [deviceType, setDeviceType] = useState("")
  const [defineModal, setDefineModal] = useState({status:false, title:"", content:""})

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

  const handleResize = () => {
    const width = window.innerWidth;

    if (width <= 767) {
      setDeviceType('mobile');
    } else if (width >= 768 && width <= 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  };
  
  const changeModalWarning = message => {
    if(typeof message === "string"){
      setDefineModal({
        status: true,
        title: "Advertencia",
        content: message
      })
    }
  } 

  const handlerVDate = value => {
    const message = validDate(value)
    changeModalWarning(message)
  }

  const handlerVFullName = value => {
    const message = validFullName(value)
    changeModalWarning(message)
  }

  const handlerVPhone = value => {
    const message = validPhone(value)
    changeModalWarning(message)
  }

  const handlerVCodeOrNuip = value => {
    const message = validCodeOrNuip(value)
    changeModalWarning(message)
  }

  const handlerVPlanOrArea = value => {
    const message = validPlanOrArea(value)
    changeModalWarning(message)
  }

  const handlerVSemester = value => {
    const message = validSemester(value)
    changeModalWarning(message)
  }

  const handlerVGender = value => {
    const message = validListEmpty(cbxGender, value,"Debe elegir un Género")
    changeModalWarning(message)
  }

  const handlerVDiagnostic = value => {
    const message = validListEmpty(cbxDiagnostic, value, "Debe elegir un tipo de diagnóstico")
    changeModalWarning(message)
  }

  const handlerCloseModal = () => {
    setDefineModal( obj => ({
      ...obj,
      status: false
    }))
  }

  useEffect(() => {
    handleResize();

    // Añade el event listener para cambios en el tamaño de la pantalla
    window.addEventListener('resize', handleResize);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])


  let isMobile = deviceType === "mobile"
  // let enableResponsive = isMobile || deviceType === "tablet"

  return(
    <>
      <HeaderNurse/>
      <Modal open={defineModal.status} onClose={handlerCloseModal}>
        <Flex vertical gap={30}>
          <Flex justify="center" align="center">
            <span>{defineModal.title}</span>
          </Flex>
            <p>{defineModal.content}</p>
          <Flex justify="center" align="center">
            <button onClick={handlerCloseModal} className="button-save">
              Entendido
            </button>
          </Flex>
        </Flex>
      </Modal>
      <div className={styles.contentTitle}>
        <span>Registro de actividades</span>
        <p>Aquí se podrán registrar las actividades de usuarios al servicio</p>
      </div>
      <Card className={styles.card}>
      <Flex vertical justify="center" align="center">
        <Flex className={styles.divider} vertical={isMobile} gap={30}>
          <DateSpanish
          title="Fecha"
          isRenderAsteric
          placeholder="Fecha de la visita"
          required
          className={inputs}
          blur={e => handlerVDate(e.value)}  
          />
          <SmallInput
          title="Nombre"
          isRenderAsteric
          placeholder="Nombre del paciente"
          required
          onBlur={e => handlerVFullName(e.currentTarget.value)}
          />
        </Flex>
        <Flex className={styles.divider} vertical={isMobile} gap={30}>
          <SmallInput
          title="Teléfono"
          isRenderAsteric
          placeholder="Teléfono del paciente"
          required
          onBlur={e => handlerVPhone(e.currentTarget.value)}
          />
          <SmallInput
          title="Código / cédula"
          isRenderAsteric
          placeholder="Código/cédula del paciente"
          required
          onBlur={e => handlerVCodeOrNuip(e.currentTarget.value)}
          />
        </Flex>
        <Flex className={styles.divider} vertical={isMobile} gap={30}>
          <SmallInput
          title="Plan / área dependencia"
          isRenderAsteric
          placeholder="Plan / área dependencia"
          required
          onBlur={ e => handlerVPlanOrArea(e.currentTarget.value)}
          />
          <SmallInput
          title="Semestre"
          placeholder="Semestre del paciente"
          onBlur={e => handlerVSemester(e.currentTarget.value)}
          />
        </Flex>
        <Flex className={styles.divider} vertical={isMobile} gap={30}>
          <ComboBox
          title="Género"
          isRenderAsteric
          placeholder="Seleccione"
          options={cbxGender}
          className={comboboxes}
          blur={e => handlerVGender(e.value)}
          />
          <ComboBox
          title="Diagnóstico"
          isRenderAsteric
          placeholder="Seleccione"
          options={cbxDiagnostic}
          className={comboboxes}
          blur={e => handlerVDiagnostic(e.value)}
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