import './Title.css';
import ShareButton from './ShareButton';
import Switch from './navigate/Switch';

/**
  Generates the title section. There are 2 cases.
  1. The player hasn't finished for the day. We display the game name DALBLE
  2. The player has finished for the day. We display the share button.
**/
function Title(props) {
  var toDisplay = <p>DALBLE</p>;

  if (props.share) {
    toDisplay = <ShareButton/>
  }

  return (
    <div>
      <div className="Title">
        <Switch path="/about" display="About"/>
        {toDisplay}
      </div>
    </div>
  );
}

export default Title;
