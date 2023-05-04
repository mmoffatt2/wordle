import './Keyboard.css';
import Button from './Button';

export default function Keyboard({keyboardColors, btnClicked}) {
  // function btnClickedW() {
  //   alert('clicked W');
  // }
  return (
    <>
      <div className='wordleKeyboard'>
        <div>
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'q'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'w'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'e'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'r'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'t'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'y'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'u'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'i'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'o'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'p'} />
        </div>
        <div>
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'a'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'s'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'d'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'f'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'g'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'h'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'j'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'k'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'l'} />
        </div>
        <div>
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'Del'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'z'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'x'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'c'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'v'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'b'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'n'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'m'} />
          <Button keyboardColors={keyboardColors} btnClicked={btnClicked} letter={'Enter'} />
        </div>
      </div>
    </>
  );
}