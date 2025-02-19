import { AppBar, Dialog, Toolbar, IconButton, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close, ViewCarousel } from '@mui/icons-material';
import React, { useState } from 'react';
import { FaList } from 'react-icons/fa';
import TemplatesLibrary from './TemplatesLibrary';
import TemplatesSlider from './TemplatesSlider';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
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

function TemplatesTable({ show, handleHide, selected, forCrm }) {
  const classes = useStyles();
  const [display, setDisplay] = useState('list');
  const toggleDisplay = (view) => {
    setDisplay(view);
  };
  return (
    <Dialog
      maxWidth="lg"
      open={show}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong style={{ color: '#627daf' }}>Select a Playbook to initialise your project</strong>
          <div className="d-flex">
            <div
              className="d-flex justify-centre left-btn"
              style={{
                backgroundColor: display === 'list' ? '#6385b7' : '#dadde9',
              }}
            >
              <Tooltip
                title={'Show Templates List'}
                placement="top"
                arrow
              >
                <IconButton onClick={() => toggleDisplay('list')}>
                  <FaList
                    style={{
                      color: display === 'list' ? '#ffffff' : '#627daf',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <div
              className="d-flex justify-centre right-btn"
              style={{
                backgroundColor: display === 'slides' ? '#6385b7' : '#dadde9',
              }}
            >
              <Tooltip
                title={'Show Templates Slides'}
                placement="top"
                arrow
              >
                <IconButton onClick={() => toggleDisplay('slides')}>
                  <ViewCarousel
                    style={{
                      color: display === 'slides' ? '#ffffff' : '#627daf',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleHide}
            aria-label="close"
          >
            <Close style={{ fontSize: 30, color: '#627daf' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {display === 'list' ? (
        <TemplatesLibrary
          selectedCompany={selected}
          clone
          closeDialog={handleHide}
          isCrm={forCrm}
        />
      ) : (
        <TemplatesSlider company_id={selected} />
      )}
    </Dialog>
  );
}

export default React.memo(TemplatesTable);
