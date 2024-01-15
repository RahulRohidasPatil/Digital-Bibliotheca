import React, {  useEffect, useState } from 'react';
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
        const loadUserChats = async () => {
            const response = await getUserChats(user.Id)
            setUserChats(response.data.data.filter((item) => !item.IsGroupChat.data[0]));
            setUserGroupChats(response.data.data.filter((item) => item.IsGroupChat.data[0]));
        };

        loadUserChats()
    }, [user.Id]);


  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Chats
      </Typography>
      {userChats.map((item) => (
        <ChatItem
          key={item.ChatId}
          target={item.UserId}
          name={`${item.FirstName} ${item.FamilyName}`}
          isDiscussion = {false}
        />
      ))}
      {userGroupChats.map((item) => (
        <ChatItem
        key={item.ChatId}
        target={item.MediaId}
        name={`${item.Title}`}
        isDiscussion = {item.IsGroupChat.data[0]}
        />
      ))}
    </Container>
  );
}
