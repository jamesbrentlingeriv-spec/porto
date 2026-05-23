import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  text: string;
  date: string;
}

function getInitialMessages(): Message[] {
  const saved = localStorage.getItem('james_os_guestbook');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    {
      id: '0',
      name: 'SYSTEM',
      text: 'Welcome to the guestbook. Leave a trace.',
      date: new Date().toLocaleDateString()
    }
  ];
}

const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  // Persist to localStorage whenever messages change (debounced)
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    localStorage.setItem('james_os_guestbook', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString()
    };

    setMessages(prev => {
      const updated = [newMsg, ...prev];
      localStorage.setItem('james_os_guestbook', JSON.stringify(updated));
      return updated;
    });
    setName('');
    setText('');
  };

  return (
    <div className="flex flex-col h-full font-mono">
      <div className="flex-1 overflow-y-auto mb-4 border-2 border-white p-2 flex flex-col gap-4">
        {messages.map(msg => (
          <div key={msg.id} className="border-b border-gray-600 pb-2">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-bold text-white">{'>'} {msg.name}</span>
              <span className="text-xs text-gray-400">{msg.date}</span>
            </div>
            <p className="text-sm pl-4 text-gray-300 wrap-break-word">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="ENTER_NAME..."
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
          className="bg-black border-2 border-white text-white p-2 outline-none focus:bg-white focus:text-black transition-colors"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ENTER_MESSAGE..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={100}
            className="flex-1 bg-black border-2 border-white text-white p-2 outline-none focus:bg-white focus:text-black transition-colors"
          />
          <button
            type="submit"
            className="border-2 border-white p-2 hover:bg-white hover:text-black flex items-center justify-center transition-colors"
            disabled={!name.trim() || !text.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Guestbook;