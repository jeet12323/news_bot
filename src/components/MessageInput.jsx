import React, { useState } from 'react';
import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import '../styles/MessageInput.css';

function MessageInput({ onSendMessage }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(text);
    setText('');
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <FaPaperclip className="attachment-icon" />
      <FaSmile className="emoji-icon" />
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="send-button">
        <FaPaperPlane />
      </button>
    </form>
  );
}

export default MessageInput;
