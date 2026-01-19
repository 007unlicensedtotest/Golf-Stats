import { useEffect, useState } from "react";
import { WHIPSNADE_PAR_TARGETS } from "./data.js";
import { generateInsights } from "./insights.js";

const emptyHole = (n, par) => ({
  hole: n,
  par,
  tee: "",
  gir: false,
  upDown: false,
  putts: 2,
  score: 0
});

function calculateStats(holes) {
  return {
    total: holes.reduce((a, h) => a + Number(h.score), 0),
    gir: holes.filter(h => h.gir).length,
    putts: holes.reduce((a, h) => a + h.putts, 0),
    doubles: holes.filter(h => h.score - h.par >= 2).length,
    penalties: holes.filter(h => h.tee === "Penalty").length,
    upDowns: holes.filter(h => h.upDown).length
  };
}

export default function App() {
  const [rounds, setRounds] = useState(() => {
    const saved = localStorage.getItem("rounds");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentRound, setCurrentRound] = useState(null);
  const [holeIndex, setHoleIndex] = useState(0);
  const [view, setView] = useState("home");

  useEffect(() => {
    localStorage.setItem("rounds", JSON.stringify(rounds));
  }, [rounds]);

  const startRound = () => {
    setCurrentRound(WHIPSNADE_PAR_TARGETS.map(h => emptyHole(h.hole, h.par)));
    setHoleIndex(0);
    setView("play");
  };

  const updateHole = (field, value) => {
    const copy = [...currentRound];
    copy[holeIndex] = { ...copy[holeIndex], [field]: value };
    setCurrentRound(copy);
  };

  const finishRound = () => {
    const stats = calculateStats(currentRound);
    stats.date = new Date().toLocaleDateString();
    setRounds([...rounds, stats]);
    setView("summary");
  };

  if (view === "home") {
    return (
      <div className="container">
        <h2>🏌️ Golf Stats</h2>
        <button onClick={startRound}>▶ Start Round</button>
        <button onClick={() => setView("history")}>📈 History</button>
      </div>
    );
  }

  if (view === "play") {
    const h = currentRound[holeIndex];
    return (
      <div className="container">
        <h2>Hole {h.hole} (Par {h.par})</h2>

        <div className="section">
          <label>Tee Shot</label>
          <div className="buttons">
            {["Fairway", "Left", "Right", "Penalty"].map(v => (
              <button
                key={v}
                className={h.tee === v ? "active" : ""}
                onClick={() => updateHole("tee", v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <label>GIR</label>
          <button
            className={h.gir ? "active" : ""}
            onClick={() => updateHole("gir", !h.gir)}
          >
            {h.gir ? "Yes" : "No"}
          </button>
        </div>

        <div className="section">
          <label>Putts</label>
          <div className="buttons">
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={h.putts === p ? "active" : ""}
                onClick={() => updateHole("putts", p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {!h.gir && (
          <div className="section">
            <label>Up & Down</label>
            <button
              className={h.upDown ? "active" : ""}
              onClick={() => updateHole("upDown", !h.upDown)}
            >
              {h.upDown ? "Yes" : "No"}
            </button>
          </div>
        )}

        <div className="section">
          <label>Score</label>
          <input
            type="number"
            inputMode="numeric"
            value={h.score}
            onChange={e => updateHole("score", Number(e.target.value))}
          />
        </div>

        <div className="nav">
          <button disabled={holeIndex === 0} onClick={() => setHoleIndex(holeIndex - 1)}>◀</button>
          {holeIndex === 17
            ? <button onClick={finishRound}>Finish</button>
            : <button onClick={() => setHoleIndex(holeIndex + 1)}>▶</button>}
        </div>
      </div>
    );
  }

  if (view === "summary") {
    const last = rounds[rounds.length - 1];
    const insights = generateInsights(last);

    return (
      <div className="container">
        <h2>📊 Round Summary</h2>
        <div className="card">Score: {last.total}</div>
        <div className="card">GIR: {last.gir}</div>
        <div className="card">Putts: {last.putts}</div>
        <div className="card">Doubles+: {last.doubles}</div>

        <h3>Insights</h3>
        {insights.map((i, idx) => (
          <div className="card" key={idx}>{i}</div>
        ))}

        <button onClick={() => setView("home")}>Home</button>
      </div>
    );
  }

  if (view === "history") {
    return (
      <div className="container">
        <h2>📈 Rounds</h2>
        {rounds.map((r, i) => (
          <div key={i} className="card">
            {r.date} — Score {r.total} | GIR {r.gir} | Putts {r.putts}
          </div>
        ))}
        <button onClick={() => setView("home")}>Home</button>
      </div>
    );
  }
}
