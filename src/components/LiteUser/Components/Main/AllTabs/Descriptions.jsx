import React, { useEffect, useRef, useState } from 'react';
import { getDevice } from '../../../../Utils';
import { Fab, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Content from '../../../../Contents/ContentCard/Content';
import HorizontalProgressbar from '../../../../HorizontalProgressbar';
import { ArrowUpwardOutlined } from '@mui/icons-material';

const container = makeStyles({
  container: {
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `83vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `68vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `80vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `77vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `52vh`,
    },
  },
  fab: {
    backgroundColor: '#ffffff',
    margin: 0,
    top: 'auto',
    right: 40,
    bottom: 150,
    left: 'auto',
    zIndex: 9,
    position: 'fixed',
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 10,
    },
  },
});

function Description({ contentData }) {
  const isMobile = getDevice();
  const classes = container();
  const contentRef = useRef(null);
  const [scroll, setScroll] = useState(0);

  const setAddModalErrorMsg = () => {
    contentRef.current?.scrollIntoView({ block: 'nearest' });
  };

  function calculateScrollPercentage() {
    const scrollableDiv = document.getElementById('content');

    const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScroll(scrollPercentage.toFixed(2));
  }

  useEffect(() => {}, [scroll]);

  return (
    <div
      className={`card ${!isMobile && 'ml-3'}`}
      style={{ height: '100%' }}
    >
      <div
        className={classes.container}
        id="content"
        onScrollCapture={calculateScrollPercentage}
      >
        <div ref={contentRef} />
        <HorizontalProgressbar width={`${scroll}%`} />
        {contentData?.length > 0 ? (
          <Content contents={contentData} />
        ) : (
          <div className="text-centre app-color">
            <strong>No shared contents</strong>
          </div>
        )}
      </div>
      {scroll >= 30.0 && (
        <Tooltip
          title="Back to Top"
          placement="top"
        >
          <Fab
            className={classes.fab}
            size={'medium'}
            onClick={setAddModalErrorMsg}
          >
            <ArrowUpwardOutlined
              style={{ width: 25, height: 25, color: 'rgba(98,125, 175, 1.3)' }}
            />
          </Fab>
        </Tooltip>
      )}
    </div>
  );
}

export default React.memo(Description);
