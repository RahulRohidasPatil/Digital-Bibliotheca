import { Helmet } from 'react-helmet-async';

import { Messages } from 'src/sections/chat/messages';

/* eslint-disable react/prop-types */
export default function MessagesPage({isDiscussion = false}) {
  return (
    <>
      <Helmet>
        <title> Chats | Minimal UI </title>
      </Helmet>

      <Messages isDiscussion = {isDiscussion} />
    </>
  );
}
