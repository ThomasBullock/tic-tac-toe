//Libs
import React from 'react';
import ReactDOM from 'react-dom';

var classNames = require('classnames');

import '../sass/styles.scss';

function random(range) {
  return Math.floor(Math.random() * range);
}


// stateless functional components
function PlayerSelect(props) {
  return (
    <div className="playerSelect">
      Do you want to be 
      <button className="playerSelect-btn" data-player="X" data-comp="O" onClick={(e) => props.onClick(e)}>
        X
      </button>
        or 
      <button className="playerSelect-btn" data-player="O" data-comp="X"  onClick={(e) => props.onClick(e)}>
        O
      </button>
        ?
    </div>            
  )  
}

//// SQUARE //////

class Square extends React.Component {
    constructor() {
      super();
      this.onMouseOver = this.onMouseOver.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);      
      this.state = {
        isHovered: false,
      };
            
    }

    onMouseOver(i) {
      if(this.props.value === null) {
        this.setState({isHovered: true});
      }
    }
    
    onMouseLeave(i) {
      this.setState({isHovered: false});
    }    
  
    render() {
    
      var btnClass = classNames({
        square: true,
        availableSquare: this.state.isHovered
      });
      
      return <button className={btnClass} 
                     onClick={() => this.props.onClick()} 
                     onMouseOver={() => this.onMouseOver() }
                     onMouseLeave={() => this.onMouseLeave() }
                     >{this.props.value}</button>   

    }
}


//// BOARD //////
class Board extends React.Component {
  
  constructor() {
    super();
    this.state = {
      gameStarted: false,
      gameOver: false,
      player: null,
      computer: null,
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
    this.baseState = this.state;
  }

  handleClick(i) {  
    if(!this.state.gameStarted) {
      return
    } else {
      const squares = this.state.squares.slice();  ///copy the squares array instead of mutating original
       if(this.state.gameOver || this.state.squares[i] !== null) {  // prevent clicks on already selected squares
        return;
       }

        squares[i] = this.state.player;
        this.setState({squares: squares,
                        xNext : !this.state.xNext,
        });
    }
  }
  
  selectClick(e) {
    console.dir(e.target.dataset);

    this.setState({player: e.target.dataset.player,
                    computer: e.target.dataset.comp,
                    gameStarted: true
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
      }) , 1500);      
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
      squares[selection] = this.state.computer;      
      this.setState({squares: squares,
                      xNext : !this.state.xNext,
      });  
  }
  
  blockOrCompleteLine() {  // simple AI for computer
    // iterate through state.lines 
    var memIndex, choice;
    this.state.lines.forEach( (straight) => {

      //iterate through cells in line
        let empty = 0;
        let x = 0
        let o = 0
      straight.forEach( (cell, index) => {
        if(this.state.squares[cell] === null) {
          empty++
          memIndex = index;
        } else if(this.state.squares[cell] === 'X') {
          x++;
        } else if(this.state.squares[cell] === 'O') {
          o++;
        }
        if( (x === 2 || o === 2) && empty === 1 ) {
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
      if(this.state.player !== null) {
        if(this.state.xNext) {
          return `${this.state.player} : Your turn`;
        } else {
          return `${this.state.computer}: Computers turn`;
        }        
      } else {
        return <PlayerSelect onClick={ (e) => this.selectClick(e) }  />
      }

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
    if(this.state.gameOver) {
      setTimeout( (() => { 
          this.setState(this.baseState)
      }) , 3000);          
    } 

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


