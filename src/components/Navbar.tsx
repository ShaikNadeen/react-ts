import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

const Navbar: React.FC = () => {


  return (
    <nav >
      <ul className='navbarstyles'>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
            <Link to='/About'>About</Link>
        </li>
        <li>Country</li>
      </ul>
    </nav>
  );
};

export default Navbar;