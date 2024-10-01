import { useState } from "react"
import PropTypes from "prop-types"
import ActiveIcon from "../../assets/icons/active.svg"
import InactiveIcon from "../../assets/icons/inactive.svg"

// active : active or inactive the image showm

export default function StateUser({active, ...props}){
  
  const [isActive, setIsActive] = useState(active)
  
  const handlerClick = () => setIsActive(!isActive)

  return(
    <button
    {...props}
    onClick={ handlerClick }>
      <img src={isActive ? ActiveIcon : InactiveIcon}/>      
    </button>
  )
}

StateUser.propTypes = {
  active : PropTypes.bool.isRequired
}