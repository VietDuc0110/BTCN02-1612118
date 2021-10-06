import React from "react";
import "./App.css";
import Square from "./Square";

function Board(props) {
    const renderSquare=(i)=> {
      return (
        <Square
          value={props.squares[i]}
          onClick={() => props.onClick(i)}
          id={"s" + i}
          background={props.colors[i]}
        />
      );
    }
      let board = [];
      for (let i = 0; i < props.height; i++) {
        let rowBoard = [];
        for (let j = 0; j < props.width; j++) {
          rowBoard.push(renderSquare(i * props.width + j));
        }
        board.push(<div className="board-row"> {rowBoard} </div>);
      }
  
      return <div> {board} </div>;
  }
   export default Board;