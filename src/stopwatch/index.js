import React, { useState, useEffect } from 'react';

const timeDefaults = {
    hours: ('').padStart(2, '0'),
    minutes: ('').padStart(2, '0'),
    seconds: ('').padStart(2, '0'),
    miliseconds: ('').padStart(3, '0')
};

const StopWatch = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(null);
    const [laps, setLaps] = useState([]);
    const [fullTime, setFullTime] = useState(timeDefaults);

    const localLaps = Array.from({ length: laps.length }, (lap, lapIndex) => {
        return laps[lapIndex];
    });

    const resetTimer = () => {
        setStartTime(Date.now());
        setElapsed(0);
        setFullTime(timeDefaults);
    }

    const lap = () => {
        if (isRunning) {
            setLaps([...laps, fullTime]);
            setStartTime(Date.now());
        }
    };

    const updateLapDescription = (text, lapIndex) => {
        localLaps[lapIndex].description = text;
        setLaps(localLaps);
    };

    const toggleRun = () => {
        isRunning && setElapsed(Date.now() - startTime);
        setIsRunning(!isRunning);
        setStartTime(Date.now() - (elapsed * 1));
    };

    const clearLap = index => {
        localLaps.splice(index, 1);
        setLaps(localLaps);
    };

    const clearAllLaps = () => setLaps([]);

    useEffect(() => {
        let intervalID = 0;

        if (isRunning) {

            intervalID = setInterval(() => {

                setFullTime({

                    miliseconds: ((Date.now() - startTime) % 1000).toString().padStart(3, '0'),
                    seconds: Math.round(((Date.now() - startTime) / 1000) % 60).toString().padStart(2, '0'),
                    minutes: Math.floor((((Date.now() - startTime) / 1000) / 60) % 60).toString().padStart(2, '0'),
                    hours: Math.floor(Math.floor((((Date.now() - startTime) / 1000) / 60) % 60) / 60).toString().padStart(2, '0'),
                });

            }, 10);

        } else if (!isRunning) {

            clearInterval(intervalID);

        }

        return () => clearInterval(intervalID);

    }, [isRunning, startTime]);

    return (
        <div className='stopwatch'>
            {
                <div className="time">
                    {fullTime.hours}:
                {fullTime.minutes}:
                {fullTime.seconds}:
                {fullTime.miliseconds}
                </div>
            }
            <button className='control-button' onClick={toggleRun}>{isRunning ? 'Stop' : 'Start'}</button>
            <button className='control-button' onClick={lap}>Lap</button>
            <button className='control-button' onClick={resetTimer}>Reset</button>
            <div>
                {laps.length ? <button className='control-button' onClick={clearAllLaps}>Reset Laps</button> : ''}
                {
                    laps.map(((lap, lapIndex) => {
                        return (
                            <div className='time' key={lapIndex}>
                                <div>
                                    {`${lap.hours}:${lap.minutes}:${lap.seconds}:${lap.miliseconds}`}
                                </div>
                                <input
                                    placeholder='title'
                                    type='text'
                                    value={lap.description || ''}
                                    onChange={e => {
                                        updateLapDescription(e.target.value, lapIndex)
                                    }}
                                />
                                <button onClick={() => clearLap(lapIndex)}>x</button>
                            </div>
                        );
                    })).reverse()
                }
            </div>
        </div>
    );
};

export default StopWatch;