import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
export const TimeInput = (props) => {
    const {className,onChange} = props;
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/

    const classNames = ['time-input',...className.split(' ').map(c => c.trim()).filter(c => c.length > 0)]
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState(null)

    const inputTable = [
        {
            regex: /^$/,
            next: [
                {
                    keys: [":"],
                    transform: (inputValue,key) => `00:`
                },
                {
                    keys: ["0", "1", "2"]
                },
                {
                    keys: ["3","4","5","6","7","8","9"],
                    transform: (inputValue,key) => `0${key}:`
                },
                {
                    keys: ["Tab","Enter"],
                    transform: (inputValue,key) => '00:00'
                }
            ],
        },
        {
            regex: /^[0-1]$/,
            next: [
                {
                    keys: [":"],
                    transform: (inputValue,key) => `0${inputValue}${key}`
                },
                {
                    keys: ["0","1","2","3","4","5","6","7","8","9"],
                    transform: (inputValue,key) => `${inputValue}${key}:`
                },
                {
                    keys: ["Tab","Enter"],
                    transform: (inputValue,key) => `0${inputValue}:00`
                }
            ],
        },
        {
            regex: /^2$/,
            next: [
                {
                    keys: [":"],
                    transform: (inputValue,key) => `0${inputValue}${key}`
                },
                {
                    keys: ["0","1","2","3"],
                    transform: (inputValue,key) => `${inputValue}${key}:`
                },
                {
                    keys: ["4","5"],
                    transform: (inputValue,key) => `0${inputValue}:${key}`
                },
                {
                    keys: ["Tab","Enter"],
                    transform: (inputValue,key) => `0${inputValue}:00`
                }
            ],
        },
        {
            regex: /^([01][0-9]|2[0-3]):*$/,
            next: [
                {
                    keys: [":"],
                    transform: (inputValue,key) => inputValue.slice(-1) === ':' ? `${inputValue}` : `${inputValue}${key}`
                },
                {
                    keys: ["0","1","2","3","4","5"],
                    transform: (inputValue,key) => inputValue.slice(-1) === ':' ? `${inputValue}${key}` : `${inputValue}:${key}`
                },
                {
                    keys: ["Tab","Enter"],
                    transform: (inputValue,key) => inputValue.slice(-1) === ':' ? `${inputValue}00` : `${inputValue}:00`
                }
            ],
        },
        {
            regex: /^([01][0-9]|2[0-3]):[0-5]$/,
            next: [
                {
                    keys: ["0","1","2","3","4","5","6","7","8","9"],
                    transform: (inputValue,key) => `${inputValue}${key}`
                },
                {
                    keys: ["Tab","Enter"],
                    transform: (inputValue,key) => `${inputValue}0`
                }
            ],
        },
        {
            regex: /^\d\d:\d\d$/,
            next: [
                {
                    keys: ["Tab","Enter"],
                }
            ],
        },
    ];

    useEffect(() => {
        onChange && onChange(value)
    },[value])

    const handleKeyPress = (e) => {
        const key = e.key;

        if(key === 'Backspace') {
            setInputValue(inputValue.slice(0, -1));
            setValue(null)
            e.preventDefault();
            return;
        }

        const currentRule = inputTable.find((rule) => rule.regex.test(inputValue)).next;
        let nextKeys = [];
        if(currentRule) {
            nextKeys = currentRule.find((rule) => +rule.keys.includes(key))
        }

        if (nextKeys) {
            const newValue = (nextKeys.transform ? nextKeys.transform(inputValue, key) : `${inputValue}${key}`).slice(0,5)
            setInputValue(newValue)
            if (key === 'Tab' || key === 'Enter' || timeRegex.test(newValue)) {
                setValue(newValue)
                return
            }

            e.preventDefault()
        }
    }

    return (
        <input
            type="text"
            placeholder="HH:MM"
            value={inputValue}
            onKeyDown={handleKeyPress}
            onChange={(e) => {}}
            maxLength="5"
            className={classNames.join(' ').trim()}
        />
    );

}

TimeInput.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func
}

TimeInput.defaultProps = {
    className: ""
}