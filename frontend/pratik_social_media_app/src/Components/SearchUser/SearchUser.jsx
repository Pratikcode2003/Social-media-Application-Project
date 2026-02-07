import { Avatar, Card, CardHeader } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../../Redux/Auth/auth.action';
import { createChat } from '../../Redux/Message/Message.action';

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const { message, auth } = useSelector(store => store)

  const dispatch = useDispatch();

  const handleClick = (id) => {
    // Don't create chat with yourself
    if (id === auth.user.id) {
      setUsername("");
      return;
    }

    // Check if chat already exists with this user
    const existingChat = message.chats.find(chat =>
      chat.users.some(user => user.id === id)
    );

    if (existingChat) {
      // Dispatch action to set existing chat as current
      dispatch({ type: "SET_CURRENT_CHAT", payload: existingChat });
    } else {
      // Create new chat
      dispatch(createChat({ userId: id }));
    }
    setUsername("")
  };

  const handleSeachUser = (e) => {
    setUsername(e.target.value)
    dispatch(searchUser(e.target.value))
  }

  // Filter out current user from search results
  const filteredUsers = auth.searchUser?.filter(user => user.id !== auth.user.id) || [];

  return (
    <div >
      <div className='py-5 relative'>
        <input type="text"
          className='bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full '
          placeholder='Search user...'
          onChange={handleSeachUser}
          value={username} />
      </div>
      {
        username && (
          filteredUsers.map((item, key) => <Card
            key={key}
            sx={{
              mb: 1,
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              },
            }}
          >
            <CardHeader
              onClick={() => handleClick(item.id)}
              avatar={<Avatar src={item.profileImage} />}
              title={item.firstName + " " + item.lastName}
              subheader={`${item.firstName.toLowerCase()}_${item.lastName.toLowerCase()}`}
            />
          </Card>
          )
        )
      }
    </div>
  )
}

export default SearchUser