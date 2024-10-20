import styles from "../../styles/global/inputSmall.module.css"
import PropTypes from "prop-types"

export default function LabelAsteric({
  title = "",
  isRenderAsteric = false,
  labelClass = "",
  children
}){
  return (
  <>
    <label className={`${styles.labels} ${labelClass}`}>
      {title} {isRenderAsteric ? <span className={styles.asteric}>*</span> : ""}
      {children}
    </label>
  </>
  )
}

LabelAsteric.propTypes = {
  title: PropTypes.string,
  isRenderAsteric: PropTypes.bool,
  labelClass: PropTypes.string
}