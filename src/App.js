import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Game from './main/Game'
import About from './main/about/About'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;