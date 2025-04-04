
import type { SetStateAction } from 'react';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import {
    Box, Chip, Table, Button, Select, TableRow,
    MenuItem,
    TableHead,
    TableCell,
    TableBody,
    TextField,
    InputLabel,
    FormControl,
    Autocomplete,
    TablePagination
} from '@mui/material';

import { useToast } from 'src/ToastContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { getRecNewsList, updateNewsList } from 'src/api/NewsService';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/sections/news-list/table-no-data';

type FormDataProps = {
    state: string,
    topic: string[],
    refreshdate: string,
    chinakeyword: string,
    keyword: string,
}

const initFormData = {
    state: '',
    topic: [],
    refreshdate: '',
    chinakeyword: '',
    keyword: '',
}

export function RecTitleView() {
    // 表单状态
    const [formData, setFormData] = useState<FormDataProps>({ ...initFormData });
    const [fetchPageData, setFetchPageData] = useState<FormDataProps>({ ...initFormData });
    const [tableData, setTableData] = useState<any[]>([])
    const [tableTotal, setTableTotal] = useState(0)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { showToast } = useToast();

    const selectStatusOptions = [
        { value: 'all', label: '全选' },
        { value: '有效', label: '有效' },
        { value: '无效', label: '无效' },
        { value: '待定', label: '待定' },
    ]

    const state2Number = (state: string) => ({
        '有效': 1,
        '无效': 0,
        '待定': -1
    })[state]

    const selectSubjectOptions = [
        { value: '社会', label: '社会' },
        { value: '政治', label: '政治' },
        { value: '军事', label: '军事' },
        { value: '经济', label: '经济' },
    ]

    const fetchNewsData = useCallback(async () => {
        try {
            setFetchPageData({ ...formData })
            const { data, total } = await getRecNewsList({ ...formData, num: rowsPerPage, page });
            setTableData([...data])
            setTableTotal(total)
        } catch (err) {
            console.log('获取新闻列表失败');
        }
    }, [formData, page, rowsPerPage]);

    // 处理分页变化
    const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // 处理输入变化
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 处理输入变化
    const handleTableTopicChange = (e: any, index: number) => {
        const { name, value } = e.target;
        const newTableData = [...tableData]
        newTableData[index][name] = value
        setTableData([...newTableData])
    };


    // 提交表单
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('表单提交数据:', formData);
        await fetchNewsData()
    };

    const handleTableSubmit = async () => {
        console.log('表格提交数据:', tableData);
        const body = {
            taskname: "recTitle",
            data: tableData.map(item => ({
                id: item.id,
                tag: state2Number(item.state),
                classify: [item.main_classify]
            }))
        }
        const response = await updateNewsList(body)
        if (response.err_code === 0) {
            showToast(`成功处理数量:${response.success_num}`, 'success')
            if (response.fail_num !== 0) {
                showToast(`失败处理数量:${response.fail_num}`, 'error')
            }
        } else {
            showToast(response.msg, 'error')
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, total } = await getRecNewsList({ ...initFormData, num: 10 });
            setTableData([...data])
            setTableTotal(total)
        };

        fetchData();
    }, []);

    // 分页变化时请求数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, total } = await getRecNewsList({ ...fetchPageData, num: rowsPerPage, page: page + 1 });
                setTableData([...data])
                setTableTotal(total)
            } catch (err) {
                console.log('获取新闻列表失败');
            }
        };

        fetchData();
    }, [fetchPageData, page, rowsPerPage]);

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" flexGrow={1}>
                    标题识别
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
                                renderInput={(params: any) => <TextField {...params} label="选择主题(多选)" variant="outlined" fullWidth />}
                                clearOnEscape
                                disableCloseOnSelect
                                fullWidth
                            />
                        </Box>
                        {/* 关键词 & 相关文本 */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            <TextField label="中文标题关键词(输入关键词)" name="chinakeyword" value={formData.chinakeyword} onChange={handleChange} margin="normal" fullWidth />
                            <TextField label="英文标题关键词(输入关键词)" name="keyword" value={formData.keyword} onChange={handleChange} margin="normal" fullWidth />
                        </Box>

                        {/* 时间选择项 */}
                        <TextField
                            label="选择更新时间"
                            type="date"
                            name="refreshdate"
                            value={formData.refreshdate}
                            onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, refreshdate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            sx={{ width: 400 }}
                        />

                        {/* 提交按钮 */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                            <Button type="submit" variant="contained" size="large" sx={{ px: 5 }}>
                                确认筛选
                            </Button>
                        </Box>
                    </form>
                </Box>

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset', mt: 2, p: 2 }}>
                        <Button onClick={() => handleTableSubmit()} variant="contained" size="large" sx={{ my: 2 }}>
                            提交
                        </Button>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>序号</TableCell>
                                    <TableCell>标题</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>状态</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>主题</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData
                                    .map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography>{row.title}</Typography>
                                                    <Typography>{row.title_translate}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ width: 150 }}>
                                                <Select
                                                    name="state"
                                                    value={row.state}
                                                    onChange={(e: any) => handleTableTopicChange(e, index)}
                                                    fullWidth
                                                    key={index}
                                                    size='small'
                                                >
                                                    {selectStatusOptions.filter(option => option.value !== 'all').map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell sx={{ width: 150 }}>
                                                <Select
                                                    name="main_classify"
                                                    value={row.main_classify}
                                                    onChange={(e: any) => handleTableTopicChange(e, index)}
                                                    fullWidth
                                                    key={index}
                                                    size='small'
                                                >
                                                    {selectSubjectOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {!tableData.length && <TableNoData />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                {/* 分页控件 */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={tableTotal ?? 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </DashboardContent>
    )
}