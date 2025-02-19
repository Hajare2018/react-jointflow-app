import React, { useEffect, useState } from 'react';
import { Modal, Button, Box, DialogActions } from '@mui/material';
import { cloneBoard } from '../Redux/Actions/clone-data';
import { useDispatch, useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  padding: 20,
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  textAlign: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #627daf',
  boxShadow: 24,
  p: 4,
};

function ProjectCloneForm({ open, handleClose }) {
  const projectData = useSelector((state) => state.singleProjectData);
  const allData = projectData?.data?.length > 0 ? projectData?.data?.[0] : [];
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
  });
  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    setForm({
      name: allData?.name,
    });
  }, [projectData]);
  const handleSaveAsTemplate = () => {
    const reqBody = {
      template_id: allData?.id,
      project_name: form.name,
      to_template: true,
    };

    dispatch(cloneBoard({ data: reqBody, to_template: true }));
    handleClose();
  };
  return (
    <React.Fragment>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        onClose={handleClose}
      >
        <Box style={style}>
          <div className="mb-3">
            <label className="form-label">Template Name</label>
            <input
              type="text"
              name="name"
              className="text-input"
              value={form?.name}
              onChange={handleForm}
            />
          </div>
          <DialogActions>
            <Button
              variant="contained"
              style={{ background: 'rgba(98,125, 175, 1.7)', color: '#ffffff' }}
              onClick={handleSaveAsTemplate}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default React.memo(ProjectCloneForm);
