import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`统计信息 - ${CONFIG.appName}`}</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
