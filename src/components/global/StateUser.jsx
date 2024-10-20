import PropTypes from "prop-types"
import InactiveIcon from "../../assets/icons/active.svg"
import ActiveIcon from "../../assets/icons/inactive.svg"
import styles from "../../styles/global/stateUser.module.css"
// active : active or inactive the image showm

export default function StateUser({active}){

  return <img className={styles.image} src={active ? ActiveIcon : InactiveIcon}/>
}

StateUser.propTypes = {
  active : PropTypes.bool.isRequired
}