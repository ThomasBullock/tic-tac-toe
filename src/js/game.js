//Libs
import React from 'react';
import ReactDOM from 'react-dom';

import '../sass/styles.scss';

function random(range) {
  return Math.floor(Math.random() * range);
}

//// SQUARE //////

// stateless functional components
function Square(props) {

    return (
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );

}


//// BOARD //////
class Board extends React.Component {
  
  constructor() {
    super();
    this.state = {
      gameOver: false,
      squares: Array(9).fill(null),
      xNext: true,
      lines: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]     
    };
    this.winner = null;
  }
  handleClick(i) {
     
  const squares = this.state.squares.slice();  ///copy the squares array instead of mutating original
   if(this.state.gameOver) {
    return;
   }
    squares[i] = this.state.xNext ? 'X' : 'O';
    this.setState({squares: squares,
                    xNext : !this.state.xNext,
    });
  }

  componentDidUpdate() {
    if(!this.state.gameOver) {
      this.winner = this.calculateWinner(this.state.squares);
      if(this.winner || !this.state.squares.includes(null)) {
        this.setState({gameOver: true});        
      }          
    }
    if(this.state.xNext === false) {
      setTimeout( (() => { 
        if(!this.state.gameOver) { 
          this.computerMove() 
        } 
      }) , 500);      
    }   
  }
 

  computerMove() {
      let selection;
      let availableSquares = this.state.squares.reduce( (filterArr, square, index, array) => {
        if(square === null) {
          filterArr.push(index);
        };
        return filterArr;
      },[])
      console.log(this.blockOrCompleteLine());
      
      if(this.blockOrCompleteLine()) {
        selection = this.blockOrCompleteLine();
      } else {
        selection = availableSquares[random(availableSquares.length)];
      }
      
      console.log(selection);
      const squares = this.state.squares.slice();
      squares[selection] = 'O';       
      this.setState({squares: squares,
                      xNext : !this.state.xNext,
      });  
  }
  
  blockOrCompleteLine() {
    // iterate through state.lines 
    var memIndex, choice;
    this.state.lines.forEach( (straight) => {

      //iterate through cells in line
        let empty = 0;
        let x = 0
        let o = 0
      straight.forEach( (cell, index) => {
        // console.log(this.state.squares[cell]);
        if(this.state.squares[cell] === null) {
          empty++
          memIndex = index;
        } else if(this.state.squares[cell] === 'X') {
          x++;
        } else if(this.state.squares[cell] === 'O') {
          o++;
        }
        if( (x === 2 || o === 2) && empty === 1 ) {
          // console.log(straight + " is the choice at " + memIndex);
          // console.log(straight[memIndex]);
          choice = straight[memIndex];
        }
      })
    })
    return choice;
    
    //find line that equals 2 x an null or 2o and null
    
    // return square index of aformentioned null 
  }
  
  statusMessage() {
    if(this.state.gameOver) {
      return (this.winner) ? 'The winner is: ' + this.winner : 'There was no winner....'; 
    } else {
      return 'Next player: ' + (this.state.xNext ? 'X' : 'O');
    }
  }
  
  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }
  
  calculateWinner(squares) {

    for (let i = 0; i < this.state.lines.length; i++) {
      const [a, b, c] = this.state.lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        console.log(squares[a])
        return squares[a];
      }
    }
    return null;
  }  
  
  render() {
    let status = this.statusMessage() 

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);


