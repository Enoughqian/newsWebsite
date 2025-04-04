import { MdOutlineSubtitles } from "react-icons/md";
import { FaList , FaChartLine, FaCloudUploadAlt } from "react-icons/fa";


// ----------------------------------------------------------------------

export const navData = [
  {
    title: '统计信息',
    path: '/',
    icon: <FaChartLine size={24}/>,
  },
  {
    title: '新闻列表',
    path: '/news-list',
    icon: <FaList size={24}/>,
  },
  {
    title: '标题识别',
    path: '/rec-title',
    icon: <MdOutlineSubtitles size={24}/>,
  },
  {
    title: '上传生成页',
    path: '/upload-create',
    icon: <FaCloudUploadAlt size={24}/>,
  },
];
