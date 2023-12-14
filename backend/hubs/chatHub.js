require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
//const leaveRoom = require('./utils/leave-room'); // Add this
const messageService = require("../services/message/message")
const chatService = require("../services/chat/chat")

const chatHub = {
    initiateHub: (app) => {
        const server = http.createServer(app); // Add this

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

// Listen for when the client connects via socket.io-client
io.on('connection', async (socket) => {
  console.log(`User connected ${socket.id}`);

//   socket.on('user_available', (data) => {
//     const {username} = data
//     console.log('user available'+username)
//     availableUsers.push(username)

//     socket.emit('new_user_available',{
//       users: availableUsers
//     })
//   })

//   socket.on('get_users', (data) => {
//     socket.emit('new_user_available', {
//       users: availableUsers
//     })
//   })

//   socket.on('sync', async (data)=>{
//     const {sender, recipient} = data;

//     if(sender && recipient){
//       let chatId = await chatService.getBySenderRecipient(sender, recipient);

//       chatRoomUsers = [sender, recipient]
  
//       console.log('syncing chat: '+ chatId+ 'sender '+ sender+ 'rec '+ recipient)
  
//       socket.join(chatId)
  
  
//       socket.to(chatId).emit('chatroom_users', {chatRoomUsers: chatRoomUsers, chatId: chatId});
//     }

   
//   })

  socket.on('join_chat', async (data) => {
    const {sender, recipient} = data;
    let chatId = '';

    if (await chatService.exists(sender, recipient))
      {
        chatId = await chatService.getBySenderRecipient(sender, recipient);
      }
    else{
      await chatService.create(sender, recipient);

      chatId = await chatService.getBySenderRecipient(sender, recipient);
    }

    socket.join(chatId)

    chatRoomUsers = [sender, recipient]

    socket.to(chatId).emit('chatroom_users', {chatRoomUsers: chatRoomUsers, chatId: chatId});
  })
  
  // Add a user to a room
//   socket.on('join_room', (data) => {
//     const { username, room, recipient } = data; // Data sent from client when join_room event emitted

//     socket.join(room); // Join the user to a socket room

//     let __createdtime__ = Date.now(); // Current timestamp
//     // Send message to all users currently in the room, apart from the user that just joined
//     socket.to(room).emit('receive_message', {
//       message: `${username} has joined the chat room`,
//       username: CHAT_BOT,
//       __createdtime__,
//     });
//     // Send welcome msg to user that just joined chat only
//     socket.emit('receive_message', {
//       message: `Welcome ${username}`,
//       username: CHAT_BOT,
//       __createdtime__,
//     });
//     // Save the new user to the room
//     chatRoom = room;
//     allUsers.push({ id: socket.id, username, room });
//     chatRoomUsers = allUsers.filter((user) => user.room === room);
//     socket.to(room).emit('chatroom_users', chatRoomUsers);
//     socket.emit('chatroom_users', chatRoomUsers);

//     // Get last 100 messages sent in the chat room
//     // messageService.getByChatId(room)
//     //   .then((last100Messages) => {
//     //     // console.log('latest messages', last100Messages);
//     //     socket.emit('last_100_messages', last100Messages);
//     //   })
//     //   .catch((err) => console.log(err));
//   });

  socket.on('send_message', async (data) => {
    const { message, username, room, __createdtime__,target } = data;
    
    let chatId = await chatService.getBySenderRecipient(username, target);

    data.room = chatId

    await messageService.create(chatId, username, target);

    io.in(chatId).emit('receive_message', data); // Send to all users in room, including sender
    // messageService.create(room, username, message) // Save message in db
    //   .then((response) => console.log(response))
    //   .catch((err) => console.log(err));
  });

//   socket.on('leave_room', (data) => {
//     const { username, room } = data;
//     socket.leave(room);
//     const __createdtime__ = Date.now();
//     // Remove user from memory
//     allUsers = leaveRoom(socket.id, allUsers);
//     socket.to(room).emit('chatroom_users', allUsers);
//     socket.to(room).emit('receive_message', {
//       username: CHAT_BOT,
//       message: `${username} has left the chat`,
//       __createdtime__,
//     });
//     console.log(`${username} has left the chat`);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected from the chat');
//     const user = allUsers.find((user) => user.id == socket.id);
//     if (user?.username) {
//       allUsers = leaveRoom(socket.id, allUsers);
//       socket.to(chatRoom).emit('chatroom_users', allUsers);
//       socket.emit('new_user_available',{
//         users: allUsers.filter((user) => user.id == socket.id)
//       })
//       socket.to(chatRoom).emit('receive_message', {
//         message: `${user.username} has disconnected from the chat.`,
//       });
//     }
//   });
});

server.listen(4000, () => 'Server is running on port 4000');
    }
}

module.exports = chatHub;