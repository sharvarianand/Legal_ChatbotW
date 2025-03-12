import React, { useState, useEffect, useRef } from "react";
import Input from "../design/input.jsx";
import Button from "../design/button.jsx";
import Card from "../design/card.jsx";
import CardContent from "../design/cardContent.jsx";
import { FiLoader, FiMoon, FiSun, FiSend, FiInfo, FiUser, FiTrash2, FiDownload, FiSearch, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils.js";
import { detectLanguage, translateText } from "../services/translationService"; // Import translation services

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [language, setLanguage] = useState("en"); // State for language
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Add a welcome message when the component mounts
  useEffect(() => {
    // Only add the welcome message if there are no messages yet
    if (messages.length === 0) {
      setMessages([
        {
          text: "Welcome to Legal Chatbot for Women! 👩‍⚖️\n\nI'm here to provide information on legal issues specifically focused on women's rights and concerns. Feel free to ask me any legal question, and I'll do my best to assist you.\n\nPlease note that my responses are for informational purposes only and should not substitute professional legal advice.",
          sender: "bot",
          timestamp: new Date().toISOString(),
          animated: true
        }
      ]);
    }
  }, []); // Empty dependency array ensures this runs only once on component mount

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([{
        text: "Chat history cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
        animated: true
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Detect language and translate input if necessary
    const detectedLanguage = await detectLanguage(input);
    setLanguage(detectedLanguage);
    const translatedInput = detectedLanguage !== "en" ? await translateText(input, "en") : input;
    
    // Add the user message immediately for better UX
    const userMessage = { 
      text: input, 
      sender: "user", 
      timestamp: new Date().toISOString(),
      animated: true 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    try {
      // Show typing indicator for better UX
      const typingTimeout = setTimeout(() => {
        setMessages([...newMessages, { text: "Typing...", sender: "bot", isTyping: true }]);
      }, 500);
      
      // Make an API call to your backend
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: translatedInput,
          conversation_history: messages.slice(-10) // Send recent conversation for context
        }),
      });
      
      clearTimeout(typingTimeout);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      const data = await response.json();
      const translatedResponse = language !== "en" ? await translateText(data.response, language) : data.response;
      
      // Remove typing indicator if it exists and add the actual response
      setMessages(prev => 
        prev.filter(msg => !msg.isTyping).concat({ 
          text: translatedResponse, 
          sender: "bot",
          timestamp: new Date().toISOString(),
          animated: true
        })
      );
    } catch (error) {
      console.error("Error:", error);
      
      // Remove typing indicator if it exists and add error message
      setMessages(prev => 
        prev.filter(msg => !msg.isTyping).concat({
          text: "Sorry, there was an error processing your request. Please try again.",
          sender: "bot",
          isError: true,
          timestamp: new Date().toISOString(),
          animated: true
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => `${msg.sender === "user" ? "You" : "Bot"}: ${msg.text}`).join("\n");
    const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleHistory = async () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/history");
        const data = await response.json();
        setChatHistory(data.history);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-200",
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white" 
        : "bg-gradient-to-br from-pink-50 via-white to-blue-50 text-gray-800"
    )}>
      <div className="w-full max-w-2xl">
        {/* Header with Logo and Controls */}
        <div className="flex justify-between items-center mb-4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 backdrop-blur-sm shadow-md">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
              W
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Legal Chatbot for Women
            </h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => setShowInfo(!showInfo)}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center"
            >
              <FiInfo className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={clearChat}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center text-gray-500 hover:text-red-500"
            >
              <FiTrash2 className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={exportChat}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center text-gray-500 hover:text-blue-500"
            >
              <FiDownload className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={toggleHistory}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center text-gray-500 hover:text-green-500"
            >
              <FiSearch className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full h-9 w-9 p-0 flex items-center justify-center"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 backdrop-blur-sm shadow-md overflow-hidden"
            >
              <h2 className="font-bold text-lg mb-2">About this Chatbot</h2>
              <p className="text-sm">
                This AI-powered legal assistant is specifically designed to provide information on legal issues affecting women.
                It can help with questions about workplace rights, family law, protection orders, discrimination, and more.
                <br /><br />
                <span className="text-purple-600 dark:text-purple-400 font-medium">Remember:</span> The information provided is for educational purposes only and does not constitute legal advice.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        

        
        {/* Chat Container */}
        <Card 
          ref={chatContainerRef}
          className={cn(
            "h-[450px] overflow-y-auto p-4 border rounded-xl shadow-lg backdrop-blur-sm",
            darkMode 
              ? "bg-gray-800/80 border-gray-700" 
              : "bg-white/90 border-gray-200"
          )}
        >
          <CardContent>
            {messages.length === 0 ? (

              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (

                  <AnimatePresence mode="wait" key={index}>
                    <motion.div
                      initial={msg.animated ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex",
                        msg.sender === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl max-w-[80%] shadow-sm",
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white border border-gray-200 text-gray-800",
                          msg.isError && "bg-red-100 text-red-600 border-red-200"
                        )}
                      >
                        {msg.isTyping ? (
                          <div className="flex items-center space-x-1 h-6 px-2">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-75"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-line text-sm md:text-base">
                              {msg.text}
                            </div>
                            <div className="text-xs opacity-70 mt-1 text-right">
                              {formatTime(msg.timestamp)}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Input Area */}
        <div className="mt-4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-3 backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-2">
            <Input
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border text-base focus:ring-2 transition-all", 
                darkMode 
                  ? "bg-gray-700 text-gray-100 placeholder-gray-400 caret-white border-gray-600 focus:ring-purple-500 focus:border-transparent" 
                  : "bg-white text-black focus:ring-pink-500 focus:border-transparent"
              )}
              placeholder="Ask your legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading}
              className={cn(
                "rounded-xl p-3 h-12 w-12 flex items-center justify-center",
                !loading && "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              )}
            >
              {loading 
                ? <FiLoader className="w-5 h-5 animate-spin" /> 
                : <FiSend className="w-5 h-5" />
              }
            </Button>
          </div>
          <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
            Powered by Meta Llama Vision AI • For informational purposes only
          </div>
        </div>
      </div>
      
      {/* Side Panel for Chat History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chat History</h2>
              <Button 
                variant="ghost" 
                onClick={startNewChat}
                className="rounded-full h-9 w-9 p-0 flex items-center justify-center text-gray-500 hover:text-green-500"
              >
                <FiPlus className="w-5 h-5" />
              </Button>
            </div>
            <ul>
              {chatHistory.map((chat, index) => (
                <li key={index} className="mb-2">
                  <button 
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setMessages(chat.messages)}
                  >
                    {chat.prompt}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatComponent;
