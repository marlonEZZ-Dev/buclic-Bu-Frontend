import PropTypes from "prop-types"
import ActiveIcon from "../../assets/icons/active.svg"
import InactiveIcon from "../../assets/icons/inactive.svg"
import styles from "../../styles/global/stateUser.module.css"
import { useState } from "react"
// active : active or inactive the image showm

export default function StateUser({active}){

  const [isActive, setIsActive] = useState(active)
  
  return (
    <button className={styles.button} onClick={() => setIsActive(!isActive)}>
      <img className={styles.image} src={isActive ? ActiveIcon : InactiveIcon}/>
    </button>
  )
}

StateUser.propTypes = {
  active : PropTypes.bool.isRequired
}