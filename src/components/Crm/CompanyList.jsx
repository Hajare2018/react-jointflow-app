import {
  AppBar,
  Dialog,
  Toolbar,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Button,
  TableCell,
  Radio,
  Avatar,
  TableBody,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createImageFromInitials } from '../Utils';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import AddNewCompany from '../Companies/AddNewCompany';
import TemplatesTable from '../Documents/TemplatesLibrary/TemplatesTable';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: '100%',
    height: 40,
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: 685,
    },
    '@media(max-height: 1024px)': {
      maxHeight: 620,
    },
    '@media(max-height: 900px)': {
      maxHeight: 500,
    },
    '@media(max-height: 768px)': {
      maxHeight: 370,
    },
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    color: theme.palette.common.black,
    backgroundColor: '#eef2f6',
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'rgba(183, 244, 216, 0.7)',
    },
  },
}))(TableRow);

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: '#000000',
          backgroundColor: 'rgba(183, 244, 216, 0.7)',
        }
      : {
          color: '#000000',
          backgroundColor: 'rgba(183, 244, 216, 0.7)',
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = ({ numSelected, selected_id }) => {
  const classes = useToolbarStyles();
  const [open, setOpen] = useState(false);

  const goNext = () => {
    setOpen(!open);
  };

  return (
    <>
      <Toolbar
        style={{ display: 'flex' }}
        className={clsx(classes.root, {
          [classes.highlight]: numSelected,
        })}
      >
        {numSelected !== '' ? (
          <div style={{ width: '100%', padding: 10 }}>
            <Typography
              style={{ float: 'left' }}
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
            <Button
              variant="contained"
              style={{ backgroundColor: '#6385b7', color: '#ffffff', fontSize: 16, float: 'right' }}
              onClick={goNext}
            >
              Next
            </Button>
          </div>
        ) : (
          ''
        )}
      </Toolbar>
      <TemplatesTable
        show={open}
        handleHide={goNext}
        selected={selected_id}
      />
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function CompanyList({ open, handleClose }) {
  const classes = useStyles();
  const companies = useSelector((state) => state.companiesData);
  const allData = companies?.data?.length > 0 ? companies?.data : [];
  const [selected, setSelected] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState('');
  const [selectedId, setSelectedId] = useState(0);
  const [showForm, setShowForm] = useState(false);

  
  const handleCompanyForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    setSelectedId(selectedId);
    setSelectedCompany(selectedCompany);
  }, [selectedId, selectedCompany]);

  const handleClick = useCallback(
    (event, data) => {
      let newSelected = selected;
      if (data?.name !== selected) {
        newSelected = data?.name;
        setSelectedCompany(newSelected);
        setSelectedId(data?.id);
      }
      setSelected(newSelected);
    },
    [selectedCompany, selectedId],
  );

  const isSelected = (name) => selected.indexOf(name) !== -1;
  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Buyer Company List</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <>
        <TableContainer className={`${classes.container} mt-3`}>
          <Table
            className={classes.table}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Company</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData?.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow
                    onClick={(event) => {
                      handleClick(event, row);
                    }}
                    role={'checkbox'}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <StyledTableCell padding={'checkbox'}>
                      <Radio
                        checked={isItemSelected}
                        color="success"
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      component="th"
                      scope="row"
                    >
                      <div className="d-flex">
                        <Avatar
                          className="mr-1"
                          src={
                            row.company_image
                              ? row.company_image
                              : row.company_image == null
                                ? createImageFromInitials(300, row?.name, '#627daf')
                                : createImageFromInitials(300, row?.name, '#627daf')
                          }
                        />
                        {row?.name}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {selected ? (
          <EnhancedTableToolbar
            numSelected={selectedCompany}
            selected_id={selectedId}
            company={allData}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 10,
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: '#6385b7',
                color: '#ffffff',
                fontSize: 16,
              }}
              onClick={handleCompanyForm}
            >
              + ADD
            </Button>
          </div>
        )}
        <AddNewCompany
          open={showForm}
          handleClose={handleCompanyForm}
        />
      </>
    </Dialog>
  );
}

export default React.memo(CompanyList);
