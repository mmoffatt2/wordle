import {useCallback, useEffect, useState} from 'react';
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
 
  console.log(letterList);
  console.log(col)

  const testType = ({ key }) => {
    console.log(key)
    let cpyList = [...letterList]
    cpyList[row].push({letter: key, match: 'notChecked'});
    setLetterList(cpyList)
    // setLetterList((oldLetterList) => {
    //   oldLetterList[row].push({letter: key, match: 'notChecked'});
    //   return [...oldLetterList];
    // });
  }
  useEffect(() => {
    document.addEventListener('keydown', btnClicked, true)

    return () => document.removeEventListener('keydown', btnClicked)
  }, []);

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
    // let cpyKeyboardColors = keyboardColors
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

  const btnClicked = (event) => {
    console.log(event.type);
    // console.log(event);
    let key;
    if (event.type === 'keydown') {
      key = event.key;
      if (key === 'Backspace') {
        key = 'Del';
      }
    } else if (event.type === 'click') {
      key = event.target.innerHTML;
    }
    console.log(key);
    console.log(typeof key);

    switch (key) {
      case 'Enter':
        let cpyList = [...letterList];
        if (col >= 4 && !gameEnd) {
          let lastRow = cpyList[cpyList.length-1];
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
          
          updateKeyboardColors(cpyList);

          if (allMatch(lastRow)) {
            // popup: you win!
            setGameEnd(true);
            setLetterList(cpyList);
            console.log('You won!!!!!!');
          }
          else if (row >= 5) {
            // popup: you failed!
            setGameEnd(true);
            setLetterList(cpyList);
            console.log('Game over, try again?');
          } else {
            // go to next row
            setCol(-1);
            setRow((prevRow) => prevRow+1);
            // letterList.push([]);
            setLetterList([...cpyList, []]);
          }
        }
        break;
      case 'Del':
        console.log("got here")
        console.log("col:, ", col)
        if (col >= 0 && !gameEnd) {
          setCol((prevCol) => prevCol - 1);
          let cpyList = [...letterList];
          cpyList[row].pop();
          setLetterList(cpyList);
          // setLetterList((oldLetterList) => oldLetterList[row].slice(0, -1));
        }
        break;
      default:
        if (col < 4) {
          setCol((prevCol) => prevCol + 1);
          let cpyList = [...letterList];
          cpyList[row].push({letter: key, match: 'notChecked'});
          setLetterList(cpyList);
          // letterList[row].push({letter: key, match: 'notChecked'});
          // setLetterList((oldLetterList) => {
          //   oldLetterList[row].push({letter: key, match: 'notChecked'});
          //   return [...oldLetterList];
          // });
        }
    }
  }

  return (
    <div>
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