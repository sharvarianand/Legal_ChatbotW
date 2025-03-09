// In your sendMessage function in ChatComponent.jsx
const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    try {
      // Make an actual API call to your backend
      const response = await fetch("http://127.0.0.1:5000/chat", {

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
