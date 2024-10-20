import { ConfigProvider, TimePicker } from "antd";
import PropTypes from "prop-types"
import locale from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

import LabelAsteric from "./LabelAsteric.jsx";

export default function TimeSpanish({ 
  value = "",
  title = "",
  isRenderAsteric = false,
  labelClass = "",
  onChange = () => {}, 
  ...props}) {
  return (
    <ConfigProvider locale={locale}>
      <LabelAsteric
      title={title}
      isRenderAsteric={isRenderAsteric}
      labelClass={labelClass}
      >
        <TimePicker
          value={value}
          onChange={onChange}
          use12Hours
          format="h:mm a"
          {...props}
        />
      </LabelAsteric>
    </ConfigProvider>
  );
}

TimeSpanish.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  title: PropTypes.string,
  isRenderAsteric: PropTypes.bool,
  labelClass: PropTypes.string
}
