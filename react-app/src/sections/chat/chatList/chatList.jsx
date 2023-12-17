import React, { useCallback, useEffect, useState } from 'react';
import { getUserChats } from 'src/apis/chat';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useUser } from '../../../hooks/use-user';
import ChatItem from './chatItem';

export default function ChatList() {
  const { user } = useUser();

  const [userChats, setUserChats] = useState([]);

  const loadUserChats = useCallback(async () => {
    const response = await getUserChats(user.Id);
    setUserChats(response.data.data);
  }, [user.Id]);

  useEffect(() => {
    loadUserChats();
  }, [loadUserChats]);

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
        />
      ))}
    </Container>
  );
}
