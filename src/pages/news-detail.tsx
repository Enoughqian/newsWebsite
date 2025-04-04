import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NewsDetailView } from 'src/sections/news-detail/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`新闻详情 - ${CONFIG.appName}`}</title>
      </Helmet>

      <NewsDetailView />
    </>
  );
}
