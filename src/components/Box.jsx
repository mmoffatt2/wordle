import './Box.css';

export default function Box({myRow, myCol, letterList, row, col}) {
  // console.log("Box: ", myRow, myCol, letterList, row, col);
  let outputLetter = "";
  let outputMatch = "";

  if (myRow*5+myCol <= row*5+col) {
    // console.log(`myRow, myCol: (${myRow}, ${myCol})`);
    // console.log(`row, col: (${row}, ${col})`);
    outputLetter = letterList[myRow*5+myCol].letter;
    outputMatch = letterList[myRow*5+myCol].match;
  }

  let className = `box-item ${outputMatch}`;

  return (
    <div className={className}>
      {outputLetter}
    </div>
  );
}