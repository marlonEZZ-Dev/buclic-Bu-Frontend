import { ConfigProvider, TimePicker } from "antd";
import PropTypes from "prop-types"
import locale from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default function TimeSpanish({ value = "", onChange = () => {}, ...props}) {
  return (
    <ConfigProvider locale={locale}>
      <TimePicker
        value={value}
        onChange={onChange}
        use12Hours
        format="h:mm a"
        {...props}
      />
    </ConfigProvider>
  );
}

TimeSpanish.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}