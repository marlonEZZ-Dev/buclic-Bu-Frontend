import {Flex} from "antd"
import {MailOutlined} from "@ant-design/icons"

import styles from "../../styles/global/footerProfessionals.module.css"
import { useState, useEffect } from "react";

export default function FooterProfessionals({...props}){
  const [deviceType, setDeviceType] = useState("")
  
  const globalTextWhite = {
    color:"#ffffff"
  }

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
  
  useEffect(() => {
    handleResize();

    // Añade el event listener para cambios en el tamaño de la pantalla
    window.addEventListener('resize', handleResize);

    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  let isMobile = deviceType === "mobile"
  let enableResponsive = isMobile || deviceType === "tablet"
  return (
    <>
      <footer className={styles.footer} {...props}>
        <Flex 
        style={globalTextWhite}
        justify="flex-start"
        align="center"
        gap={32}>
          <p className={styles.title}>Universidad del Valle</p>
        </Flex>
        <Flex className={styles.box}>
          <Flex 
          vertical={!isMobile}
          style={globalTextWhite}
          className={styles.boxLeft}>
            <p className={`${styles.parag} ${styles.subtitle}`}>Más información</p>
            <p className={`${styles.parag} ${styles.pTranspa} text-left`}>
              Servicio de Psicología Tercer piso Bloque A
              <br />
              Seccional Palmira
              <br /><br />
              Servicio de Enfermería Primer piso Bloque A
              <br />
              Seccional Palmira
              <br /><br />
              Servicio de Odontología Segundo piso Bloque A
              <br />
              Seccional Palmira
            </p>
          </Flex>
          <Flex 
          vertical={!isMobile}
          style={globalTextWhite}
          className={styles.boxRight}>
            <p className={`${styles.parag} ${styles.subtitle}`}>Contacto</p>
            <p className={`${styles.parag} text-left`}>
              <MailOutlined className={styles.email}/>  Servicio de Psicología
              <br />            
                <a className={styles.ancle} href="mailto:servicio.psicologia.palmira@correounivalle.edu.co">servicio.psicologia.palmira@correounivalle.edu.co</a>
              <br /><br />            
              <MailOutlined className={styles.email}/>  Servicio de Enfermería
              <br />            
                <a className={styles.ancle} href="mailto:servicio.enfermeria.palmira@correounivalle.edu.co">servicio.enfermeria.palmira@correounivalle.edu.co</a>
              <br /><br />            
              <MailOutlined className={styles.email}/>  Servicio de Odontología
              <br />
                <a className={styles.ancle} href="mailto:carlosfer2284@hotmail.com">carlosfer2284@hotmail.com</a>
            </p>
          </Flex>
        </Flex>
      </footer>
    </>
  )
}