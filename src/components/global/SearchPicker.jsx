import React, { useState } from 'react';
import { Button, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SearchPicker = ({ placeholder = "Buscar", onSearch, ...props }) => {
    const [hover, setHover] = useState(false);
    const [value, setValue] = useState('');
    const [dateRange, setDateRange] = useState(null);

    const handleSearch = () => {
        if (onSearch) {
            onSearch({ query: value, dateRange });
        }
    };

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleDateChange = (dates) => {
        setDateRange(dates ? [dayjs(dates[0]), dayjs(dates[1])] : null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={styles.container}>
            <Input
                placeholder={placeholder}
                style={styles.input}
                value={value}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                {...props}
            />
            <RangePicker
                style={styles.datePicker}
                onChange={handleDateChange}
            />
            <Button
                type="primary"
                icon={<SearchOutlined style={{ color: 'white' }} />}
                style={{ ...styles.button, backgroundColor: hover ? '#841F1C' : '#C20E1A', borderColor: hover ? '#841F1C' : '#C20E1A' }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleSearch}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    input: {
        flex: 1,
        maxWidth: '200px',
    },
    datePicker: {
        flex: 1,
        maxWidth: '300px'
    },
    button: {
        color: 'white',
    },
};

SearchPicker.propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
};

export default SearchPicker;
