import {TimeInput} from "../time-input";
import {useEffect, useState} from "react";

export const RangeInput = (props) => {

    const {className,inputClasses,onChange,errorMessageSameTime,errorMessageInvalidOrder, timespan} = props;

    const [start,setStart] = useState(timespan.start ? timespan.start : null)
    const [stop,setStop] = useState(timespan.stop ? timespan.stop : null)
    const [duration,setDuration] = useState({minutes: 0, text:"0h"})
    const [valid,setValid] = useState(false)
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
        if(start==stop) {
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
        <div className="range-input">
            <TimeInput
                onChange={onStartChangeHandler}
                className={`start${error ? " invalid":""}`}
            />
            <TimeInput
                onChange={onStopChangeHandler}
                className={`stop${error ? " invalid":""}`}
            />
            {error && <div>{error}</div>}
            <div>{duration.text}</div>
        </div>
    )
}