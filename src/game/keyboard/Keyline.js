import './Keyline.css';
import Key from './Key';

export const ENTER_KEY = '1';
export const DELETE_KEY = '2';

/**
  Generates a line of input keys.
  Keys to generate are provided in props.keys string.
  Special values are:
    1 -> Enter Key
    2 -> Delete Key
**/
export const Keyline = (props) => {
  return (
    <div className="Keyline">
      {Array.from(props.keys).map((key,i)=>{
        return <Key enter={key === ENTER_KEY} delete={key === DELETE_KEY} value={key} key={i}/>
      })}
    </div>
  );
}
