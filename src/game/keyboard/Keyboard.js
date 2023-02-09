import './Keyboard.css';
import { Keyline, ENTER_KEY, DELETE_KEY } from './Keyline';

/**
  Generates an input keyboard following standard qwerty + enter + delete keys.
**/
function Keyboard() {
  return (
    <div className="Keyboard">
        <Keyline keys="QWERTYUIOP"/>
        <Keyline keys="ASDFGHJKL"/>
        <Keyline keys={ENTER_KEY + "ZXCVBNM" + DELETE_KEY}/>
    </div>
  );
}

export default Keyboard;
