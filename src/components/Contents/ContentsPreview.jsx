import { Dialog, Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import Content from './ContentCard/Content';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'sticky',
    top: 0,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#627daf',
    marginLeft: 10,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="left"
      timeout={4000}
      ref={ref}
      {...props}
    />
  );
});

function ContentsPreview({ open, handleClose }) {
  const classes = useStyles();
  const contentsData = useSelector((state) => state.contentsData);
  const allContents = contentsData?.data?.cblocks;

  return (
    <Dialog
      className="sidebarDialog"
      fullScreen
      classes={{ paper: classes.dialogPaper }}
      onClose={handleClose}
      open={open}
      TransitionComponent={Transition}
      scroll="paper"
    >
      <div className="p-3">
        <Content contents={allContents} />
      </div>
    </Dialog>
  );
}

export default React.memo(ContentsPreview);
