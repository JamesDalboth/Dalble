import './Title.css';
import ShareButton from './ShareButton';

function Title(props) {
  if (!props.share) {
    return (
      <div className="Title">
        DALBLE
        <hr/>
      </div>
    );
  }

  return (
    <div className="Title">
      <ShareButton/>
      <hr/>
    </div>
  );
}

export default Title;
