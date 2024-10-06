import {Flex} from "antd"
import {MailOutlined} from "@ant-design/icons"

import styles from "../../styles/global/footerProfessionals.module.css"

export default function FooterProfessionals(){
  const globalTextWhite = {
    color:"#ffffff"
  }
  
  return (
    <>
      <footer className={styles.footer}>
        <Flex 
        style={globalTextWhite}
        justify="flex-start"
        align="center"
        gap={32}>
          <p className={styles.title}>Universidad del Valle</p>
        </Flex>
        <Flex className={styles.box}>
          <Flex 
          vertical 
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
          vertical 
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