import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UploadCreateView } from 'src/sections/upload-create/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`上传生成 - ${CONFIG.appName}`}</title>
      </Helmet>

      <UploadCreateView />
    </>
  );
}
