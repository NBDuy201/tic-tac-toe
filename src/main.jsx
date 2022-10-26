/* eslint-disable react/prop-types */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const width = 5;
const height = width;

function Square(props) {
  const winColor = "text-green-500";
  const normalColor = props.value === "X" ? "text-red-500" : "text-blue-500";

  return (
    <button
      className={`border-2 border-blue-500 w-20 h-20 align-middle text-center font-semibold 
      text-6xl rounded-lg ${props.isWin ? winColor : normalColor}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    return (
      <div>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          }}
        >
          {this.props.squares.map((item, index) => (
            <Square
              key={index}
              value={this.props.squares[index]}
              onClick={() => this.props.onClick(index)}
              isWin={this.props.winPattern.includes(index)}
            />
          ))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(height * width).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      location: [],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // Prevent click on win and already clicked square
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      location: [
        ...this.state.location,
        { row: Math.floor(i / height), col: i % width },
      ],
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, pattern } = calculateWinner(current.squares) || {};

    const moves = history.map((step, move) => {
      // Calculate (x, y) of move base on location state
      const location = move
        ? `(${this.state.location[move - 1].row}, ${
            this.state.location[move - 1].col
          })`
        : "";

      const desc = move
        ? `Go to move # ${move} ${location}`
        : "Go to game start";

      // Check for bold condition
      const bold = move === this.state.stepNumber;
      return (
        <li key={move} className="mt-2">
          <button
            onClick={() => this.jumpTo(move)}
            className="border p-2 outline-none rounded-lg shadow-lg"
          >
            {bold ? <b className="font-bold">{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      if (!current.squares.includes(null)) {
        status = "Draw";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winPattern={pattern || []}
          />
        </div>
        <div className="game-info w-[400px]">
          <div
            className="border border-gray-200 rounded-lg p-4 text-center shadow-lg 
          text-xl"
          >
            {status}
          </div>
          <ol className="mt-2 flex flex-wrap">{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d] &&
      squares[a] === squares[e]
    ) {
      return { winner: squares[a], pattern: lines[i] };
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
