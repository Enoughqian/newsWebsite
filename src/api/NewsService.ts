// src/api/countryService.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

import { cleanObject } from 'src/sections/news-list/utils';

// const API_URL = 'http://152.32.218.226:9999/news_server/api';
export const TENCENT_SECRETID = 'AKID381WyEI8nGdvCOSL1TildIk03sVxEJF7';
export const TENCENT_SECRETKEY = 'xoXFpYG1HNGxUswoUwDKG9sOuFNJ1Ys1';
export const TENCENT_BUCKET = 'download-word-1258484232';
export const ENV = 'release';

export const getCountries = async () => {
  try {
    const response = await axios.get('/api/getCountry');
    return response.data.data; // 直接返回国家列表数组
  } catch (error) {
    console.error('获取国家列表失败:', error);
    return []; // 返回空数组作为fallback
  }
};

export const getNewsList = async (body: any) => {
  try {
    const response = await axios.post(
      '/api/filterList',
      {
        ...cleanObject(body),
        state: body.state === 'all' ? '' : body.state,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return {
      data: response.data.data,
      total: response.data.total_num,
    };
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    return {
      data: [],
      total: 0,
    };
  }
};

export const getNewsDetail = async (id: string) => {
  try {
    const response = await axios.get(`/api/getSingleInfo?unique_id=${id}`);
    return response.data.info;
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    return {};
  }
};

export const updateNews = async (body: any) => {
  try {
    const response = await axios.post('/api/setSingleInfo', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('更新新闻详情失败:', error);
    return { err_code: 2, msg: '服务出错，请重试！' };
  }
};

export const login = async (body: any) => {
  try {
    const response = await axios.post('/api/Login', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('登陆失败:', error);
    return { result: { state: 'Faild', permission: '' }, err_code: 0, msg: '服务出错，请重试！' };
  }
};

export const getRecNewsList = async (body: any) => {
  try {
    const response = await axios.post(
      '/api/filterTask',
      {
        ...cleanObject(body),
        state: body.state === 'all' ? '' : body.state,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return {
      data: response.data.data,
      total: response.data.total_num,
    };
  } catch (error) {
    console.error('获取识别新闻列表失败:', error);
    return {
      data: [],
      total: 0,
    };
  }
};

export const updateNewsList = async (body: any) => {
  try {
    const response = await axios.post('/api/recallTask', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('更新新闻列表失败:', error);
    return { err_code: 2, msg: '服务出错，请重试！' };
  }
};

export const getPubNewsList = async (body: any) => {
  try {
    const response = await axios.post(
      '/api/filterUpload',
      {
        ...cleanObject(body),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return {
      data: response.data.data,
    };
  } catch (error) {
    console.error('获取正式新闻列表失败:', error);
    return {
      data: [],
    };
  }
};

export const generateWord = async (body: any) => {
  try {
    const response = await axios.post('/api/genWordFile', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('生成word失败:', error);
    return { err_code: 2, msg: '服务出错，请重试！' };
  }
};

export const getNewsNumber = async () => {
  try {
    const response = await axios.get('/api/getCountData?ctype=2');
    return response.data;
  } catch (error) {
    console.error('获取今日传入正式库的数量失败:', error);
    return { data: [{ format_news_num: 5 }],  err_code: 2, msg: '服务出错，请重试！' };
  }
};

export const getNewsStatic = async () => {
  try {
    const response = await axios.get('/api/getCountData?ctype=1');
    return response.data;
  } catch (error) {
    console.error('获取新闻统计数据失败:', error);
    return { data: [],  err_code: 2, msg: '服务出错，请重试！' };
  }
};
