import React from 'react';

function ChatList({ chats, setChatId, setMessages }) {
  const handleChatClick = (chatId) => {
    setChatId(chatId);
    setMessages([]); // Clear current messages on chat change
  };

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="chat-item"
          onClick={() => handleChatClick(chat._id)}
        >
          Chat {chat._id}
        </div>
      ))}
    </div>
  );
}

export default ChatList;
