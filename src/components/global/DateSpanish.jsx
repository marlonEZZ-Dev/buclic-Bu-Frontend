import { ConfigProvider, DatePicker } from "antd";

import PropTypes from "prop-types"
import locale from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default function DateSpanish({ value = "", onChange = () => {}, ...props}) {
  const FIRST_YEAR = "YYYY-MM-DD"
  return (
    <ConfigProvider locale={locale}>
      <DatePicker
        value={value}
        onChange={onChange}
        format={FIRST_YEAR}
        defaultOpenValue={dayjs().format(FIRST_YEAR)}
        {...props}
      />
    </ConfigProvider>
  );
}

DateSpanish.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}
