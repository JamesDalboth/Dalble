import './Line.css';
import Box from './Box'

function Line(props) {
  if (props.guess != null) {
    return (
      <div className="Line">
        <Box value={props.guess[0]} index={0} guess={props.guess} complete={props.complete}/>
        <Box value={props.guess[1]} index={1} guess={props.guess} complete={props.complete}/>
        <Box value={props.guess[2]} index={2} guess={props.guess} complete={props.complete}/>
        <Box value={props.guess[3]} index={3} guess={props.guess} complete={props.complete}/>
        <Box value={props.guess[4]} index={4} guess={props.guess} complete={props.complete}/>
      </div>
    );
  }

  return (
    <div className="Line">
      <Box/>
      <Box/>
      <Box/>
      <Box/>
      <Box/>
    </div>
  );
}

export default Line;
