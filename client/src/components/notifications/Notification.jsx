import React from 'react';
import { ChatState } from '../../context/Chatprovider';
import { getSender } from '../../config/senderLogic';
import { format } from 'timeago.js';
export default function notification({ chats }) {

    const { user, setSelectedChat, notifications, setnotifications } = ChatState()
    return <div onClick={() => {
        setSelectedChat(chats.chat);
        setnotifications(notifications.filter((n) => n !== chats))
    }}>
        <div className="message">
            {chats.chat.isGroupChat ? ` New mesage in ${chats.chat.chatName}` : ` ${getSender(user, chats.chat.users)} send you a message `}
        </div>
        <span>{format(chats.createdAt)}</span>
    </div>;
}
