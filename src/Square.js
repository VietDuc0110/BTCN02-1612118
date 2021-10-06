import React from 'react';
import './App.css'

function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}
        id={props.id}
        style={{ background: props.background }}
      >
        
        {props.value}
      </button>
    );
  }
  export default Square;