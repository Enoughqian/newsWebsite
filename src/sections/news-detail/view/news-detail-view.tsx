

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, Button, TextField } from '@mui/material';

import { useToast } from 'src/ToastContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { updateNews, getNewsDetail } from 'src/api/NewsService';

import { cleanObject } from 'src/sections/news-list/utils';
import { useAuth } from 'src/api/auth';

type NewsProps = {
  id?: number,
  title_translate?: string,
  content?: string,
  abstract?: string,
  translate?: string,
  main_classify?: string,
  keyword?: string,
}

export function NewsDetailView() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { user } = useAuth()
  const [newsDetail, setNewsDetail] = useState<NewsProps>({
    id: 0,
    title_translate: '',
    content: '',
    abstract: '',
    translate: '',
    main_classify: '',
    keyword: '',
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewsDetail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClick = async (name: string) => {
    const data = name === 'all' ?
      { ...cleanObject(newsDetail) } :
      {
        [name]: newsDetail?.[name as keyof NewsProps]
      }
    const response = await updateNews({ id, data })
    if (response.err_code === 0) {
      showToast('修改成功！', 'success')
    } else {
      showToast(response.msg, 'error')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNewsDetail(id!);
      setNewsDetail({
        ...data
      })
    };

    if (id) {
      fetchData();
    }

  }, [id])
  // abstract translate keyword title_translate content main_classify

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          新闻详情
        </Typography>
      </Box>
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom align="left">
            新闻详情编辑
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="keyword"
              label="关键词"
              variant="outlined"
              value={newsDetail?.keyword}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => handleClick('keyword')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交关键词
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name='main_classify'
              label="主题"
              variant="outlined"
              value={newsDetail?.main_classify}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => handleClick('main_classify')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交主题
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name='title_translate'
              label="标题翻译"
              variant="outlined"
              value={newsDetail?.title_translate}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => handleClick('title_translate')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交标题翻译
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name='abstract'
              label="摘要"
              multiline
              rows={4}
              variant="outlined"
              value={newsDetail?.abstract}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => handleClick('abstract')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交摘要
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name='content'
              label="原文"
              multiline
              rows={6}
              variant="outlined"
              value={newsDetail?.content}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => handleClick('content')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交原文
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name='translate'
              label="正文翻译"
              multiline
              rows={6}
              variant="outlined"
              value={newsDetail?.translate}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => handleClick('translate')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交正文翻译
            </Button>
          </Box>
          {
            user.role === 'ADMIN' && <Button
              variant="contained"
              onClick={() => handleClick('all')}
              size="small"
              sx={{
                height: '56px',
                mt: '16px',
                width: 150
              }}
            >
              提交正式库
            </Button>
          }
        </Box>
      </Card>
    </DashboardContent>
  );
}

