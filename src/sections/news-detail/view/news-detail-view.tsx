

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {
  Box, Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl
} from '@mui/material';

import { useAuth } from 'src/api/auth';
import { useToast } from 'src/ToastContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { updateNews, getNewsDetail } from 'src/api/NewsService';

import { cleanObject } from 'src/sections/news-list/utils';

type NewsProps = {
  id?: number,
  title_translate?: string,
  content?: string,
  abstract?: string,
  translate?: string,
  main_classify?: string,
  keyword?: string,
  link?: string,
  pic_set?: string
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
    link: '',
    pic_set: ''
  })

  const selectSubjectOptions = [
    { value: '社会', label: '社会' },
    { value: '政治', label: '政治' },
    { value: '军事', label: '军事' },
    { value: '经济', label: '经济' },
  ]

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewsDetail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const movePic = async () => {
    const data = {
      pic_set: ''
    }
    const response = await updateNews({ id, data })
    if (response.err_code === 0) {
      showToast('删除成功！', 'success')
    } else {
      showToast(response.msg, 'error')
    }
  }

  const handleClick = async (name: string) => {
    const data = name === 'all' ?
      { ...cleanObject(newsDetail), ctype: 2 } :
      {
        [name]: newsDetail?.[name as keyof NewsProps]
      }
    const response = await updateNews({ id, data })
    if (response.err_code === 0) {
      if(name === 'all') {
        showToast('提交成功！', 'success')
        if (response?.share_link) {
          window.open(response?.share_link)
        }
      } else {
        showToast('修改成功！', 'success')
      }
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
          <Typography variant="h6" component="h6" gutterBottom align="left">
            原文链接：<a href={newsDetail?.link} target='_blank' rel="noreferrer">{newsDetail?.link}</a>
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
          <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="main_classify-label">主题</InputLabel>
              <Select
                labelId="main_classify-label"
                name="main_classify"
                value={newsDetail?.main_classify}
                label="主题"
                onChange={handleChange}
              >
                {selectSubjectOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => handleClick('main_classify')}
              size="small"
              sx={{
                height: '56px',
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
              rows={6}
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
              rows={10}
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
              rows={10}
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
          <Box>
            {
              newsDetail?.pic_set && <Button
                variant="contained"
                onClick={() => movePic()}
                size="small"
                sx={{
                  height: '56px',
                  width: 150,
                  my: 2
                }}
              >
                删除图片
              </Button>
            }
            {
              newsDetail?.pic_set && <img src={newsDetail?.pic_set} alt="预览图片" width={200} style={{ borderRadius: 8, border: "1px solid #ccc", display: 'block' }} />
            }
            {
              !newsDetail?.pic_set && <Typography variant="body1" component="h1" gutterBottom align="left">
                暂无图片
              </Typography>
            }
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

