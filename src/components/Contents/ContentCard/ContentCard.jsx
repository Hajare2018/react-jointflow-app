import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { dateFormat } from '../../Utils';
import {
  FileCopyOutlined,
  LaunchOutlined,
  RefreshOutlined,
  ZoomOutMapOutlined,
} from '@mui/icons-material';
import { showInfoSnackbar } from '../../../Redux/Actions/snackbar';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import ImagePreview from './ImagePreview';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    marginBottom: 5,
  },
  media: {
    height: 'auto',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function ContentCard({ content }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showImg, setShowImg] = useState({
    show: false,
    image: '',
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    dispatch(showInfoSnackbar('Copied to clipboard!'));
  };

  const handleOpenInNewTab = (url) => {
    window.open(url, '_blank');
  };

  const handleShowImage = (img) => {
    setShowImg({
      show: true,
      image: img,
    });
  };

  const handleClose = () => {
    setShowImg({
      show: false,
      image: '',
    });
  };

  const reloadFiles = (id) => {
    let iframe = document.getElementById(`frame_id_${id}`);
    // TODO FIXME this seems strange
    // eslint-disable-next-line no-self-assign
    iframe.src = iframe.src;
  };

  return (
    <>
      <Card
        id="progress-value"
        className={classes.root}
      >
        {!content?.hide_header && (
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                className={classes.avatar}
                src={content.created_by_details.avatar}
              />
            }
            title={
              content.created_by_details.first_name + ' ' + content.created_by_details.last_name
            }
            subheader={dateFormat(new Date())}
          />
        )}
        <CardMedia className={content?.type == 'TEXT' ? 'ml-4' : classes.media}>
          <div dangerouslySetInnerHTML={{ __html: content.html_render }} />
        </CardMedia>
        {content?.type !== 'CANVAS' && (
          <>
            <CardContent>
              {!content.hide_title && <strong>{content.title}</strong>}
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {content.caption}
              </Typography>
            </CardContent>
            <CardActions
              style={{ float: 'right' }}
              disableSpacing
            >
              <Tooltip
                title="Copy url"
                placement="top"
              >
                <IconButton
                  onClick={() => handleCopy(content.url !== '' ? content.url : content.html_render)}
                  type="IconButton"
                >
                  <FileCopyOutlined className="app-color" />
                </IconButton>
              </Tooltip>
              {content?.type === 'FILE' && (
                <Tooltip
                  title="refresh content"
                  placement="top"
                >
                  <IconButton
                    onClick={() => reloadFiles(content.id)}
                    type="IconButton"
                  >
                    <RefreshOutlined className="app-color" />
                  </IconButton>
                </Tooltip>
              )}
              {content.url !== '' && (
                <Tooltip
                  title="Open in New tab"
                  placement="top"
                >
                  <IconButton
                    onClick={() => handleOpenInNewTab(content.url)}
                    type="IconButton"
                  >
                    <LaunchOutlined className="app-color" />
                  </IconButton>
                </Tooltip>
              )}
              {content.type === 'IMAGE' && (
                <Tooltip
                  title="Zoom out"
                  placement="top"
                >
                  <IconButton
                    onClick={() => handleShowImage(content.html_render)}
                    type="IconButton"
                  >
                    <ZoomOutMapOutlined className="app-color" />
                  </IconButton>
                </Tooltip>
              )}
            </CardActions>
          </>
        )}
      </Card>
      <ImagePreview
        open={showImg.show}
        handleClose={handleClose}
        image={showImg.image}
      />
    </>
  );
}

export default React.memo(ContentCard);
