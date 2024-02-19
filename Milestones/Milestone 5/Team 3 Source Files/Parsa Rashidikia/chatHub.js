require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const messageService = require("../services/message/message")
const chatService = require("../services/chat/chat")

const chatHub = {
    initiateHub: (app) => {
        const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  console.log(`User connected ${socket.id}`);


  socket.on('client_sync_request', async (data) => {
    const {userId, targetId, isDiscussion} = data;
    let chatId = '';
    if(isDiscussion){
        if(await chatService.discussionExists(targetId, isDiscussion)){
          chatId = await chatService.getDiscussionByMediaId(targetId, isDiscussion);
        }
        else{
          await chatService.create(userId, targetId, isDiscussion);

          chatId = await chatService.getBySenderRecipient(userId, targetId, isDiscussion);
        }
    }
    else{
      if (await chatService.exists(userId, targetId, isDiscussion))
        {
          chatId = await chatService.getBySenderRecipient(userId, targetId, isDiscussion);
        }
      else{
        await chatService.create(userId, targetId, isDiscussion);

        chatId = await chatService.getBySenderRecipient(userId, targetId, isDiscussion);
      }
    }
    socket.join(chatId)
    socket.emit('client_sync_response', {chatId: chatId})
  })

  socket.on('send_message', async (data) => {
    const { message, username, room,target } = data;
    await messageService.create(room, username, message);
    socket.emit('receive_message', data); 
    socket.to(room).emit('receive_message', data); 
  });

 
});

server.listen(4000, () => 'Server is running on port 4000');
    }
}

module.exports = chatHub;