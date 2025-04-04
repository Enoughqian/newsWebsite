

import COS from "cos-js-sdk-v5";
import { useDropzone } from "react-dropzone";
import { MdExpandMore } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";

import Card from '@mui/material/Card';
import { LoadingButton } from "@mui/lab";
import {
    Box,
    List, Chip, Select, Button, MenuItem, ListItem, Accordion, TextField, InputLabel, Typography, FormControl,
    ListItemText, Autocomplete,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";

import { useToast } from 'src/ToastContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { generateWord, getPubNewsList, TENCENT_BUCKET, TENCENT_SECRETID, TENCENT_SECRETKEY } from 'src/api/NewsService';

type FormDataProps = {
    topic: string[],
    refreshdate: string,
    title_translate_keyword: string,
    contain_keyword: string,
}

type NewsProps = { id: number, classify: string, title: string }

const initFormData = {
    topic: [],
    refreshdate: '',
    title_translate_keyword: '',
    contain_keyword: '',
}

const cos = new COS({
    SecretId: TENCENT_SECRETID,
    SecretKey: TENCENT_SECRETKEY
});

export function UploadCreateView() {
    // 表单状态
    const [formData, setFormData] = useState<FormDataProps>({ ...initFormData });
    const [filterData, setFilterData] = useState<any[]>([])
    const { showToast } = useToast();
    const [availableItems, setAvailableItems] = useState<{ [key: string]: NewsProps[] }>({});
    const [selectedItems, setSelectedItems] = useState<NewsProps[]>([]);
    const [wordtype, setWordtype] = useState('');
    const [piclink, setPiclink] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = useMemo(() => filterData.reduce((acc, item) => {
        const key = item.classify;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {}), [filterData])

    const selectSubjectOptions = [
        { value: '社会', label: '社会' },
        { value: '政治', label: '政治' },
        { value: '军事', label: '军事' },
        { value: '经济', label: '经济' },
    ]
    const templateOption = [
        { value: 'inner', label: '内网模版' },
        { value: 'outter', label: '外网模版' },
    ]

    // 处理输入变化
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 提交表单
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('表单提交数据:', formData);
        const { data } = await getPubNewsList({ ...formData })
        setFilterData([...data])
    };

    const moveToRight = (category: string, item: NewsProps) => {
        setAvailableItems((prev) => ({
            ...prev,
            [category]: prev[category].filter((i: NewsProps) => i.id !== item.id),
        }));
        setSelectedItems((prev) => [...prev, item]);
    };

    const moveToLeft = (item: NewsProps) => {
        // 找到该项属于哪个分类
        const category = Object.keys(filterData).find((key) =>
            categories[key].includes(item)
        );

        if (!category) return; // 万一找不到，直接返回

        setAvailableItems((prev) => ({
            ...prev,
            [category]: [...prev[category], item], // 把项加回原分类
        }));

        setSelectedItems((prev) => prev.filter((i: NewsProps) => i.id !== item.id)); // 从右侧移除
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedItems = Array.from(selectedItems);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);
        setSelectedItems(reorderedItems);
    };

    const onDrop = useCallback((acceptedFiles: any) => {
        console.log("上传的文件:", acceptedFiles);

        cos.putObject(
            {
                Bucket: TENCENT_BUCKET,
                Region: "ap-beijing", // 你的存储区域
                Key: `uploads/${acceptedFiles[0].name}`, // 存储路径
                Body: acceptedFiles[0],
            },
            (err, data) => {
                if (err) {
                    showToast(`上传失败：${err.message}`, 'error');
                } else {
                    const fileUrl = `https://${data.Location}`;
                    setPiclink(fileUrl);
                    showToast("上传成功！", 'success');
                }
            }
        );
    }, [showToast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"]
        },
        maxSize: 200 * 1024 * 1024 // 200MB
    });

    const handleWordSubmit = useCallback(async () => {
        if(!selectedItems.length) {
            showToast("请选择模版新闻", 'error')
            return
        }
        if(!wordtype) {
            showToast("请选择模版", 'error')
            return
        }
        if(wordtype === 'inner' && !piclink) {
            showToast("请上传图片", 'error')
            return
        }

        const body: {idlist:string[],wordtype:string, piclink?:string} = {
            idlist: selectedItems.map(item => item.id.toString()),
            wordtype
        }
        if( wordtype === 'inner') {
            body.piclink = piclink
        }
        setLoading(true)
        const response = await generateWord(body)
        if(response.err_code === 2) {
            showToast(response.msg, 'error')
        } else if(response?.link) {
            showToast(response.msg, 'success')
            window.open(response.link)
        }
        setLoading(false)

    },[piclink, selectedItems, showToast, wordtype])

    useEffect(() => {
        setAvailableItems({ ...categories })
    }, [categories, filterData])

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" flexGrow={1}>
                    上传生成页
                </Typography>
            </Box>

            <Card>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom align="left">
                        筛选条件
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
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
                                        <Chip 
                                            key={index}  // 将 key 直接传递给 Chip
                                            label={option.label} 
                                            {...getTagProps({ index })} 
                                        />
                                    ))
                                }
                                renderInput={(params: any) => <TextField {...params} label="选择主题(多选)" variant="outlined" fullWidth />}
                                clearOnEscape
                                disableCloseOnSelect
                                fullWidth
                            />
                            {/* 时间选择项 */}
                            <TextField
                                label="选择发布时间"
                                type="date"
                                name="refreshdate"
                                value={formData.refreshdate}
                                onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, refreshdate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Box>
                        {/* 关键词 & 相关文本 */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            <TextField label="中文标题包含内容" name="title_translate_keyword" value={formData.title_translate_keyword} onChange={handleChange} margin="normal" fullWidth />
                            <TextField label="关键词包含" name="contain_keyword" value={formData.contain_keyword} onChange={handleChange} margin="normal" fullWidth />
                        </Box>

                        {/* 提交按钮 */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                            <Button type="submit" variant="contained" size="large" sx={{ px: 5 }}>
                                确认筛选
                            </Button>
                        </Box>
                    </form>
                </Box>

                <Typography variant="h4" flexGrow={1} sx={{ m: 2 }}>
                    生成word 文件排序调整
                </Typography>
                <Box display="flex" gap={2} sx={{ p: 2, minHeight: 400 }} >
                    {/* 左侧可分类列表 */}
                    <Box sx={{ padding: 2, width: '100%', border: "1px solid #ccc", backgroundColor: "transparent" }}>
                        {Object.entries(availableItems).map(([category, items]) => (
                            <Accordion key={category}>
                                <AccordionSummary expandIcon={<MdExpandMore />}>
                                    <Typography variant="h6">{category}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ maxHeight: 200, overflowY: "auto" }}>
                                    {/* 设置最大高度，并且超出滚动 */}
                                    <List>
                                        {items.map((item) => (
                                            <ListItem key={item.id} button onClick={() => moveToRight(category, item)}>
                                                <ListItemText primary={item.title} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>

                    {/* 右侧可拖拽排序列表 */}
                    <Box sx={{ padding: 2, width: '100%', border: "1px solid #ccc", backgroundColor: "transparent" }}>
                        <Typography variant="h6" flexGrow={1}>
                            模版顺序
                        </Typography>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="selectedItems">
                                {(provided: any) => (
                                    <List {...provided.droppableProps} ref={provided.innerRef}>
                                        {selectedItems.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                {(draggableProvided) => (
                                                    <ListItem
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                        sx={{ display: "flex", alignItems: "center", cursor: "grab" }}
                                                        secondaryAction={
                                                            <Button size="small" onClick={() => moveToLeft(item)}>
                                                                移除
                                                            </Button>
                                                        }
                                                    >
                                                        <ListItemText primary={item.title} />
                                                    </ListItem>
                                                )}
                                            </Draggable>

                                        ))}
                                        {provided.placeholder}
                                    </List>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                </Box>

                <Typography variant="h4" flexGrow={1} sx={{ m: 2 }}>
                    模版选择
                </Typography>
                <Box sx={{ p: 2 }}>
                    <FormControl sx={{ width: 600 }}>
                        <InputLabel id="state-label">模版类型</InputLabel>
                        <Select
                            labelId="state-label"
                            name="state"
                            value={wordtype}
                            label="模版类型"
                            onChange={(e: any) => setWordtype(e.target.value)}
                        >
                            {templateOption.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box
                    {...getRootProps()}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        border: "2px dashed #ddd",
                        borderRadius: 2,
                        backgroundColor: "#f8f9fc",
                        cursor: "pointer",
                        "&:hover": { borderColor: "#007bff" },
                        m: 2,
                        width: 600
                    }}
                >
                    <input {...getInputProps()} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FaCloudUploadAlt size={32} />
                        <Box>
                            <Typography variant="body1" fontWeight="bold">
                                {isDragActive ? "释放文件上传" : "Drag and drop file here"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Limit 200MB per file • JPG, JPEG, PNG
                            </Typography>
                        </Box>
                    </Box>
                    <Button variant="outlined">Browse files</Button>
                </Box>
                {/* 上传成功后显示文件链接 */}
                {piclink && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>图片预览：</Typography>
                        <img src={piclink} alt="预览图片" width={200} style={{ borderRadius: 8, border: "1px solid #ccc" }} />
                    </Box>
                )}
                <LoadingButton loading={loading}  variant="contained" size="large" sx={{ m:2, width: 200 }} onClick={() => handleWordSubmit()}>
                    生成word
                </LoadingButton>
            </Card>


        </DashboardContent>
    )
}