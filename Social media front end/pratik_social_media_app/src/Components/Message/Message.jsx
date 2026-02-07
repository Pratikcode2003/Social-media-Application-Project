import Grid from '@mui/material/Grid'
import React, { useEffect, useRef, useState } from 'react'
import WestIcon from '@mui/icons-material/West';
import { Avatar, Backdrop, CircularProgress, IconButton } from '@mui/material';
import AddCallIcon from '@mui/icons-material/AddCall';
import VideocamIcon from '@mui/icons-material/Videocam';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SearchUser from '../SearchUser/SearchUser';
import UserChatCard from './UserChatCard';
import ChatMessage from './ChatMessage';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage, getAllChats } from '../../Redux/Message/Message.action';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SockJS from "sockjs-client";
import Stom from 'stompjs'
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const Message = () => {
  const { message, auth } = useSelector(store => store)
  const dispatch = useDispatch()

  // Use Redux state for currentChat instead of local state
  const { currentChat } = message;
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllChats())
  }, [dispatch])

  const handleSelectImage = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true)
    console.log("handle selected images...");
    try {
      const imgUrl = await uploadToCloudinary(e.target.files[0], "image")
      setSelectedImage(imgUrl)
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setLoading(false)
      e.target.value = '';
    }
  }

  const handleSelectChat = (chat) => {
    // Dispatch to Redux and also set local messages
    dispatch({ type: "SET_CURRENT_CHAT", payload: chat });
    setMessages(chat.messages || []);
  };

  const handleCreateMessage = (content) => {
    const messageData = {
      chatId: currentChat?.id,
      content: content || "",
      image: selectedImage
    }
    dispatch(createMessage({ message: messageData, sendMessageToServer }))
  }

  const handleSendMessage = () => {
    if (messageText.trim() || selectedImage) {
      handleCreateMessage(messageText.trim());
      setMessageText("");
      setSelectedImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const handleChatDeleted = (deletedChatId) => {
    if (currentChat?.id === deletedChatId) {
      // Clear current chat in Redux
      dispatch({ type: "SET_CURRENT_CHAT", payload: null });
      setMessages([]);
    }
  };

  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:8080/ws")
    const stomp = Stom.over(sock);
    setStompClient(stomp);
    stomp.connect({}, onConnect, onErr)
    
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    }
  }, [])

  const onConnect = () => {
    console.log("Web socket connected....");
  }

  const onErr = (error) => {
    console.log("err", error);
  }

  useEffect(() => {
    if (stompClient && auth.user && currentChat) {
      console.log("Subscribing to chat:", currentChat.id);
      const subscription = stompClient.subscribe(`/user/${currentChat.id}/private`, onMessageRecieve);
      
      // Cleanup subscription when component unmounts or chat changes
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [stompClient, auth.user, currentChat]) // Add dependencies

  const sendMessageToServer = (newMessage) => {
    if (stompClient && newMessage && currentChat) {
      stompClient.send(`/app/chat/${currentChat.id.toString()}`, {}, JSON.stringify(newMessage))
    }
  }

  const onMessageRecieve = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    console.log("Message received from websocket", receivedMessage);

    // Update Redux state
    if (currentChat) {
      dispatch({
        type: "ADD_MESSAGE_TO_CHAT",
        payload: {
          chatId: currentChat.id,
          message: receivedMessage
        }
      });
    }

    setMessages(prev => [...prev, receivedMessage]);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages])

  // When Redux currentChat changes, update local messages
  useEffect(() => {
    if (currentChat) {
      // Find the updated chat from Redux state
      const updatedChat = message.chats.find(chat => chat.id === currentChat.id);
      if (updatedChat) {
        setMessages(updatedChat.messages || []);
      }
    } else {
      setMessages([]);
    }
  }, [message.chats, currentChat]);

  const otherUser = currentChat && auth.user
    ? auth.user.id === currentChat.users?.[0]?.id
      ? currentChat.users?.[1]
      : currentChat.users?.[0]
    : null;

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleClearImage = () => {
    setSelectedImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black hideScrollbar">
      <Grid container className="h-screen overflow-y-hidden w-full">

        {/* Left Sidebar - Chats List */}
        <Grid item xs={3} className="px-5 w-[20%] bg-gray-900 border-r border-gray-800">
          <div className='flex flex-col h-full'>
            {/* Header */}
            <div className='flex space-x-4 items-center py-5 cursor-pointer border-b border-gray-800' onClick={() => navigate('/')}>
              <WestIcon className="text-gray-400 hover:text-white transition" />
              <h1 className='text-xl font-bold text-white' >Messages</h1>
            </div>

            {/* Search */}
            <div className='py-4'>
              <SearchUser />
            </div>

            {/* Chats List */}
            <div className='h-full space-y-2 mt-2 overflow-y-auto hideScrollbar'>
              {message.chats.map((item, key) => (
                <div key={key} onClick={() => handleSelectChat(item)}>
                  <UserChatCard
                    chat={item}
                    onChatDeleted={handleChatDeleted}
                  />
                </div>
              ))}
            </div>
          </div>
        </Grid>

        {/* Right Side - Chat Area */}
        <Grid className="h-full w-[80%] bg-gradient-to-br from-gray-900 to-gray-950" item xs={9}>
          {currentChat ? (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className='flex justify-between items-center p-3 border-b border-gray-800 bg-gray-900/50'>
                <div className='flex items-center space-x-3'>
                  <Avatar
                    src={otherUser?.profileImage}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid #4F46E5'
                    }}
                  />
                  <div>
                    <p className='font-semibold text-white'>
                      {otherUser?.firstName} {otherUser?.lastName}
                    </p>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  {/* <IconButton className="bg-gray-800 hover:bg-gray-700">
                    <AddCallIcon className="text-gray-300" />
                  </IconButton>
                  <IconButton className="bg-gray-800 hover:bg-gray-700">
                    <VideocamIcon className="text-gray-300" />
                  </IconButton> */}
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className='flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/30 to-transparent'
              >
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <ChatBubbleOutlineIcon sx={{ fontSize: "4rem", opacity: 0.5 }} />
                    <p className="mt-4">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((item, key) => (
                    <div key={key} className={`flex ${item.user?.id === auth.user?.id ? 'justify-end' : 'justify-start'}`}>
                      <ChatMessage item={item} />
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Area */}
              <div className='sticky bottom-0 p-4 border-t border-gray-800 bg-gray-900/80'>
                {/* Image Preview */}
                {selectedImage && (
                  <div className="relative mb-3 inline-block">
                    <img
                      src={selectedImage}
                      className='w-20 h-20 object-cover rounded-lg border border-gray-700'
                      alt='Preview'
                    />
                    <button
                      onClick={handleClearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                )}

                <div className="py-0 flex justify-center items-center space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (messageText.trim() || selectedImage)) {
                          handleSendMessage();
                        }
                      }}
                      className='w-full bg-gray-800 text-white border border-gray-700 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400'
                      placeholder='Type a message...'
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSelectImage}
                      className='hidden'
                    />

                    {/* Image Button */}
                    <IconButton
                      onClick={handleImageButtonClick}
                      className="bg-gray-800 hover:bg-gray-700"
                    >
                      <AddPhotoAlternateIcon className="text-gray-300" />
                    </IconButton>

                    {/* Send Button */}
                    <IconButton
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!messageText.trim() && !selectedImage}
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='h-full space-y-5 flex flex-col justify-center items-center text-gray-400'>
              <ChatBubbleOutlineIcon sx={{ fontSize: "8rem", opacity: 0.3 }} />
              <p className='text-xl font-semibold'>No Chat Selected</p>
              <p className='text-sm'>Select a chat to start messaging</p>
            </div>
          )}
        </Grid>
      </Grid>

      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default Message