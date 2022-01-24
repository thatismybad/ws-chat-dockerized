import React, { useEffect, useState } from 'react';
import './App.css';

type Message = {
  author: string;
  message: string;
}

function App() {
  const [name, setName] = useState<string>(localStorage.getItem("name") ?? "");
  const [isNameLocked, setNameLocked] = useState<boolean>(name.trim() !== "");
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<Array<Message>>([]);

  const ws = new WebSocket(`ws://${process.env.REACT_APP_WS_URL}/chat`);

  useEffect(
    () => {
      ws.onmessage = (event) => {
        const newHistory: Array<Message> = [...history];
        newHistory.push(JSON.parse(event?.data))
        setHistory(newHistory);
      }
      
      return () => {
        ws.close();
      }
    }
  )

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (name.trim() !== "" && message.trim() !== "") {
      localStorage.setItem("name", name);
      const data = { author: name, message };
      ws.send(JSON.stringify({ event: "message", data }))
      history.push(data);
      setNameLocked(true);
      setMessage("");
    }
  }

  return (
    <div className="App">
      <header>
        <div>
        <label>
          Username:{' '}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' disabled={isNameLocked}/>
        </label>
        </div>
        <div>
          <form onSubmit={sendMessage}>
        <label>
          Message:{' '}
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Aa..' disabled={name.trim() === ""} />
          <button disabled={name.trim() === ""}>Send</button>
        </label>
        </form>
        </div>
        <hr />
        <div>
          {
            history.map((item: Message, index: number) => <div key={index}>{item.author}: {item.message}</div>)
          }
        </div>
      </header>
    </div>
  );
}

export default App;
