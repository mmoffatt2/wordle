import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Find list of words here:
// https://github.com/Kinkelin/WordleCompetition/tree/main/data/official
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


/*
TODO:
Prevent other keys (such as arrow keys or punctuation)

*/