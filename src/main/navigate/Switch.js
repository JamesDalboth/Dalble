import './Switch.css';

import { useNavigate } from "react-router-dom";

function Switch(props) {

  const navigate = useNavigate();

  function handleClick() {
    navigate(props.path);
  }

  return (
    <div className="Switch" onClick={handleClick}>
      {props.display}
    </div>
  );
}

export default Switch;
