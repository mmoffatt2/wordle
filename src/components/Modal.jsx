import "./Modal.css";

function Modal({ youWin, resetGame, wordOfTheDay }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
                resetGame();
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          {youWin && 
            <h1>You Won!</h1>
          }
          {!youWin && 
            <h1>Nice Try! Try Again.</h1>
          }
        </div>
        <div className="body">
          {!youWin &&
            <p>The word was {wordOfTheDay} </p>
          }
        </div>
        <div className="footer">
          <button
            onClick={() => {
                resetGame();
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;