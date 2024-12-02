import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messageEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const isUserAtBottomRef = useRef(true);
  const aiMessageRef = useRef("");

  const token = import.meta.env.VITE_OPENAI_API_KEY;

  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await axios.post(
        "https://ai.runsystem.work/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        headers
      );

      const responseText = response.data.choices[0].message.content;
      aiMessageRef.current = "";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      let index = 0;
      const interval = setInterval(() => {
        if (index < responseText.length) {
          aiMessageRef.current += responseText[index];
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].content = aiMessageRef.current;
            return newMessages;
          });
          index++;
        } else {
          clearInterval(interval);
          setIsThinking(false);
        }
      }, 50);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsThinking(false);
    }
  };

  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    const handleScroll = () => {
      const isAtBottom =
        chatMessages.scrollHeight - chatMessages.clientHeight <=
        chatMessages.scrollTop + 1;
      isUserAtBottomRef.current = isAtBottom;
    };

    chatMessages.addEventListener("scroll", handleScroll);
    return () => {
      chatMessages.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isUserAtBottomRef.current) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbot w-100">
      <div className="chatbot-messages" ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isThinking && (
          <div className="chatbot-message ai">AI is thinking...</div>
        )}
        <div ref={messageEndRef} />
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;