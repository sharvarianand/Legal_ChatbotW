import React, { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiDownload, FiSearch, FiMenu, FiX, FiPlus } from "react-icons/fi";
import axios from "axios";
import jsPDF from "jspdf";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    axios.get("/api/get_chat_history").then((response) => {
      setChatHistory(response.data);
    });
  }, []);

  useEffect(() => {
    setFilteredMessages(
      messages.filter((msg) => msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, messages]);

  const exportChat = () => {
    const doc = new jsPDF();
    let y = 10;
    messages.forEach((msg) => {
      doc.text(msg.sender + ": " + msg.text, 10, y);
      y += 10;
    });
    doc.save("chat_history.pdf");
  };

  const translateChat = (lang) => {
    axios.post("/api/translate_chat", { messages, lang }).then((response) => {
      setMessages(response.data);
      setLanguage(lang);
    });
  };

  return (
    <div className="flex h-screen">
      {/* Side Panel */}
      {showHistory && (
        <div className="w-1/4 bg-gray-100 p-4">
          <FiX className="cursor-pointer text-xl" onClick={() => setShowHistory(false)} />
          <h3 className="text-lg font-bold mb-4">Chat History</h3>
          {chatHistory.map((chat, index) => (
            <Card key={index} className="mb-2 cursor-pointer">
              <CardContent>{chat.title}</CardContent>
            </Card>
          ))}
          <Button onClick={() => console.log("New Chat")}> <FiPlus /> New Chat</Button>
        </div>
      )}
      
      {/* Main Chat Interface */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center mb-4">
          <FiMenu className="text-2xl cursor-pointer" onClick={() => setShowHistory(true)} />
          <Input placeholder="Search Chat" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="ml-4" />
          <Button onClick={exportChat} className="ml-4"><FiDownload /> Export</Button>
          <select className="ml-4 p-2 border rounded" onChange={(e) => translateChat(e.target.value)} value={language}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map((msg, index) => (
            <div key={index} className={`p-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>{msg.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
