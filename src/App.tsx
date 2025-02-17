import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Home/>
      </div>
    </Router>
  );
};

export default App;