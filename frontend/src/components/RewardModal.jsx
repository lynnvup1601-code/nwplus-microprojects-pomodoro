import { useState } from "react";
import "./RewardModal.css";

function getRewardFruit(durationMinutes) {
  if (durationMinutes === 1) return "🌸";
  if (durationMinutes === 30) return "🥭";
  if (durationMinutes === 45) return "🍓";
  return "🌻";
}

function RewardModal({ durationMinutes, onClose, setRewards }) {
  const [chosenIndex, setChosenIndex] = useState(null);
  const fruit = getRewardFruit(durationMinutes);
  const hasChosen = chosenIndex !== null;

  async function handleAccept() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/focus-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusMinutes: durationMinutes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reward) setRewards((prev) => [...prev, data.reward]);
      } else {
        console.error("Failed to save reward:", await res.text());
      }
    } catch (err) {
      console.error("Network error saving reward:", err);
    }
    onClose();
  }

  return (
    <div className="reward-overlay">
      <div className="reward-card">
        <h2 className="reward-title">Time for a reward!</h2>

        <div className="reward-choices">
          <button
            className="reward-btn"
            disabled={hasChosen}
            onClick={() => setChosenIndex(0)}
          >
            {chosenIndex === 0 ? <span>{fruit}</span> : <span>?</span>}
          </button>
          <button
            className="reward-btn"
            disabled={hasChosen}
            onClick={() => setChosenIndex(1)}
          >
            {chosenIndex === 1 ? <span>{fruit}</span> : <span>?</span>}
          </button>
          <button
            className="reward-btn"
            disabled={hasChosen}
            onClick={() => setChosenIndex(2)}
          >
            {chosenIndex === 2 ? <span>{fruit}</span> : <span>?</span>}
          </button>
        </div>

        <div className="reward-accept-row">
          <button
            className="reward-accept-btn"
            disabled={!hasChosen}
            onClick={handleAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default RewardModal;
