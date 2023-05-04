import Row from './Row';
import './Grid.css';

export default function Grid({letterList, row, col}) {
  return (
    <>
      <div className='wordleGrid'>
        <Row myRow={0} letterList={letterList} row={row} col={col}/>
        <Row myRow={1} letterList={letterList} row={row} col={col}/>
        <Row myRow={2} letterList={letterList} row={row} col={col}/>
        <Row myRow={3} letterList={letterList} row={row} col={col}/>
        <Row myRow={4} letterList={letterList} row={row} col={col}/>
        <Row myRow={5} letterList={letterList} row={row} col={col}/>
      </div>
    </>
  );
}