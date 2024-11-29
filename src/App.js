import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Import Socket.IO client
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ChatDisplay from './components/ChatDisplay';
import MessageInput from './components/MessageInput';
import Auth from './components/Auth';
import './styles/App.css';

function App() {
  const [messages, setMessages] = useState([]); // Messages to display
  const [typing, setTyping] = useState(false); // Typing status for bot
  const [theme, setTheme] = useState('dark'); // Dark/light theme state
  const [fontSize, setFontSize] = useState('medium'); // Font size for chat messages
  const [socket, setSocket] = useState(null); // Socket.IO connection
  const [authToken, setAuthToken] = useState(''); // Authentication token
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  const [currentChatId, setChatId] = useState(null); // Current chat ID
  const [userId, setUserId] = useState(null); // User ID
  const [chats, setChats] = useState([]); // List of chats

  useEffect(() => {
    if (!authToken) return;

    // Establish a Socket.IO connection
    const socketConnection = io('http://10.50.31.142:5005');
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to Rasa server via Socket.IO');
    });

    // Listen for messages from the bot
    socketConnection.on('bot_uttered', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: message.text, timestamp: new Date() },
      ]);
      setTyping(false);

      // Save bot's message to the database
      saveMessage(message.text, 'bot');
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from Rasa server');
    });

    return () => {
      socketConnection.disconnect(); // Clean up on component unmount
    };
  }, [authToken]);

  const saveMessage = async (text, sender) => {
    if (text.trim()) {
      const chatId = currentChatId;
      try {
        if (chatId) {
          // Save the message to the database
          await fetch(`http://localhost:5000/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              text,
              sender,
              timestamp: new Date(),
            }),
          });
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  const handleSendMessage = (text) => {
    if (text.trim()) {
      // Update the message display for the user
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text, timestamp: new Date() },
      ]);

      setTyping(true);

      // Send the message to the Rasa server
      socket?.emit('user_uttered', {
        message: text,
        // Optional: Use userId as the session ID for context tracking
      });
      // Save the user's message to the database
      saveMessage(text, 'user');
    }
  };

  const createNewChat = async () => {
    const response = await fetch('http://localhost:5000/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ text: 'New chat started with the bot!' }),
    });
    const data = await response.json();
    setChats((prevChats) => [...prevChats, data]); // Add the new chat
    setChatId(data._id); // Set the new chat ID
    setMessages([]); // Clear any previous messages
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const resetChat = () => {
    setMessages([]);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  const handleAuthentication = (token, userId) => {
    setAuthToken(token);
    setUserId(userId);
    setIsAuthenticated(true);
  };

  return (
    <div className={`app ${theme}`}>
      <Header title="Enhanced ChatGPT (Socket.IO Edition)" toggleTheme={toggleTheme} />
      <div className="main">
        <SettingsPanel
          theme={theme}
          toggleTheme={toggleTheme}
          resetChat={resetChat}
          changeFontSize={changeFontSize}
        />
        {isAuthenticated ? (
          <div className="chat-container">
            <div className="chat-list">
              {chats.length === 0 ? (
                <p>No chats available. Starting Chat 1...</p>
              ) : (
                chats.map((chat, index) => (
                  <div
                    key={chat._id}
                    className="chat-list-item"
                    onClick={() => setChatId(chat._id)}
                  >
                    Chat {index + 1}
                  </div>
                ))
              )}
              <button onClick={createNewChat}>Create New Chat</button>
            </div>
            <ChatDisplay messages={messages} typing={typing} fontSize={fontSize} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        ) : (
          <Auth onAuthenticate={handleAuthentication} />
        )}
      </div>
    </div>
  );
}

export default App;
