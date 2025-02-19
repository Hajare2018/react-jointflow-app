import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React, { useMemo } from 'react';
import { groupBy, reverseArr } from '../../../Utils';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { defaultStyles, FileIcon } from 'react-file-icon';
import HttpClient from '../../../../Api/HttpClient';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../../../Redux/Actions/store-data';
import { requestClauseList } from '../../../../Redux/Actions/document-upload';

const StyledTableCell = withStyles((_theme) => ({
  head: {
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    borderBottom: 0,
    padding: `7px !important`,
  },
}))(TableCell);

const StyledTableRow = withStyles((_theme) => ({
  root: {},
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
});

function Row({ row }) {
  const dispatch = useDispatch();
  const reversedArr = reverseArr(row);
  const [open, setOpen] = React.useState(false);
  const handleDispatchData = (data) => {
    dispatch(fetchData(data));
    dispatch(requestClauseList({ doc_id: data.id, hidden: false }));
  };
  return (
    <React.Fragment>
      <StyledTableRow>
        <StyledTableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell
          style={{
            color: open ? '#627daf' : '#222222',
            fontWeight: '700',
            padding: 10,
          }}
        >
          <div className="file-icons">
            <div
              className="file-icon"
              style={{ WebkitFontSmoothing: 'antialiased' }}
            >
              <FileIcon
                extension={row?.original_doc?.extension}
                {...defaultStyles[row?.original_doc?.extension]}
              />
            </div>
            <a href={row?.original_doc?.document_url + `/${HttpClient.api_token()}/`}>
              {(row?.original_doc?.name).length > 30
                ? (row?.original_doc?.name).substring(0, 30 - 3) + '...'
                : row?.original_doc?.name}
            </a>
          </div>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell
          style={{ padding: 0 }}
          colSpan={4}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Table
                size="small"
                aria-label="documents"
              >
                <TableBody>
                  {(reversedArr || []).map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell style={{ borderBottom: 0 }} />
                      <TableCell
                        className="d-flex justify-space-between"
                        style={{ borderBottom: 0, padding: 10 }}
                      >
                        <strong
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDispatchData(item)}
                        >
                          {new Date(item?.created_at).toLocaleDateString()}
                        </strong>
                        <strong>V{item.version}</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function DocVersionList({ data }) {
  const classes = useStyles();
  const activeDocs =
    data.length > 0
      ? data?.filter((item) => item.archived === false && item.grouping_id !== null)
      : [];
  const groupedDocs = useMemo(() => groupBy(activeDocs, 'grouping_id'), [activeDocs]);
  let arr = Object.keys(groupedDocs).map((item) => groupedDocs[item]);
  let originalDocs = [];
  let finalArr = [];
  arr.forEach((element) => {
    originalDocs.push(element.reduce((acc, shot) => (acc = acc > shot ? acc : shot), 0));
    finalArr.push(element);
  });
  finalArr.forEach((element, index) => {
    element.original_doc = originalDocs[index];
  });
  return (
    <React.Fragment>
      <div className="p-more">
        <strong className="version-font">Versions</strong>
        <TableContainer className="table-sticky p-1">
          <Table className={classes.table}>
            <TableBody>
              {finalArr?.map((i) => (
                // TODO FIXME
                // eslint-disable-next-line react/jsx-key
                <Row row={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </React.Fragment>
  );
}

export default React.memo(DocVersionList);
