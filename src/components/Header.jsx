import React from 'react';
import { FaRobot } from 'react-icons/fa';
import '../styles/Header.css';

function Header({ title }) {
  return (
    <header className="header">
      <FaRobot className="header-icon" />
      <h1>{title}</h1>
    </header>
  );
}

export default Header;
