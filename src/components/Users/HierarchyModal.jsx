import { AppBar, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import OrganizationChart from '@dabeng/react-orgchart';
import { useSelector } from 'react-redux';
import MyNode from './MyNode';
import { Close } from '@mui/icons-material';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
    color: '#627daf',
  },
}));

function HierarchyModal({ open, handleClose }) {
  const classes = useStyles();
  const user_hierarchy = useSelector((state) => state.userHierarchyData);
  const hierarchyData = user_hierarchy?.data?.length > 0 ? user_hierarchy?.data?.[0] : [];
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>{hierarchyData?.first_name + ' ' + hierarchyData?.last_name}</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div>
        <OrganizationChart
          datasource={hierarchyData}
          chartClass="myChart"
          NodeTemplate={MyNode}
        />
      </div>
    </Dialog>
  );
}

export default React.memo(HierarchyModal);
