import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './main.css';
import Home from './games/home';
import EightQueensGame from './games/eightqueen_game/components/main';
import Knightstour_main from './games/knighttour_game/knightstour_main';
import TicTacToeGame from './games/tictactoe_game/main';
import TowerOfHanoiGame from './games/towerofhanoi_game/main';
import TravelingSalesmanGame from './games/travelingsalesman_game/main';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/eightQueensGame' element={<EightQueensGame />} />
        <Route path='/knightsTourGame' element={<Knightstour_main />} />
        <Route path='/ticTacToeGame' element={<TicTacToeGame />} />
        <Route path='/towerOfHanoiGame' element={<TowerOfHanoiGame />} />
        <Route path='/travelingSalesmanGame' element={<TravelingSalesmanGame />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);