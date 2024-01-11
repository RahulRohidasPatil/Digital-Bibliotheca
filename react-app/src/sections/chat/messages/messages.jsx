/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import Grid from '@mui/material/Grid';
import { useUser } from 'src/hooks/use-user';
import { useSocket } from 'src/hooks/use-socket';
import { useParams } from 'react-router-dom';
import { getById } from 'src/apis/user';
import { getBySenderRecipient } from 'src/apis/message';
import MessageItem from './messageItem';

const StyledGrid = styled(Grid)(() => ({
  '&::-webkit-scrollbar': {
    width: '5px',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    borderRadius: 10,
    width: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 10,
    width: '5px',
  },
}));

export default function Messages() {
  const [pastMessages, setPastMessages] = useState([]);

  const [messageContent, setMessageContent] = useState([]);

  const [chatId, setChatId] = useState('');

  const [targetName, setTargetName] = useState('');

  const { user } = useUser();

  const { socket } = useSocket();

  const params = useParams();

  const targetId = params.userId;

  const endOfMessagesRef = useRef();

  const getTargetName = async () => {
    const result = await getById(targetId);

    setTargetName(`${result.data.data.FirstName} ${result.data.data.FamilyName}`);
  };

  const initiateChatSync = async () => {
    await getTargetName();

    socket.emit('client_sync_request', { userId: user.Id, targetId });

    socket.on('client_sync_response', (data) => {
      setChatId(data.chatId);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [pastMessages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPastMessages = async () => {
    const result = await getBySenderRecipient(user.Id, targetId);
    setPastMessages((state) => [
      ...result.data.data.map((item) => ({ sender: item.SenderId, content: item.Content })),
    ]);
  };

  useEffect(() => {
    initiateChatSync();
    fetchPastMessages();
    socket.on('receive_message', (data) => {
      setPastMessages((state) => [...state, { sender: data.username, content: data.message }]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const sendMessage = async () => {
    if (messageContent == '') return;
    console.log('message');
    socket.emit('send_message', {
      message: messageContent,
      username: user.Id,
      room: chatId,
      target: targetId,
    });

    setMessageContent('');
  };

  return (
    <Container maxHeight="l" maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 2, ml: 5 }}>
        {targetName}
      </Typography>

      <Grid
        container
        sx={{
          display: 'block',
          width: '95%',

          pl: 3,
          height: '80%',
          maxHeight: '80%',
          minHeight: '80%',
        }}
      >
        <StyledGrid
          item
          xs={12}
          sm={12}
          sx={{
            mx: 3,
            py: 2,
            px: 2.5,
            borderRadius: 1.5,
            alignItems: 'center',
            maxHeight: '70%',
            overflowY: 'scroll',

            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Grid container spacing={4}>
            {pastMessages.map((item) => (
              <MessageItem
                key={JSON.stringify(item)}
                content={item.content}
                sender={item.sender === user.Id}
              />
            ))}
          </Grid>
          <div ref={endOfMessagesRef} />
        </StyledGrid>
        <Grid item xs={12} sm={12}>
          <TextField
            sx={{
              mx: 3,
              width: '96%',
            }}
            onChange={(e) => setMessageContent(e.target.value)}
            value={messageContent}
            placeholder="Write your message here..."
            multiline="true"
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ pr: 2, fontSize: '20px' }} position="end">
                  <IconButton onClick={() => sendMessage()} edge="end">
                    <Iconify icon="basil:send-outline" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

/* eslint-disable */