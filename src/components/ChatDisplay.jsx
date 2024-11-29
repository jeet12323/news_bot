import React from 'react';
import '../styles/ChatDisplay.css';

function ChatDisplay({ messages, typing, fontSize }) {
  return (
    <div className="chat-display">
      {/* Loop through all the messages */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat-message ${message.sender === 'user' ? 'user' : 'bot'}`}
          style={{
            fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px',
          }}
        >
          {/* Message bubble */}
          <div className="chat-bubble">
            <p>{message.text}</p>
            {/* Timestamp of the message */}
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {/* Avatar depending on the sender */}
          <div className="avatar">
            {message.sender === 'user' ? '👤' : '🤖'}
          </div>
        </div>
      ))}
      
      {/* Typing animation when the bot is typing */}
      {typing && (
        <div className="chat-message bot">
          <div className="chat-bubble typing-animation">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatDisplay;
