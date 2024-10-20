import { ConfigProvider, DatePicker } from "antd";

import LabelAsteric from "./LabelAsteric.jsx";

import PropTypes from "prop-types"
import locale from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default function DateSpanish({ 
  value = "", 
  isRenderAsteric = false, 
  labelClass = "", 
  title="title", 
  onChange = () => {}, 
  ...props}) {

  const FIRST_YEAR = "YYYY-MM-DD"
  return (
    <ConfigProvider locale={locale}>
     <LabelAsteric
      isRenderAsteric={isRenderAsteric}
      labelClass={labelClass}
      title={title}
     >
        <DatePicker
          value={value}
          onChange={onChange}
          format={FIRST_YEAR}
          defaultOpenValue={dayjs().format(FIRST_YEAR)}
          {...props}
        />
      </LabelAsteric>
    </ConfigProvider>
  );
}

DateSpanish.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  isRenderAsteric: PropTypes.bool,
  labelClass: PropTypes.string,
  title: PropTypes.string
}
