
import { useState, useEffect,useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {
  Box,
  Chip,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Autocomplete
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { getNewsList, getCountries } from 'src/api/NewsService';

import { Scrollbar } from 'src/components/scrollbar';

import { NewsTableRow } from '../table-row';
import { NewsTableHead } from '../table-head';
import { getToday, emptyRows } from '../utils';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';


// ----------------------------------------------------------------------

type FormDataProps = {
  state: string,
  country: string[],
  topic: string[],
  publishstartdate: string,
  publishenddate: string,
  refreshstartdate: string,
  refreshenddate: string,
  title_keyword: string,
  title_translate_keyword: string,
  content_keyword: string,
  content_translate_keyword: string,
  contain_keyword: string,
}

const initFormData = {
  state: '已生成未处理',
  country: [],
  topic: [],
  publishstartdate: '',
  publishenddate: '',
  refreshstartdate: '',
  refreshenddate: '',
  title_keyword: '',
  title_translate_keyword: '',
  content_keyword: '',
  content_translate_keyword: '',
  contain_keyword: '',
}

export function NewsListView() {
  const table = useTable();
  // 表单状态
  const [formData, setFormData] = useState<FormDataProps>({...initFormData});
  const [fetchPageData, setFetchPageData] = useState<FormDataProps>({...initFormData});
  const [countryOptions, setCountryOptions] = useState<{label:string, value:string}[]>([]);
  const [tableData, setTableData] = useState<any[]>([])
  const [tableTotal, setTableTotal] = useState(0)

  const selectStatusOptions = [
    { value: 'all', label: '全选' },
    { value: '已生成未处理', label: '已生成未处理' },
    { value: '已抓取未生成', label: '已抓取未生成' },
    { value: '运营已处理', label: '运营已处理' },    
    { value: '已推送正式库', label: '已推送正式库' },    
  ]

  const selectSubjectOptions = [
    { value: '社会', label: '社会' },
    { value: '政治', label: '政治' },
    { value: '军事', label: '军事' },
    { value: '经济', label: '经济' },
  ]

  // 处理输入变化
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchNewsData = useCallback(async () => {
    try {
      setFetchPageData({...formData})
      const {data, total} = await getNewsList({...formData, num: table.rowsPerPage, page: table.page});
      setTableData([...data])
      setTableTotal(total)
    } catch (err) {
      console.log('获取新闻列表失败');
    }
  }, [formData, table.page, table.rowsPerPage]);

  // 提交表单
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log('表单提交数据:', formData);
    await fetchNewsData()
  };

  useEffect(() => {
    const fetchData = async () => {
      const counties = await getCountries();
      setCountryOptions(counties.map((country:string) => ({
        label: country,
        value: country
      })));

      const {data, total} = await getNewsList({...initFormData, num: 10 });
      setTableData([...data])
      setTableTotal(total)
    };

    fetchData();
  }, []);

  // 分页变化时请求数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, total} = await getNewsList({...fetchPageData, num: table.rowsPerPage, page: table.page + 1});
        setTableData([...data])
        setTableTotal(total)
      } catch (err) {
        console.log('获取新闻列表失败');
      }
    };

    fetchData();
  }, [fetchPageData, table.page, table.rowsPerPage]);



  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          新闻列表
        </Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom align="left">
            筛选条件
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* 单选：选择状态 */}
              <FormControl fullWidth>
                <InputLabel id="state-label">选择状态 (单选)</InputLabel>
                <Select
                  labelId="state-label"
                  name="state"
                  value={formData.state}
                  label="选择状态 (单选)"
                  onChange={handleChange}
                >
                  {selectStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* 多选项：国家 & 主题 */}
              <Autocomplete
                multiple
                options={countryOptions}
                getOptionLabel={(option: { label: any; }) => option.label}
                value={countryOptions.filter(option => formData.country.includes(option.value))}
                onChange={(_: any, newValue: any[]) => {
                  setFormData({ ...formData, country: newValue.map(option => option.value) });
                }}
                renderTags={(value: any[], getTagProps: (arg0: { index: any; }) => any) =>
                  value.map((option, index) => (
                    <Chip label={option.label} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params: any) => <TextField {...params} label="选择国家(可多选)" variant="outlined" fullWidth />}
                clearOnEscape
                disableCloseOnSelect
                fullWidth
              />

              <Autocomplete
                multiple
                options={selectSubjectOptions}
                getOptionLabel={(option: { label: any; }) => option.label}
                value={selectSubjectOptions.filter(option => formData.topic.includes(option.value))}
                onChange={(_: any, newValue: any[]) => {
                  setFormData({ ...formData, topic: newValue.map(option => option.value) });
                }}
                renderTags={(value: any[], getTagProps: (arg0: { index: any; }) => any) =>
                  value.map((option, index) => (
                    <Chip label={option.label} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params: any) => <TextField {...params} label="选择主题(可多选)" variant="outlined" fullWidth />}
                clearOnEscape
                disableCloseOnSelect
                fullWidth
              />
            </Box>

            {/* 时间选择项 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="发布时间开始"
                type="date"
                name="publishstartdate"
                value={formData.publishstartdate}
                onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, publishstartdate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                fullWidth
              />

              <TextField
                label="发布时间结束"
                type="date"
                name="publishenddate"
                value={formData.publishenddate}
                onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, publishenddate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="更新时间开始"
                type="date"
                name="refreshstartdate"
                value={formData.refreshstartdate}
                onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, refreshstartdate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                fullWidth
              />

              <TextField
                label="更新时间结束"
                type="date"
                name="refreshenddate"
                value={formData.refreshenddate}
                onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, refreshenddate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                fullWidth
              />
            </Box>
      
            {/* 关键词 & 相关文本 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <TextField label="标题包含" name="title_keyword" value={formData.title_keyword} onChange={handleChange} margin="normal" fullWidth />
              <TextField label="标题翻译包含" name="title_translate_keyword" value={formData.title_translate_keyword} onChange={handleChange} margin="normal" fullWidth />
              <TextField label="原文包含" name="content_keyword" value={formData.content_keyword} onChange={handleChange} fullWidth />
              <TextField label="原文翻译包含" name="content_translate_keyword" value={formData.content_translate_keyword} onChange={handleChange} fullWidth />
              <TextField label="关键词包含" name="contain_keyword" value={formData.contain_keyword} onChange={handleChange}  fullWidth />
            </Box>

            {/* 提交按钮 */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
              <Button type="submit" variant="contained" size="large" sx={{ px: 5 }}>
                确认筛选
              </Button>
            </Box>
          </form>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset', mt: 4 }}>
            <Table sx={{ minWidth: 800 }}>
              <NewsTableHead
                headLabel={[
                  { id: "id", label: '序号', minWidth: 100},
                  { id: 'title', label: '标题' },
                  { id: 'country', label: '国家',  minWidth: 100},
                  { id: 'state', label: '状态', minWidth: 150 },
                  { id: 'title_translate', label: '标题翻译' },
                  { id: 'action', label: "操作",  align: 'right',minWidth: 150}
                ]}
              />
              <TableBody>
                {tableData
                  .map((row) => (
                    <NewsTableRow
                      key={row.id}
                      row={row}
                    />
                  ))}
                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.rowsPerPage, tableData.length)}
                />
                {!tableData.length && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={tableTotal}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    rowsPerPage,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
