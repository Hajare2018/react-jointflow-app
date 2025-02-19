import React from 'react';
import DocumentsTable from './ProjectForm/Components/DocumentsTable';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

const container = makeStyles({
  container: {
    height: '75vh',
    maxHeight: `63vh`,
    overflowY: 'auto',
    margin: 10,
    '@media(max-height: 2160px)': {
      maxHeight: `74.5vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `68vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `68.7vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `64vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `52vh`,
    },
  },
  fordashboard: {
    height: '90vh',
    overflowY: 'auto',
    margin: 10,
  },
});

function DocumentsView({ forDashboard }) {
  const classes = container();
  const documents = useSelector((state) => state.uploadedDocs);
  const data = documents?.data?.length > 0 ? documents?.data : [];
  return (
    <div className={forDashboard ? classes.fordashboard : classes.container}>
      <DocumentsTable
        table_data={data}
        board
      />
    </div>
  );
}

export default React.memo(DocumentsView);
