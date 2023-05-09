import {useRef, useEffect, useState} from 'react';
import './App.css'
import Header from './components/Header';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import raw from '../data/wordles.txt';
import allowed from '../data/combined_wordlist.txt';


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// let wordOfTheDay = "";
// let wordOfTheDay = downloadDictionary().then();
// console.log(wordOfTheDay)
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
  const [wordOfTheDay, setWordOfTheDay] = useState("");
  const [allowedWords, setAllowedWords] = useState([])
  const maxCol = 5;
  const maxRow = 6;

  console.log("App", gridState.letterList);
  console.log(`App: (${gridState.row}, ${gridState.col})`);


  useEffect(() => {
    // Declare a boolean flag that we can use to cancel the API request.
    let ignoreStaleRequest = false;

    // Call REST API to get the post's information
    fetch(raw, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.text();
      })
      .then((data) => {
        // If ignoreStaleRequest was set to true, we want to ignore the results of the
        // the request. Otherwise, update the state to trigger a new render.
        if (!ignoreStaleRequest) {
          // read response stream as text
          let wordList = data.split("\n");
          let maxWords = wordList.length;
          let wordNumber = getRandomInt(0, maxWords);
          console.log(wordList[wordNumber])
          setWordOfTheDay(wordList[wordNumber]);
        }
      })
      .catch((error) => console.log(error));

    return () => {
      // This is a cleanup function that runs whenever the Post component
      // unmounts or re-renders. If a Post is about to unmount or re-render, we
      // should avoid updating state.
      ignoreStaleRequest = true;
    };
  }, []);

  useEffect(() => {
    // Declare a boolean flag that we can use to cancel the API request.
    let ignoreStaleRequest = false;

    // Call REST API to get the post's information
    fetch(allowed, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.text();
      })
      .then((data) => {
        // If ignoreStaleRequest was set to true, we want to ignore the results of the
        // the request. Otherwise, update the state to trigger a new render.
        if (!ignoreStaleRequest) {
          // read response stream as text
          setAllowedWords(data.split("\n"));
        }
      })
      .catch((error) => console.log(error));

    return () => {
      // This is a cleanup function that runs whenever the Post component
      // unmounts or re-renders. If a Post is about to unmount or re-render, we
      // should avoid updating state.
      ignoreStaleRequest = true;
    };
  }, []);

  // const wordOfTheDay = 'stare';
  // const wordOfTheDay = 'alnak';
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
    let key;
    if (event.type === 'keydown') {
      key = event.key;
      if (key === 'Backspace') {
        key = 'Del';
      }
    } else if (event.type === 'click') {
      key = event.target.innerHTML;
    }

    // console.log(typeof key);

    switch (key) {
      case 'Enter': {
        // console.log(`Enter: (${gridState.row}, ${gridState.col})`);
        let letters = gridState.letterList.map(obj => obj.letter)
        let guess = letters.slice(gridState.row*maxCol, gridState.row*maxCol+maxCol).join('')
        if (!allowedWords.includes(guess)) {
          break;
        }

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
        // console.log(`Del: (${gridState.row}, ${gridState.col})`);
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
        // regular expressions: only allow a-z
        key = key.toLowerCase()
        if (/^[a-z]$/.test(key)) {
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
