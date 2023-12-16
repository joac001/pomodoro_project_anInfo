import { useEffect, useState } from 'react';
import '../../style/timer.css';

export default function Timer(props) {
  // check if values are stored, otherwise loads default values
  let [time, setTime] = useState(JSON.parse(localStorage.getItem("time")) || (props.timer.pomodoro * 60));
  let [mode, setMode] = useState(localStorage.getItem("mode") || "Pomodoro");
  let [cycles, setCycles] = useState(JSON.parse(localStorage.getItem("cycles")) || 0);

  let [isRunning, setIsRunning] = useState(false); // always starts paused

  let [badgeHover, setBadgeHover] = useState("text-bg-secondary");

  // hook is called whenever variables time or isRunning are updated
  useEffect(() => {
    // saves current state in local storage
    saveToLocalStorage();

    // sets up the interval callback, which updates time variable every second
    let timerInterval;
    if (isRunning && time > 0) {
      timerInterval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }

    // switches modes when time reaches zero
    if (time === 0) { switchMode(); }

    // cleans current interval variable to save memory each repetition
    return () => clearInterval(timerInterval);

    // (!) next comment disables a small dependency warning, hook only needs these two variables to work
    // eslint-disable-next-line
  }, [isRunning, time]);

  function saveToLocalStorage() {
    localStorage.setItem("time", JSON.stringify(time));
    localStorage.setItem("mode", mode);
    localStorage.setItem("cycles", JSON.stringify(cycles));
  }

  function switchMode() {
    if (mode === "Pomodoro") {
      // change to break mode
      if (((cycles + 1) % 4) === 0) {
        setTime(props.timer.longBreak * 60);
        setMode("Long Break")
      } else {
        setTime(props.timer.break * 60);
        setMode("Break");
      }
      setCycles((cycles) => cycles + 1);

    } else {
      // change to pomodoro mode
      setMode("Pomodoro");
      setTime(props.timer.pomodoro * 60);
    }
  }

  // button functions
  function playTimer() { setIsRunning(true); }

  function pauseTimer() { setIsRunning(false); }

  function restartTimer() {
    setIsRunning(false);
    setTime(props.timer.pomodoro * 60);
    setMode("Pomodoro");
  }

  return (
    <div className="timer-container">
      <div className="timer-mode">{mode}</div>
      <div className="timer-time">
        {Math.floor(time / 60)}:{(time % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}
      </div>

      <span title='Restart counter cycle' className={"badge " + badgeHover + " pomodoro-counter badge-btn-restarter"} onMouseEnter={() => setBadgeHover("text-bg-success")} onMouseLeave={() => setBadgeHover("text-bg-secondary")}>
        Completed pomodoros: {cycles}
      </span>
      <div className="timer-buttons">
        {
          isRunning
            ?
            <button onClick={pauseTimer} type="button" className="btn btn-light">
              <span className="material-symbols-outlined">pause</span>
            </button>
            :
            <button onClick={playTimer} type="button" className="btn btn-light">
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
        }
        <button onClick={restartTimer} type="button" className="btn btn-light">
          <span className="material-symbols-outlined">replay</span>
        </button>
      </div>
      <div>
        <div style={{ width: '100%', border: '1px solid #ccc', marginTop: '10px' }}>
          <div
            style={
              mode === "Long Break" ? {
                width: `100%`,
                height: '20px',
                backgroundColor: 'green',
                transition: 'width 0.5s ease-in-out',
              } : {
                width: `${(cycles % 4) * 25}%`,
                height: '20px',
                backgroundColor: 'green',
                transition: 'width 0.5s ease-in-out',
              }
            }
          />
        </div>
        <p>{mode === "Long Break" ? 'Break time!' : `${cycles % 4}/4 pomodoros until large break!`}</p>
      </div>
    </div>
  );
}
