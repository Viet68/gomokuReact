import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winSquare = this.props.winSquare;
    if (winSquare && winSquare.includes(i)) {
      console.log(winSquare);
      return (
        <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          style={{ color: "red" }}
        />
      );
    }
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(first, last, index, n) {
    var data = [];
    for (let i = first; i <= last; i++) {
      data = data.concat(this.renderSquare(n * index + i));
    }
    return (
      <div key={index} className="board-row">
        {data}
      </div>
    );
  }
  renderBoard(n) {
    var ind = 0;
    var data = [];
    for (let i = 0; i < n; i++) {
      data = data.concat(this.renderRow(i * ind, i * ind + n - 1, i, n));
    }
    return <div> {data}</div>;
  }
  render() {
    return this.renderBoard(5);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          move: {
            step: 0,
            type: "O",
            x: 0,
            y: 0,
          },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      historySortType: "asc",
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const move = {
      step: this.state.stepNumber + 1,
      type: this.state.xIsNext ? "X" : "O",
      x: i % 3,
      y: Math.floor(i / 3),
    };
    const { winner } = calculateWinner(current.squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: move,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortList(method) {
    this.setState({
      historySortType: method === "desc" ? "desc" : "asc",
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, winRow } = calculateWinner(current.squares);
    const stepNumber = this.state.stepNumber;
    const historySortType = this.state.historySortType;
    const moves = history.map((step, order) => {
      var desc = order ? "Go to move #" + order : "Go to game start";
      if (order === stepNumber) {
        return (
          <li key={order}>
            <p>
              <button onClick={() => this.jumpTo(order)}>
                <b>{desc}</b>
              </button>
            </p>
          </li>
        );
      }
      return (
        <li key={order}>
          <p>
            <button onClick={() => this.jumpTo(order)}>{desc}</button>
          </p>
        </li>
      );
    });

    var logs = [];
    for (let i = 1; i < history.length; i++) {
      var log = history[i].move;
      if (i <= this.state.stepNumber) {
        const desc =
          log.step + ". " + log.type + " : (" + log.x + ", " + log.y + ")";
        if (winner) {
          const index = log.x + log.y * 3;
          if (winRow.includes(index)) {
            logs = logs.concat(
              <li key={i}>
                <p>
                  <b>{desc}</b>
                </p>
              </li>
            );
          } else {
            logs = logs.concat(
              <li key={i}>
                <p>{desc}</p>
              </li>
            );
          }
        } else {
          logs = logs.concat(
            <li key={i}>
              <p>{desc}</p>
            </li>
          );
        }
      } else {
        break;
      }
    }

    if (historySortType === "desc") {
      logs = logs.reverse();
    }
    let status;
    if (stepNumber === 25) {
      status = "Draw. No more steps";
    } else {
      if (winner) {
        status =
          "Winner: " + winner + " after " + this.state.stepNumber + " steps";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winSquare= {winRow}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="game-info">
          <div>
            Move history list
            <button onClick={() => this.sortList("asc")}>Ascending</button>
            <button onClick={() => this.sortList("desc")}>Descending</button>
            <p>Order. Player: (col, row)</p>
          </div>
          <ul>{logs}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
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
      return { winner: squares[a], winRow: lines[i] };
    }
  }
  return { winner: null, winRow: null };
}
