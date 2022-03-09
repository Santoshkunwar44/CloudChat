import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setnotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNewUser = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  };
  useEffect(() => {
    fetchNewUser();
  }, [selectedChat]);

  return (
    <ChatContext.Provider
      value={{
        user,
        selectedChat,
        chats,
        notifications,
        setnotifications,
        setSelectedChat,
        setUser,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
