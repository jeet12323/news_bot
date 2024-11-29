import React from 'react';
import '../styles/SettingsPanel.css';

function SettingsPanel({ theme, toggleTheme, resetChat, changeFontSize }) {
  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <ul>
        <li onClick={toggleTheme}>
          Theme: {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        </li>
        <li onClick={() => changeFontSize('small')}>Font Size: Small</li>
        <li onClick={() => changeFontSize('medium')}>Font Size: Medium</li>
        <li onClick={() => changeFontSize('large')}>Font Size: Large</li>
        <li onClick={resetChat}>Reset Chat</li>
      </ul>
    </div>
  );
}

export default SettingsPanel;
