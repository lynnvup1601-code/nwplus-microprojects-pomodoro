// Import statements
import "./Timer.css";
import { FaPlay } from "react-icons/fa";
import { IoIosPause } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import TimerButton from "./TimerButton";
import { useState, useEffect } from "react";
import RewardModal from "./RewardModal";

export default function Timer({ setPage, setRewards }) {
  // State variables
  // duration is the total duration of the timer in seconds
  const [duration, setDuration] = useState(30 * 60);
  // timeLeft is the remaining time in seconds
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  // isRunning is a boolean that indicates if the timer is running
  const [isRunning, setIsRunning] = useState(false);
  // showReward is a boolean that indicates if the reward modal should be shown
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // if timer is paused or no time left, do nothing
    if (!isRunning || timeLeft <= 0) return;
    //set up interval
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setShowReward(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup interval
    return () => clearInterval(interval);
  }, [isRunning]);

  // Helper function to format time
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function handleSetDuration(seconds) {
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  }

  function toggleRunning() {
    setIsRunning((prev) => !prev);
  }

  function handleReset() {
    setTimeLeft(duration);
    setIsRunning(false);
  }

  return (
    <div className="timer-page">
      <div className="timer-wrapper">
        <div className="timer-layout">
          <div className="timer-controls">
            {/* These are icons imported from react-icons library */}
            {/* if the isRunning state is true, show the pause icon, otherwise show the play icon */}
            {isRunning ? (
              <IoIosPause className="icon-btn" onClick={toggleRunning} />
            ) : (
              <FaPlay className="icon-play" onClick={toggleRunning} />
            )}
            <VscDebugRestart className="icon-btn" onClick={handleReset} />
          </div>
          {/* Study button group */}
          <div className="timer-main">
            <div className="duration-group">
              <h3>Start studying</h3>
              <TimerButton
                value={30}
                onClick={() => handleSetDuration(1)}
              />
              <TimerButton
                value={45}
                onClick={() => handleSetDuration(45 * 60)}
              />
              <TimerButton
                value={60}
                onClick={() => handleSetDuration(60 * 60)}
              />
            </div>

            <div className="timer-display">{formatTime(timeLeft)}</div>

            <div className="duration-group">
              <h3>Start break</h3>
              <TimerButton
                value={5}
                onClick={() => handleSetDuration(5 * 60)}
              />
              <TimerButton
                value={10}
                onClick={() => handleSetDuration(10 * 60)}
              />
              <TimerButton
                value={15}
                onClick={() => handleSetDuration(15 * 60)}
              />
            </div>
          </div>
          <button className="garden-btn" onClick={() => setPage("garden")}>
            See your garden
          </button>
        </div>
      </div>
      {showReward && (
        <RewardModal
          durationMinutes={duration}
          onClose={() => setShowReward(false)}
          setRewards={setRewards}
        />
      )}
    </div>
  );
}
