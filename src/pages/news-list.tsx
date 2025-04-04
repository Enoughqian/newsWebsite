import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NewsListView } from 'src/sections/news-list/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`新闻列表 - ${CONFIG.appName}`}</title>
      </Helmet>

      <NewsListView />
    </>
  );
}
