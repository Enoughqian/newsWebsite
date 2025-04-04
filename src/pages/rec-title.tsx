import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RecTitleView } from 'src/sections/rec-title/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`标题识别 - ${CONFIG.appName}`}</title>
      </Helmet>

      <RecTitleView />
    </>
  );
}
