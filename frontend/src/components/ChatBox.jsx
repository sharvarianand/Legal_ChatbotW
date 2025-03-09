import React, { useState, useEffect } from "react";
import Input from "../../ui/input";
import Button from "../../ui/button";
import Card from "../../ui/card";
import CardContent from "../../ui/cardContent";
import { FiLoader, FiMoon, FiSun, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    try {
      // Make an API call to your backend
      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
  
      const data = await response.json();
      setMessages([...newMessages, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { text: "Sorry, there was an error processing your request.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-4", darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black")}>      
      <div className="w-full max-w-2xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Legal Chatbot</h1>
          <Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </Button>
        </div>
        <Card className="h-96 overflow-y-auto p-4 border rounded-2xl shadow-lg bg-white dark:bg-gray-800">
          <CardContent>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-3 my-2 max-w-xs rounded-xl",
                  msg.sender === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black self-start"
                )}
              >
                {msg.text}
              </motion.div>
            ))}
            {loading && <FiLoader className="animate-spin mx-auto mt-2" />}
          </CardContent>
        </Card>
        <div className="mt-4 flex items-center gap-2">
          <Input
            className="flex-1 p-3 border rounded-lg"
            placeholder="Ask your legal question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={loading}>
            <FiSend className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;