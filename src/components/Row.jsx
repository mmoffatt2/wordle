import Box from './Box';
import './Row.css';

export default function Row({myRow, letterList, row, col}) {
  return (
    <>
      <div className='rowContainer'>
        <Box myCol={0} myRow={myRow} letterList={letterList} row={row} col={col} />
        <Box myCol={1} myRow={myRow} letterList={letterList} row={row} col={col} />
        <Box myCol={2} myRow={myRow} letterList={letterList} row={row} col={col} />
        <Box myCol={3} myRow={myRow} letterList={letterList} row={row} col={col} />
        <Box myCol={4} myRow={myRow} letterList={letterList} row={row} col={col} />
      </div>
    </>
  );
}
