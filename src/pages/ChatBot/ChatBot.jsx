import { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = import.meta.env.VITE_OPENAI_API_KEY;

  const header = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    axios
      .post(
        "https://ai.runsystem.work/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: newMessages,
        },
        header
      )
      .then((res) => {
        const response = res.data;
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: response.choices[0].message.content,
          },
        ]);
      })
      .catch(() => {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Sorry, I am not available right now.",
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  const handleClearContext = () => {
    setMessages([]);
    setUserInput("");
    setIsLoading(false);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h2>Chatbot</h2>
      <div style={styles.container}>
        <div style={styles.chatWindow}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  message.role === "user" ? "#daf8e3" : "#f1f0f0",
              }}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div
              style={{
                ...styles.message,
                alignSelf: "flex-start",
                backgroundColor: "#f1f0f0",
                fontStyle: "italic",
              }}
            >
              AI is thinking...
            </div>
          )}
        </div>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button style={styles.button} onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
          <button style={styles.clearButton} onClick={handleClearContext}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "900px",
    margin: "50px auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  chatWindow: {
    height: "300px",
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#fff",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "8px",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  clearButton: {
    padding: "10px 20px",
    margin: "0 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ChatBot;
