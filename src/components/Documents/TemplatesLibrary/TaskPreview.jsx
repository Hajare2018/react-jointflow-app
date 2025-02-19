import { AppBar, Button, Dialog, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../../Redux/Actions/loader';
import { postTaskPreviews } from '../../../Redux/Actions/single-project';
import DashboardApexChart from '../../ChartComponent/DashboardApexChart';
import { getFileFromBase64 } from '../../Utils';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    padding: 4,
  },
  body: {
    fontSize: 16,
    height: 20,
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

function TaskPreview({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectData = useSelector((state) => state?.singleProjectData);
  const loader = useSelector((state) => state?.showLoader);
  const allData = projectData?.data?.length > 0 ? projectData?.data : [];
  let chartData = [];
  allData?.forEach((element) => {
    element?.cards?.forEach((card) => {
      chartData.push({
        task_id: card?.id,
        task_name: card?.title,
        color: card?.task_type_details?.color,
        task_type: card?.task_type_details?.custom_label,
        offset: card?.offset,
        pre_assigned: card?.internal_assignee_details !== null ? true : false,
        start_date: card?.start_date,
        end_date: card?.end_date,
        is_completed: card?.is_completed,
        last_doc: card?.last_uploaded_document,
      });
    });
  });
  const savePreview = async (chartId) => {
    const chartInstance = window.Apex._chartInstances.find((chart) => chart.id === chartId);
    const base64 = await chartInstance.chart.dataURI();
    const imgFile = getFileFromBase64(
      base64.imgURI,
      `${allData?.[0]?.name}_id#${allData?.[0]?.id}.png`,
    );
    const formData = new FormData();
    formData.append('thumbnail_file', imgFile);
    formData.append('board_id', allData?.[0]?.id);
    dispatch(show(true));
    dispatch(postTaskPreviews(formData));
    if (!loader.show) {
      handleClose();
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <Tooltip
            title={'Task'}
            placement="right"
            arrow
          >
            <div className="d-flex">
              <Typography style={{ fontWeight: 'bold' }}>
                Task Preview for {allData?.[0]?.name} Template
              </Typography>
            </div>
          </Tooltip>
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
      <div className="mt-20">
        <DashboardApexChart
          dashboardTasks={chartData}
          height={'auto'}
          forTemplates
        />
      </div>
      <div className="d-flex justify-centre p-ten">
        <Button
          variant="contained"
          onClick={() => savePreview('ganttChart')}
          style={{
            backgroundColor: '#6385b7',
            color: '#ffffff',
            fontSize: 16,
          }}
        >
          Save Preview
        </Button>
      </div>
    </Dialog>
  );
}

export default React.memo(TaskPreview);
