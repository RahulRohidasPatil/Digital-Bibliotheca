import { Helmet } from 'react-helmet-async';

import { UploadContent } from 'src/sections/content';

// ----------------------------------------------------------------------

export default function Upload() {
  return (
    <>
      <Helmet>
        <title> Upload Media | Minimal UI </title>
      </Helmet>

      <UploadContent />
    </>
  );
}
