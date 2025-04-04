
// eslint-disable-next-line import/no-extraneous-dependencies
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

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
  const navigate = useNavigate();
  const goToNewsDetail = (id: string) => {
    navigate(`/news/${id}`);
  };
  
  return (
    <TableRow hover tabIndex={-1}>
        <TableCell sx={{minWidth: 100}}>{row.id}</TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell sx={{minWidth: 100}}>{row.country}</TableCell>
        <TableCell sx={{minWidth: 150}}>{row.state}</TableCell>
        <TableCell>{row.title_translate}</TableCell>
        <TableCell align="right" sx={{minWidth: 150}}>
          <IconButton onClick={() => goToNewsDetail(row.id.toString())} sx={{ fontSize: 16, p: 1 }}>
          <FaRegEdit/> 编辑
          </IconButton>
        </TableCell>
      </TableRow>
  );
}
