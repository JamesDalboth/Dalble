import './About.css';

import version from '../../../package.json';

import Switch from '../navigate/Switch';

function About(props) {
  const x = <p>DALBLE - v{version.version}</p>;

  const about = <p>This is a wordle clone (with a few tweaks) written by James Dalboth, hence Dalb-le.</p>;

  const tech = <p>Written in React, Hosted in AWS Lightsail. Deployed via terraform using a docker container.</p>

  const contactMe = <p>If you have found any bugs or wanted to contact me do so at james.dalboth@gmail.com</p>;

  return (
    <div>
      <Switch path="/" display="Game"/>
      <div className="About">
        {x}
        <hr/>
        {about}
        <hr/>
        {tech}
        <hr/>
        {contactMe}
      </div>
    </div>
  );
}

export default About;
