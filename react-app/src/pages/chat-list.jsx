import { Helmet } from 'react-helmet-async';

import { ChatList } from 'src/sections/chat/chatList';

export default function ChatListPage () {
    return (
      <>
        <Helmet>
          <title> Chats | Minimal UI </title>
        </Helmet>
  
        <ChatList />
      </>
    );
  }
