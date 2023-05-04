import {useState} from 'react';
import './App.css'
import Header from './components/Header';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import raw from '../data/wordles200.txt';

let wordList;

function readFile() {
  fetch(raw)
  .then(r => r.text())
  .then(text => {
    wordList = text.split('\r\n')
    // console.log('text decoded:', text);
    // console.log(wordList);
    // return wordList;
  });
}

readFile();
// console.log(wordList);

function App() {
  /*
  {
    letter: 'C',
    match: match / in word / not match
  }

   [<Box letter=A />, B, C, D, E,
    F, G, H, I, J
   ]
  */
  const [letterList, setLetterList] = useState([[]]);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(-1);
  const [gameEnd, setGameEnd] = useState(false);
  const [keyboardColors, setKeyboardColors] = useState({});
  // const handleKeyPress = (event) => {
  //   console.log('event');
  //   if (event.key === 'Enter') {
  //     console.log('got enter');
  //   }
  // };
  // const wordOfTheDay = 'stare';
  
  const wordOfTheDay = 'alnak';
  // kakaa
  // kbbbk
  function countLetters(word) {
    let targetObj = {};
    for (let c of word) {
      if (Object.prototype.hasOwnProperty.call(targetObj,c)) {
        targetObj[c] += 1;
      } else {
        targetObj[c] = 1;
      }
    }
    return targetObj;
  }
  const wordOfTheDayObj = countLetters(wordOfTheDay);

  function allMatch(lastRow) {
    for (let letterObj of lastRow) {
      if (letterObj.match !== 'match') return false;
    }
    return true;
  }

  function updateKeyboardColors(letterList) {
    for (let row=0; row<letterList.length; row++) {
      for (let col=0; col<letterList[row].length; col++) {
        let letter = letterList[row][col].letter;
        let state = letterList[row][col].match;
        if (keyboardColors[letter] === 'match') { /* never downgrade a match */}
        else if (keyboardColors[letter] === 'inWord') {
          /* only switch from partial match to full match */
          if (state === 'match') keyboardColors[letter] = state;
        } else {
          /* notMatch or never matched yet, go ahead and set it */
          keyboardColors[letter] = state;
        }
      }
    }
    setKeyboardColors(keyboardColors);
  }

  function btnClicked(event) {
    switch (event.target.innerHTML) {
      case 'Enter':
        if (col >= 4 && !gameEnd) {
          let lastRow = letterList[letterList.length-1];
          for (let i=0; i<lastRow.length; i++) {
            if (lastRow[i].letter === wordOfTheDay[i]) {
              wordOfTheDayObj[lastRow[i].letter] -= 1;
              lastRow[i].match = 'match';
            }
          }
          
          for (let i=0; i<lastRow.length; i++) {
            if (lastRow[i].match !== 'match') {
              if (Object.prototype.hasOwnProperty.call(wordOfTheDayObj, lastRow[i].letter) &&
                  wordOfTheDayObj[lastRow[i].letter] > 0) {
                    wordOfTheDayObj[lastRow[i].letter] -= 1;
                    lastRow[i].match = 'inWord';
              } else {
                lastRow[i].match = 'notMatch';
              }
            }
          }
          
          updateKeyboardColors(letterList);

          if (allMatch(lastRow)) {
            // popup: you win!
            setGameEnd(true);
            setLetterList([...letterList]);
            console.log('You won!!!!!!');
          }
          else if (row >= 5) {
            // popup: you failed!
            setGameEnd(true);
            setLetterList([...letterList]);
            console.log('Game over, try again?');
          } else {
            // go to next row
            setCol(-1);
            setRow(row+1);
            letterList.push([]);
            setLetterList([...letterList]);
          }
        }
        break;
      case 'Del':
        if (col >= 0 && !gameEnd) {
          setCol(col-1);
          letterList[row].pop();
          setLetterList([...letterList]);
        }
        break;
      default:
        if (col < 4) {
          setCol(col+1);
          letterList[row].push({letter: event.target.innerHTML, match: 'notChecked'});
          setLetterList([...letterList]);
        }
    }
  }

  function keyEntered(event) {
    console.log(event);
  }

  return (
    <div onKeyUp={keyEntered}>
      <Header />
      <Grid letterList={letterList} row={row} col={col} />
      <Keyboard keyboardColors={keyboardColors} btnClicked={btnClicked}/>
    </div>
  )
}

export default App




// // check against word of the day
// let lastRow = letterList[letterList.length-1];
// let posDict = {};

// let pos = 0;
// for (let i=0; i<lastRow.length; i++) {
//   console.log(lastRow[i], wordOfTheDay[i]);
//   if (lastRow[i].letter in posDict) {
//     pos = posDict[lastRow[i].letter] + 1;
//   }
//   if (lastRow[i].letter === wordOfTheDay[i]) {
//     posDict[lastRow[i].letter] = wordOfTheDay.indexOf(lastRow[i].letter, pos);
//     lastRow[i].match = 'match';
//   }
//   else {
//     let indx = wordOfTheDay.indexOf(lastRow[i].letter, pos);
//     if (indx !== -1) {
//       posDict[lastRow[i].letter] = indx;
//       lastRow[i].match = 'inWord';
//     }
//     else lastRow[i].match = 'notMatch';
//   }
// }