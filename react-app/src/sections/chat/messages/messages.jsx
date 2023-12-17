/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField  from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Grid from '@mui/material/Grid'
import { useUser } from '../../../hooks/use-user';
import MessageItem from './messageItem';
import { useSocket } from 'src/hooks/use-socket';
import { useParams } from 'react-router-dom';
import { getById } from 'src/apis/user';
import { getBySenderRecipient } from 'src/apis/message';

export default function Messages() {
    const [pastMessages, setPastMessages] = useState([])

    const [messageContent, setMessageContent] = useState([])

    const [chatId, setChatId] = useState('')

    const [targetName, setTargetName] = useState('');

    const {user} = useUser();

    const {socket} = useSocket();

    const params = useParams();

    const targetId = params.userId;

    const endOfMessagesRef = useRef();

    const getTargetName = async () => {
        let result = await getById(targetId);

        setTargetName(result.data.data.FirstName + ' ' + result.data.data.FamilyName)
    }

    const initiateChatSync = async () => {
        await getTargetName();

        socket.emit('client_sync_request', {userId: user.Id, targetId});

        socket.on('client_sync_response', (data) =>{
            setChatId(data.chatId);
        })
    }

    useEffect(() => {
        scrollToBottom();
    }, [pastMessages])

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    const fetchPastMessages = async () => {
        let result = await getBySenderRecipient(user.Id, targetId);
        setPastMessages((state) => [...(result.data.data.map((item) =>  ({sender: item.SenderId, content: item.Content})))])
    }

    useEffect(() => {
        initiateChatSync()
        fetchPastMessages()
        socket.on('receive_message', (data) => {
            setPastMessages((state) => [...state, {sender: data.username, content: data.message}]);
        });

    }, [socket])

    const sendMessage = async () => {
        if(messageContent == '') return;
        console.log('message');
        socket.emit('send_message', {message: messageContent, username: user.Id, room: chatId, target: targetId})

        setMessageContent('')
    }

    return(
        <>            
        <Typography variant="h4" sx={{ mb: 5, ml: 20 }}>
                {targetName}
            </Typography>
            
                <Grid container spacing={4} sx={{
                    height: '40rem',
                    width: '80rem',
                    mx: 20,
                    maxHeight: '40rem',
                }}>
                    <Grid item xs={12} sm={12} sx={{
                        mx: 3,
                        py: 2,
                        px: 2.5,
                        position: 'relative',
                        borderRadius: 1.5,
                        alignItems: 'center',
                        maxHeight: '70%',
                        overflowY: 'scroll',
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                    }}>
                    <Grid  container spacing={4}>
                    {pastMessages.map((item) => (<MessageItem content={item.content} sender={item.sender == user.Id} />))}
                    </Grid>
                    <div ref={endOfMessagesRef} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                    <Container>
            <TextField onChange={(e) => setMessageContent(e.target.value)} value={messageContent} placeholder='Write your message here...' multiline='true' sx={{my: 1, mx: 3, position: 'relative', width: '90%'}}>

            </TextField>
            <IconButton sx={{my: 2, backgroundColor: 'lightgreen'}} onClick={sendMessage} edge="end">
                    <Iconify icon="bi:send" sx={{mt: 0.2}} />
                  </IconButton>
        </Container>
                    </Grid>
                </Grid>
                </>

    );
}

/* eslint-disable */