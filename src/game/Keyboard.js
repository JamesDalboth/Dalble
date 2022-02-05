import './Keyboard.css';
import Keyline from './Keyline';

function Keyboard() {
  return (
    <div className="Keyboard">
        <Keyline keys="QWERTYUIOP"/>
        <Keyline keys="ASDFGHJKL"/>
        <Keyline keys="1ZXCVBNM2"/>
    </div>
  );
}

export default Keyboard;
