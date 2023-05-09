import {useRef, useEffect, useState} from 'react';
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

  {
    letterList: [[<Box letter=A />, B, C, D, E,
                 [F, G, H, I, J]],
    row: row,
    col: col
  }
  */
  const [gridState, setGridState] = useState({
    letterList: [],
    row: 0,
    col: -1
  });
  const [gameEnd, setGameEnd] = useState(false);
  const [keyboardColors, setKeyboardColors] = useState({});
  const maxCol = 5;
  const maxRow = 6;

  console.log("App", gridState.letterList);
  console.log(`App: (${gridState.row}, ${gridState.col})`);

  const testFunc = (e) => {
    console.log(e.key)
    // btnClicked(e)
  }


  // useEffect(() => {
  //   console.log("Mounted")
  //   window.addEventListener('keydown', btnClicked, true);

  //   return () => window.removeEventListener('keydown', btnClicked);
  // }, []);

  // const wordOfTheDay = 'stare';
  const wordOfTheDay = 'alnak';
  // const wordOfTheDay = 'kakaa';
  // const wordOfTheDay = 'kbbbk';
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
    // console.log("updateKeyboardColors", letterList);
    for (let i=0; i<letterList.length; i++) {
      let letter = letterList[i].letter;
      let state = letterList[i].match;
      if (keyboardColors[letter] === 'match') { /* never downgrade a match */}
      else if (keyboardColors[letter] === 'inWord') {
        /* only switch from partial match to full match */
        if (state === 'match') keyboardColors[letter] = state;
      } else {
        /* notMatch or never matched yet, go ahead and set it */
        keyboardColors[letter] = state;
      }
    }
    setKeyboardColors(keyboardColors);
  }

  const btnClicked = (event) => {
    console.log(event.type);
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
    // console.log(typeof key);

    switch (key) {
      case 'Enter': {
        console.log(`Enter: (${gridState.row}, ${gridState.col})`);
        let cpyList = [...gridState.letterList];
        if (gridState.col >= 4 && !gameEnd) {
          for (let i=gridState.row*maxCol, j=0; i<gridState.row*maxCol+maxCol; i++, j++) {
            if (cpyList[i].letter === wordOfTheDay[j]) {
              wordOfTheDayObj[cpyList[i].letter] -= 1;
              cpyList[i].match = 'match';
            }
          }
          
          for (let i=gridState.row*maxCol; i<gridState.row*maxCol+maxCol; i++) {
            if (cpyList[i].match !== 'match') {
              if (Object.prototype.hasOwnProperty.call(wordOfTheDayObj, cpyList[i].letter) &&
                  wordOfTheDayObj[cpyList[i].letter] > 0) {
                    wordOfTheDayObj[cpyList[i].letter] -= 1;
                    cpyList[i].match = 'inWord';
              } else {
                cpyList[i].match = 'notMatch';
              }
            }
          }
          
          updateKeyboardColors(cpyList);

          if (allMatch(cpyList.slice(gridState.row*maxCol, gridState.row*maxCol+maxCol))) {
            // popup: you win!
            setGameEnd(true);
            // setLetterList(cpyList);
            console.log('You won!!!!!!');
          }
          else if (gridState.row >= 5) {
            // popup: you failed!
            setGameEnd(true);
            // setLetterList(cpyList);
            console.log('Game over, try again?');
          } else {
            // go to next row
            setGridState((oldGridState) => {
              return {
                letterList: [...cpyList],
                col: -1,
                row: oldGridState.row + 1
              }
            });
          }
        }
        break;
      }
      case 'Del': {
        console.log(`Del: (${gridState.row}, ${gridState.col})`);
        if (gridState.col >= 0 && !gameEnd) {
          // setCol((prevCol) => prevCol - 1);
          // let cpyList = [...gridState.letterList];
          // cpyList[gridState.row].pop();
          // setLetterList(cpyList);
          setGridState((oldGridState) => {
            return {
              letterList: oldGridState.letterList.slice(0, -1),
              col: oldGridState.col - 1,
              row: oldGridState.row
            }
          });
        }
        break;
      }
      default: {
        // console.log(`default key: (${gridState.row}, ${gridState.col})`);
        setGridState((oldGridState) => {
          // console.log(`oldGridState: (${oldGridState.row}, ${oldGridState.col})`);
          if (oldGridState.col < maxCol-1) {
            return {
              letterList: [...oldGridState.letterList, {letter: key, match: 'notChecked'}],
              col: oldGridState.col + 1,
              row: oldGridState.row
            }
          } else return oldGridState; // don't change anything
        });
      }
    }
  }

  const cbRef = useRef(btnClicked);
  useEffect(() => { cbRef.current = btnClicked; }); // update each render
  useEffect(() => {
      const cb = e => cbRef.current(e); // then use most recent cb value
      window.addEventListener("keydown", cb);
      return () => { window.removeEventListener("keydown", cb) };
  }, []);

  return (
    <div>
      <Header />
      <Grid letterList={gridState.letterList} row={gridState.row} col={gridState.col} />
      <Keyboard keyboardColors={keyboardColors} btnClicked={btnClicked}/>
    </div>
  )
}

export default App
