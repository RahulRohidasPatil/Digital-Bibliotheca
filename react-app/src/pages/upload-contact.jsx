import { Helmet } from 'react-helmet-async';

import { UploadContact } from 'src/sections/contact';

// ----------------------------------------------------------------------

export default function Upload() {
  return (
    <>
      <Helmet>
        <title> Upload Contact | Minimal UI </title>
      </Helmet>

      <UploadContact />
    </>
  );
}
