// src/api/countryService.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

import { cleanObject } from 'src/sections/news-list/utils';

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = '/api';

export const getCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/getCountry`);
    return response.data.data; // 直接返回国家列表数组
  } catch (error) {
    console.error('获取国家列表失败:', error);
    return []; // 返回空数组作为fallback
  }
};

export const getNewsList = async (body: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/filterList`,
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
    const response = await axios.get(`${API_URL}/getSingleInfo?unique_id=${id}`);
    return response.data.info;
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    return {};
  }
};

export const updateNews = async (body: any) => {
  try {
    const response = await axios.post(`${API_URL}/setSingleInfo`, body, {
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
    const response = await axios.post(`${API_URL}/Login`, body, {
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
      `${API_URL}/filterTask`,
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
    const response = await axios.post(`${API_URL}/recallTask`, body, {
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
      `${API_URL}/filterUpload`,
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
    const response = await axios.post(`${API_URL}/genWordFile`, body, {
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
    const response = await axios.get(`${API_URL}/getCountData?ctype=2`);
    return response.data;
  } catch (error) {
    console.error('获取今日传入正式库的数量失败:', error);
    return { data: [{ format_news_num: 5 }],  err_code: 2, msg: '服务出错，请重试！' };
  }
};

export const getNewsStatic = async () => {
  try {
    const response = await axios.get(`${API_URL}/getCountData?ctype=1`);
    return response.data;
  } catch (error) {
    console.error('获取新闻统计数据失败:', error);
    return { data: [],  err_code: 2, msg: '服务出错，请重试！' };
  }
};
