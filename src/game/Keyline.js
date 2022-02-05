import './Keyline.css';
import Key from './Key';

function Keyline(props) {
  return (
    <div className="Keyline">
      {Array.from(props.keys).map((key,i)=>{
        if (key === '1') {
          return <Key enter={true} key={i}/>
        }

        if (key === '2') {
          return <Key delete={true} key={i}/>
        }
        return <Key value={key} key={i}/>
      })}
    </div>
  );
}

export default Keyline;
