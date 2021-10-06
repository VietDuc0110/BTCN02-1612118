import React, { useState } from "react";
import "./App.css";
import Board from "./Board";
var value = -1;
var backupvalue = -1;

function Game () {
  const [MaxHeight, setMaxHeight] = useState(10);
  const [MaxWidth, setMaxWidth] = useState(10);
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(MaxWidth * MaxHeight).fill(null));
  const [stepNumber, setStepNumber] = useState(0);
  const [colors, setColors] = useState(Array(MaxWidth * MaxHeight).fill("#f5d5ae"));
  const [isEnded, setIsEnded] = useState(false);
  const [isIncrease, setIsIncrease] = useState(true);
  const [history, setHistory] = useState([
          {
            squares: Array(MaxWidth * MaxHeight).fill(null),
            position: -1,
          },
        ]);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     history: [
  //       {
  //         squares: Array(100).fill(null),
  //         position: -1,
  //       },
  //     ],
  //     xIsNext: true,
  //     stepNumber: 0,
  //     colors: Array(100).fill("#f5d5ae"),
  //     isEnded: false,
  //     isIncrease: true,
  //   };
  // }

  const calculateWinner = (squares) => {
    if (value === -1) {
      return null;
    }

    var row = Math.floor(value / MaxWidth);
    var column = value % MaxWidth;

    var thisValue = squares[row * MaxWidth + column];
    var winLine;
    // Kiểm tra hàng dọc chứa điểm vừa đánh
    for (var index = row - 4; index <= row; index++) {
      winLine = Array(5).fill(null);
      // Nếu ô row + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      var isWon = true;

      for (var i = index; i < index + 5; i++) {
        winLine[i - index] = i * MaxWidth + column;
        if (i > MaxHeight - 1) {
          isWon = false;
          break;
        }

        if (squares[i * MaxWidth + column] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !isBlock2Ends(squares, "vertical", thisValue === "X" ? "O" : "X")
      ) {
        paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng ngang chứa điểm vừa đánh
    for (index = column - 4; index <= column; index++) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      isWon = true;
      for (i = index; i < index + 5; i++) {
        winLine[i - index] = row * MaxWidth + i;
        if (i > MaxWidth - 1) {
          isWon = false;
          break;
        }

        if (squares[row * MaxWidth + i] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !isBlock2Ends(squares, "horizontal", thisValue === "X" ? "O" : "X")
      ) {
        paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, trên xuống chứa điểm vừa đánh
    for (index = -4; index <= 0; index++) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || index + row < 0) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      isWon = true;
      for (i = index; i < index + 5; i++) {
        winLine[i - index] = (row + i) * MaxWidth + (column + i);
        if (i + column > MaxWidth - 1 || i + row > MaxHeight - 1) {
          isWon = false;
          break;
        }

        if (squares[(row + i) * MaxWidth + (column + i)] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !isBlock2Ends(squares, "backslash", thisValue === "X" ? "O" : "X")
      ) {
        paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, dưới lên chứa điểm vừa đánh
    for (index = -4; index <= 0; index++) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || row - index > MaxHeight - 1) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      isWon = true;
      for (i = index; i < index + 5; i++) {
        winLine[i - index] = (row - i) * MaxWidth + (column + i);
        if (i + column > MaxWidth - 1 || row - i < 0) {
          isWon = false;
          break;
        }

        if (squares[(row - i) * MaxWidth + (column + i)] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (
        isWon === true &&
        !isBlock2Ends(squares, "slash", thisValue === "X" ? "O" : "X")
      ) {
        paintWinLine(winLine);
        return thisValue;
      }
    }

    return null;
  }

  const paintWinLine=(winLine)=> {
    for (let count = 0; count < 5; count++) {
      colors[winLine[count]] = "#37d422";
    }

    winLine = [];
  }

  const isBlock2Ends=(squares, type, competitor)=> {
    var row = Math.floor(value / MaxWidth);
    var column = value % MaxWidth;
    var hasCompetitor = false;

    switch (type) {
      // Chặn 2 đầu ngang
      case "horizontal":
        for (var i = column - 1; i >= 0; i--) {
          if (squares[row * MaxWidth + i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = column + 1; i < MaxWidth; i++) {
            if (squares[row * MaxWidth + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu dọc
      case "vertical":
        for (i = row - 1; i >= 0; i--) {
          if (squares[i * MaxWidth + column] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = row + 1; i < MaxHeight; i++) {
            if (squares[i * MaxWidth + column] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu chéo "/"
      case "slash":
        for (i = 1; row + i < MaxHeight - 1 && column - i >= 0; i++) {
          if (squares[(row + i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = 1; row - i >= 0 && column + i < MaxWidth; i++) {
            if (squares[(row - i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;

      // Chặn 2 đầu chéo "\"
      case "backslash":
        for (i = 1; row - i >= 0 && column - i >= 0; i++) {
          if (squares[(row - i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = 1; row + i < MaxHeight && column + i < MaxWidth; i++) {
            if (squares[(row + i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;
      default:
        break;
    }

    return false;
  }

  const jumpTo=(step) =>{
    if (step !== history.length - 1) {
      value = -1;
      setStepNumber(step)
      setXIsNext(step % 2 === 0)
      setColors(Array(MaxHeight * MaxWidth).fill("#f5d5ae"))
    } else {
      value = backupvalue;
      setStepNumber(step);
      setXIsNext(step % 2 === 0);
    }

    for (let i = 0; i < history.length; i++) {
      if (i === step) {
        document.getElementById(i).style.background = "#0c4517";
      } else document.getElementById(i).style.background = "#4CAF50";
    }
  }

  const handleClickReset=()=> {
    for (let i = 0; i < history.length; i++) {
      document.getElementById(i).style.fontWeight = "#4CAF50";
    }

    value = -1;

    setSquares(Array(MaxWidth * MaxHeight).fill(null));
    setXIsNext(true);
    setHistory( [
      {
        squares: Array(MaxWidth * MaxHeight).fill(null),
        position: -1,
      },
    ]);
    setStepNumber(0);
    setColors(Array(MaxWidth * MaxHeight).fill("#f5d5ae"));
    setIsEnded(false);
  }

  const handleClickSort=()=> {
    setIsIncrease(!isIncrease)
  }

  const handleClick = (i) => {
    console.log("flag: handlerClick");
    const hs = history.slice(0, stepNumber + 1);
    const current = hs[hs.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(current.squares) || squares[i]) {
      return;
    }

    for (let i = 0; i < hs.length; i++) {
      document.getElementById(i).style.background = "#4CAF50";
    }

    value = i;
    backupvalue = value;
    squares[i] = xIsNext ? "X" : "O";

    setHistory(hs.concat([
      {
        squares: squares,
        position: value,
      },
    ]));
    setStepNumber(hs.length);
    setXIsNext(!xIsNext);
  }

  const setBoardSize = (e) => {
    if(e.key === 'Enter') {
      const size = parseInt(e.target.value);
      if (size < 5 || history.length > 1) {
        return
      }
      setMaxHeight(size);
      setMaxWidth(size);
      setColors(Array(size * size).fill("#f5d5ae"));
    }
  }

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const Style = {
      margin: "5px",
      background: "#4CAF50",
      /* Green */
      border: "none",
      color: "white",
      padding: "0px",
      width: "160px",
      height: "40px",
    };

    var moves = [];
    if (isIncrease) {
      for (let i = 0; i < history.length; i++) {
        const desc = i
          ? "Go to step " +
            i +
            ": [" +
            Math.floor(history[i].position / MaxWidth) +
            ";" +
            (history[i].position % MaxWidth) +
            "]"
          : "Start over";

        moves.push(
          <li key={i}>
            <button style={Style} onClick={() => jumpTo(i)} id={i}>
              
              {desc}
            </button>
          </li>
        );
      }
    } else {
      for (let i = history.length - 1; i >= 0; i--) {
        const desc = i
          ? "Đi lại bước " +
            i +
            ": [" +
            Math.floor(history[i].position / MaxWidth) +
            ";" +
            (history[i].position % MaxWidth) +
            "]"
          : "Đi lại từ đầu";

        moves.push(
          <li key={i}>
            <button style={Style} onClick={() => jumpTo(i)} id={i}>
              
              {desc}
            </button>
          </li>
        );
      }
    }

    let status;
    if (winner) {
      status = winner + " chiến thắng";
    } else {
      status = (xIsNext ? "X" : "O") + " tiếp theo";
    }
    if (stepNumber == MaxWidth * MaxHeight) {
      status = "Trận đấu hòa";
    }

    var sourceImgSort = isIncrease
      ? "https://imgur.com/6l1wdoQ.png"
      : "https://imgur.com/y0uioJc.png";

    return (
      <div className="App">
        <header className="App-header">
          <div className="game">
            <div className="status" style={{display: 'flex', flexDirection: 'column'}}>
              <img
                src={"https://i.imgur.com/n2W67wf.png"}
                alt="Chơi lại"
                onClick={() =>handleClickReset()}
              >             
              </img>
              <input onKeyDown={e => setBoardSize(e)} placeholder="Nhập kích thước bàn chơi"></input>
            </div>
            <div className="game-board">
              <Board
                squares={current.squares}
                colors={colors}
                onClick={(i) => handleClick(i)}
                width={MaxWidth}
                height={MaxHeight}
              />
            </div>
            <div style={{ marginLeft: "15px" }} className="game-info">
              <div> {status} </div>
              <img
                src={sourceImgSort}
                alt="Sắp xếp danh sách"
                style={{ width: "40px", height: "40px", float: "right" }}
                onClick={() =>handleClickSort()}
              >
                
              </img>
              <div style={{ height: "94.5vh", overflow: "scroll" }}>
                <ul style={{ marginTop: "0px" }}> {moves} </ul>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
}

export default Game;
