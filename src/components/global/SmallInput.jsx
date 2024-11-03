import styles from "../../styles/global/inputSmall.module.css";
import PropTypes, { oneOfType } from "prop-types";

export default function InputSmall({
    isRenderAsteric = true,
    labelClassname = "",
    title = "title",
    errorMessage = "",
    ...props
}) {
    const waitBoolOrString = (data) => {
      if (typeof data === "boolean") return "";
      if (typeof data === "string") return data;
      throw new Error("Property errorMessage debe ser un booleano o string");
    };

    const errorText = waitBoolOrString(errorMessage);
    const hasError = Boolean(errorText);

    return (
        <div className={styles.inputContainer}>
            <label className={`${styles.labels} ${labelClassname}`}>
                <span>
                    {title} {isRenderAsteric ? <span className={styles.asteric}>*</span> : ""}
                </span>
                <input
                    {...props}
                    type={"type" in props ? props.type : "text"}
                    className={`${styles.inputs} ${hasError ? styles.error : ""} ${props.className}`}
                />
            </label>
            {hasError && <span className={styles.message}>{errorText}</span>}
        </div>
    );
}

InputSmall.propTypes = {
    isRenderAsteric: PropTypes.bool,
    labelClassname: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    errorMessage: oneOfType([PropTypes.string, PropTypes.bool]),
    className: PropTypes.string,
    type: PropTypes.string,
};
