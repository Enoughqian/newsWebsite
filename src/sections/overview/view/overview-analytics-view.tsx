/* eslint-disable import/no-duplicates */
import { IoAppsSharp } from "react-icons/io5";
import { useMemo, useState, useEffect } from "react";
import { MdArticle, MdCurrencyYen } from "react-icons/md";

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getNewsStatic } from "src/api/NewsService";
import { DashboardContent } from 'src/layouts/dashboard';

import { getToday } from "src/sections/news-list/utils";

import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

type StaticProps = {
  spider_news_num: number,
  cost: number,
  spider_platform_num: number,
  datestr: string
}

export function OverviewAnalyticsView() {
  const [data, setData] = useState<StaticProps[]>([])
  const [sum, SetSum] = useState<StaticProps>({
    spider_platform_num: 23,
    spider_news_num: 2141,
    cost: 0,
    datestr: ''
  })

  const todayData = useMemo(() => {
    const today = getToday()
    return data.find((item: any) => item.datestr === today)
  }, [data])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNewsStatic()
      setData(response?.date_info)
      SetSum(response?.sum_info)
    }
    fetchData()
  }, [])
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        欢迎回来 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={4} sm={4} md={4}>
          <AnalyticsWidgetSummary
            title="今日新闻数量"
            total={todayData?.spider_news_num ?? 0}
            icon={<MdArticle fontSize='large' />}
          />
        </Grid>

        <Grid xs={4} sm={4} md={4}>
          <AnalyticsWidgetSummary
            title="今日费用"
            total={todayData?.cost ?? 0}
            color="secondary"
            icon={<MdCurrencyYen fontSize='large' />}
          />
        </Grid>

        <Grid xs={4} sm={4} md={4}>
          <AnalyticsWidgetSummary
            title="接入平台数量"
            total={todayData?.spider_platform_num ?? 0}
            color="warning"
            icon={<IoAppsSharp fontSize='large' />}
          />
        </Grid>

        <Grid xs={4} sm={4} md={4}>
          <AnalyticsWidgetSummary
            title="总新闻数量"
            total={sum?.spider_news_num ?? 0}
            icon={<MdArticle fontSize='large' />}
          />
        </Grid>

        <Grid xs={4} sm={4} md={4}>
          <AnalyticsWidgetSummary
            title="总费用"
            total={sum?.cost ?? 0}
            color="secondary"
            icon={<MdCurrencyYen fontSize='large' />}
          />
        </Grid>

        <Grid xs={12} md={24} lg={12}>
          <AnalyticsWebsiteVisits
            title="费用柱状图"
            subheader=""
            chart={{
              categories: data.map(item => item.datestr) ?? [],
              series: [
                { name: '费用', data: data.map(item => item.cost) ?? [] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={24} lg={12}>
          <AnalyticsWebsiteVisits
            title="新闻数量柱状图"
            subheader=""
            chart={{
              categories: data.map(item => item.datestr) ?? [],
              series: [
                { name: '新闻数量', data: data.map(item => item.spider_news_num) ?? [] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
