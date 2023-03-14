import {TimeInput} from "../time-input";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useMounted} from "../../hooks";

export const RangeInput = (props) => {
    const mounted = useMounted();

    const {className,inputClasses,onChange,errorMessageSameTime,errorMessageInvalidOrder, timespan} = props;

    const classNames = ['range-input',...className.split(' ').map(c => c.trim()).filter(c => c.length > 0)]

    const [start,setStart] = useState(timespan?.start ? timespan.start : null)
    const [stop,setStop] = useState(timespan?.stop ? timespan.stop : null)
    const [duration,setDuration] = useState(timespan?.duration ? timespan.duration : {minutes: 0, text:"0h"})
    const [valid,setValid] = useState(timespan?.valid ? timespan.valid : false)
    const [error,setError] = useState("")

    function calculateDuration(start, end) {
        const [startHour, startMinute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);
        const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
        const formattedTime = `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 < 10 ? '0' : ''}${totalMinutes % 60}`;
        return { minutes: totalMinutes, text: formattedTime };
    }

    useEffect(() => {
        validate()
    },[start,stop])

    useEffect(() => {
        if(error) return;
        if(!mounted) return;

        onChange(
            {
                start: start,
                stop: stop,
                duration: duration,
                valid: valid
            }
        )
    },[duration])

    const validate = () => {
        if(!(start && stop)) {
            setDuration({minutes: 0, text:"0h"})
            setValid(false)
            return
        }
        if(start===stop) {
            setDuration({minutes: 0, text:"0h"})
            setValid(false)
            setError("Anfang und Ende der Zeitspanne dürfen nicht gleiche sein.")
            return;
        }
        if(start>stop) {
            setDuration({minutes: 0, text:"0h"})
            setValid(false)
            setError("Das Ende der Zeitspanne muss vor dem Anfang liegen.")
            return;
        }
        setError("")
        setDuration(calculateDuration(start,stop))
        setValid(true)
    }

    const onStartChangeHandler = (time) => {
        setStart(time)
    }

    const onStopChangeHandler = (time) => {
        setStop(time)
    }

    return (
        <div className={classNames.join(' ').trim()}>
            <div className="form-row">
                <div className="col-4">
                    <TimeInput
                        onChange={onStartChangeHandler}
                        className={`start${error ? " is-invalid":""}`}
                        initalValue={start}
                    />
                </div>
                <div className="col-4">
                    <TimeInput
                        onChange={onStopChangeHandler}
                        className={`stop${error ? " is-invalid":""}`}
                        initalValue={stop}
                    />
                </div>
                <div className="col-4">
                    <span className="badge badge-pill badge-success">{duration.text}</span>
                </div>


            </div>
            <div className="form-row">
                <div className="col">
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
            </div>
        </div>
    )
}

RangeInput.propTypes = {
    className: PropTypes.string,
}

RangeInput.defaultProps = {
    className: ""
}