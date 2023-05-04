import './Button.css';

export default function Button({keyboardColors, btnClicked, letter}) {
  let color = '';
  if (Object.prototype.hasOwnProperty.call(keyboardColors, letter)) {
    color = keyboardColors[letter];
  }

  return (
    <>
      <button className={color} onClick={btnClicked}>{letter}</button>
    </>
  )
}