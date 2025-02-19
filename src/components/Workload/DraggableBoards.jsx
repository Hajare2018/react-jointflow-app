import { Avatar, TableCell, TableRow, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReorderOutlined } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import newTab from '../../assets/icons/OpenNewTabIconBlue.png';
import { createImageFromInitials, currencyFormatter, dateFormat } from '../Utils';
import { useTenantContext } from '../../context/TenantContext';

const useStyles = makeStyles({
  draggingListItem: {
    background: 'rgb(235,235,235)',
  },
});

const StyledTableCell = withStyles((_theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: '#000000',
    fontWeight: '700',
  },
  root: {
    padding: 8,
    borderBottom: '0px !important',
    height: 50,
  },
  body: {
    fontSize: 16,
    height: 80,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

export default function DraggableBoards({ row, index }) {
  const classes = useStyles();
  const { tenant_locale, currency_symbol } = useTenantContext();

  return (
    <>
      <Draggable
        draggableId={row.id.toString()}
        index={index}
        key={row.id}
      >
        {(provided, snapshot) => (
          <StyledTableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? classes.draggingListItem : ''}
            key={row?.id}
          >
            <StyledTableCell
              style={{
                color: '#627daf',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
              }}
              scope="row"
            >
              <Avatar
                src={
                  row?.buyer_company_details_light?.company_image == null
                    ? createImageFromInitials(
                        300,
                        row?.buyer_company_details_light?.name,
                        '#627daf',
                      )
                    : row?.buyer_company_details_light?.company_image
                }
                className="mr-2"
                style={{ width: 25, height: 25 }}
              />
              {(row?.name).length > 15 ? (row?.name).substring(0, 15 - 3) + '...' : row?.name}
              <Link
                to={`/board/?id=${row?.id}&navbars=True&actions=True`}
                target="_blank"
              >
                <Tooltip
                  title={`Open Project "${row?.name}" in new tab`}
                  arrow
                  placement="top"
                >
                  <img
                    src={newTab}
                    style={{ height: 15, width: 15, marginLeft: 10 }}
                  />
                </Tooltip>
              </Link>
            </StyledTableCell>
            <StyledTableCell align="left">
              {row?.buyer_company_details_light?.name?.length > 30
                ? (row?.buyer_company_details_light?.name).substring(0, 30 - 3) + '...'
                : row?.buyer_company_details_light?.name}
            </StyledTableCell>
            <StyledTableCell align="left">
              {currencyFormatter(
                tenant_locale,
                row?.project_value == null ? '0' : row?.project_value,
                currency_symbol == null ? 'GBP' : currency_symbol,
              )}
            </StyledTableCell>
            <StyledTableCell align="left">{row?.owner_name}</StyledTableCell>
            <StyledTableCell align="left">{dateFormat(row?.target_close_date)}</StyledTableCell>
            <StyledTableCell align="left">{row?.percentage_completed + '%'}</StyledTableCell>
            <StyledTableCell align="left">{dateFormat(row?.board_likely_end_date)}</StyledTableCell>
            <StyledTableCell align="left">{row?.priority}</StyledTableCell>
            <StyledTableCell>
              <ReorderOutlined />
            </StyledTableCell>
          </StyledTableRow>
        )}
      </Draggable>
    </>
  );
}
