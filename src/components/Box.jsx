import './Box.css';

export default function Box({myRow, myCol, letterList, row, col}) {
  // console.log(myRow, myCol, letterList, row, col);
  let outputLetter = "";
  let outputMatch = "";

  if (myRow*5+myCol <= row*5+col) {
    outputLetter = letterList[myRow][myCol].letter;
    outputMatch = letterList[myRow][myCol].match;
  }

  let className = `box-item ${outputMatch}`;

  return (
    <>
      <div className={className}>
        {outputLetter}
      </div>
    </>
  );
}