import "./App.css";
import { Link } from "react-router-dom";
import Instructions from "./components/Instructions";

function App() {
  return (
    <>
      <h1>Hello, Welcome to Connect 4</h1>
      <div className="card">
        <button type="button">
          <Link to="/game">Start Game</Link>
        </button>
      </div>

      <Instructions />
    </>
  );
}

export default App;
