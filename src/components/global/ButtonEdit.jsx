import { buttonEdit, color } from "../../styles/global/buttonEdit.module.css"
import { EditOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"

//This component is necesary by render externally of return so that is create separate

// ...pros : This property allow to send others properties known the component button of react
export default function ButtonEdit(...props){
  return(
    <button className={buttonEdit} {...props}>
      <EditOutlined className={color}/>
    </button>
  )
}

ButtonEdit.propTypes = {
  props : PropTypes.object
}