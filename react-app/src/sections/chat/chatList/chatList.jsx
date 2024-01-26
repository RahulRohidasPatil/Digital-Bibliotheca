import React, { useEffect, useState } from 'react';
import { getUserChats } from 'src/apis/chat';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useUser } from '../../../hooks/use-user';
import ChatItem from './chatItem';

export default function ChatList() {
  const { user } = useUser();

  const [userChats, setUserChats] = useState([]);
  const [userGroupChats, setUserGroupChats] = useState([]);

  useEffect(() => {
    /* 
        Peer Review By Monoraul - Implemented try and catch block 

        Here I have added try and catch block so that user does not stuck on the error page
        If there is any data it will load the data. 
        Else it will show a error message : Error loading user chats
      */

    const loadUserChats = async () => {
      try {
        const response = await getUserChats(user.Id);
        setUserChats(response.data.data.filter((item) => !item.IsGroupChat.data[0]));
        setUserGroupChats(response.data.data.filter((item) => item.IsGroupChat.data[0]));
      } catch (error) {
        // Handle the error (e.g., log it or show a user-friendly message)
        console.error('Error loading user chats:', error);
      }
    };

    loadUserChats();
  }, [user.Id]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Chats
      </Typography>
      {/* 
        Peer Review By Monoraul - Conditional rendering for userChats and userGroupChats
        If the userChats and userGroupChats array length is greater than 0 it will render the
        userChats and userGroupChats other wise It will render Below code
      */}
      {userChats.length > 0 &&
        userChats.map((item) => (
          <ChatItem
            key={item.ChatId}
            target={item.UserId}
            name={`${item.FirstName} ${item.FamilyName}`}
            isDiscussion={false}
          />
        ))}
      {userGroupChats.length > 0 &&
        userGroupChats.map((item) => (
          <ChatItem
            key={item.ChatId}
            target={item.MediaId}
            name={`${item.Title}`}
            isDiscussion={item.IsGroupChat.data[0]}
          />
        ))}
        {/* 
          Peer Review By Monoraul - No data found for userChats and userGroupChats
        */}
      {userChats.length === 0 && userGroupChats.length === 0 && (
        <Typography variant="body1" fontSize={20}>No chats available.</Typography>
      )}
    </Container>
  );
}
