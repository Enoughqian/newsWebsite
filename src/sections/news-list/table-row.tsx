
// eslint-disable-next-line import/no-extraneous-dependencies

import { Typography } from "@mui/material";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useToast } from "src/ToastContext";
import { updateNews } from "src/api/NewsService";

// ----------------------------------------------------------------------

export type RowProps = {
  id: number;
  title: string;
  country: string;
  state: string;
  title_translate: string;
};

type TableRowProps = {
  row: RowProps;
};

export function NewsTableRow({ row }: TableRowProps) {
  const { showToast } = useToast();

  const handleClick = async (id: number) => {
    const data = {
      id,
      ctype: 1
    }
    const response = await updateNews(data)
    if (response.err_code === 0) {
      showToast('提交成功！', 'success')
    } else {
      showToast(response.msg, 'error')
    }
  }

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell sx={{ minWidth: 100 }}>{row.id}</TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell sx={{ minWidth: 100 }}>{row.country}</TableCell>
      <TableCell sx={{ minWidth: 150 }}>{row.state}</TableCell>
      <TableCell>{row.title_translate}</TableCell>
      <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
        <Typography variant='button' color='blue'>
          <a href={`/news/${row.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            编辑
          </a>
        </Typography>
        <Typography onClick={() => handleClick(row.id)} variant='button' sx={{ cursor: 'pointer' }} color='blue'>
          提交正式库
        </Typography>
      </TableCell>
    </TableRow>
  );
}
