import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI Shopping Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post("http://localhost:8000/chat/", { message: input }, config);
      
      const assistantMessage = { 
        role: "assistant", 
        content: res.data.reply,
        products: res.data.products 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to the AI. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chat-container glass">
        <div className="chat-header">
          <h3>AI Assistant</h3>
        </div>
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="message-bubble">{msg.content}</div>
              {msg.products && msg.products.length > 0 && (
                <div className="chat-products">
                  {msg.products.map(p => (
                    <div key={p.id} className="chat-product-inline">
                       <img src={p.image_url || "https://via.placeholder.com/50"} alt="" />
                       <div>
                         <div className="chat-product-name">{p.name}</div>
                         <div className="chat-product-price">$ {p.price}</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="chat-message assistant">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;