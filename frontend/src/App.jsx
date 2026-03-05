import Timer from "./components/Timer";
import "./App.css";
import Garden from "./components/Garden";
import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("timer");
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/rewards`)
      .then((res) => res.json())
      .then((data) => {
        const rewardNames = (data.rewards ?? []).map((entry) => entry.reward);
        setRewards(rewardNames);
      })
      .catch((err) => console.error("Failed to load garden:", err));
  }, []);

  return (
    <>
      {page === "timer" ? (
        <Timer setPage={setPage} setRewards={setRewards} />
      ) : (
        <Garden setPage={setPage} rewards={rewards} />
      )}
    </>
  );
}

export default App;
