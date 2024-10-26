  import styles from "../../styles/global/inputSmall.module.css"

  import PropTypes from "prop-types"

  export default function InputSmall({
    isRenderAsteric= true,
    labelClassname="",
    title="title",
    ...props
  }){

    return(
      <label className={`${styles.labels} ${labelClassname}`}>
        {title} {isRenderAsteric ? <span className={styles.asteric}>*</span> : ""}
        <input 
        {...props}
        type={"type" in props ? props.type : "text"}
        className={`${styles.inputs} ${props.className}`}
        />
      </label>
      )
  }

  InputSmall.propTypes = {
    isRenderAsteric: PropTypes.bool,
    labelClassname: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    props: PropTypes.shape({
      className: PropTypes.string,
      type: PropTypes.string
    })
  }