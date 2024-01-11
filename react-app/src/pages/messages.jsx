import { Helmet } from 'react-helmet-async';

import { Messages } from 'src/sections/chat/messages';

export default function MessagesPage() {
  return (
    <>
      <Helmet>
        <title> Chats | Minimal UI </title>
      </Helmet>

      <Messages />
    </>
  );
}
