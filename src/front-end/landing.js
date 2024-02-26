import React, { useState, useEffect } from 'react';
import logo from '../logo.svg'
import '../App.css';

function Landing() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="Landing">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <p>The current time is {currentTime}.</p>
      </header>
    </div>
  );
}

export default Landing;