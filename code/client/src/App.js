// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [nameAsked, setNameAsked] = useState(false);
  const [statusAsked, setStatusAsked] = useState(false);

  const sendMessage = async () => {
    const newMessages = [...messages, { text: inputText, sender: 'user' }];
    setMessages(newMessages);
    setInputText('');

    try {
      let response;
      if (!nameAsked) {
        response = "Hello! What's your name?";
        setNameAsked(true);
      } else if (!statusAsked) {
        response = `Nice to meet you, ${inputText}! Are you a working professional or a student?`;
        setStatusAsked(true);
      } else if (inputText.toLowerCase().includes("thank you for helping me")) {
        response = `Thank you ${inputText} for using the chatbot. Have a nice day.`;
      } else {
        response = await getBotResponse(inputText);
      }
      const botMessages = [...newMessages, { text: response, sender: 'bot' }];
      setMessages(botMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getBotResponse = async (userInput) => {
    const response = await axios.post('http://localhost:5000/api', { "message": userInput });
    return response.data.message;
  };
  return (
    <div className="container">
      <h1>MINDSUPPORT</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
           <div key={index} className={`message ${msg.sender}`}>
           {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
     <br></br> <footer>MINDSUPPORT can make mistakes. Check important info.</footer>
    </div>
  );
}

export default App;
