import { Button, CircularProgress, DialogActions } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../../Redux/Actions/loader';
import { saveTaskSteps } from '../../../Redux/Actions/task-info';
import { showTextCount } from '../TaskInfo';

function AddStepForm({ card, hideForm, forTaskType, steps_count }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const [form, setForm] = useState({
    label: '',
  });
  const [showError, setShowError] = useState(false);
  const [showCharCount, setShowCharCount] = useState(false);
  const textbox = useRef(null);
  function adjustHeight() {
    textbox.current.style.height = 'inherit';
    textbox.current.style.height = `${textbox.current.scrollHeight}px`;
  }
  const handleForm = (event) => {
    adjustHeight();
    setShowCharCount(true);
    setForm({ ...form, [event.target.name]: event.target.value });
    if (event.target.value.length > 0) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  };
  const handleAddStep = () => {
    const formData = new FormData();
    formData.append('card', card);
    formData.append('label', form.label);
    formData.append('order_number', steps_count + 1);
    const taskTypeForm = new FormData();
    taskTypeForm.append('task_type', card);
    taskTypeForm.append('label', form.label);
    taskTypeForm.append('order_number', steps_count + 1);
    if (form.label === '') {
      setShowError(true);
    } else {
      dispatch(show(true));
      dispatch(
        saveTaskSteps({
          data: forTaskType ? taskTypeForm : formData,
          card: card,
          isTaskType: forTaskType,
        }),
      );
      if (!loader.show) {
        setForm({
          label: '',
        });
        setShowError(false);
      }
    }
  };
  return (
    <div className="d-flex-column">
      <div>
        <label className={showError ? 'text-danger font-bold' : 'text-grey font-bold'}>Label</label>
        <textarea
          ref={textbox}
          type="text"
          className={showError ? 'error-form-control' : 'comment-form-control'}
          name="label"
          value={form.label}
          onChange={handleForm}
          maxLength={355}
          style={{ resize: 'none' }}
        />
        <div className="d-flex justify-space-between">
          <p className="text-danger">{showError ? 'Step label is required' : ''}</p>
          {showTextCount(form.label, showCharCount, 355)}
        </div>
      </div>
      <DialogActions style={{ padding: '5px 0 0 0' }}>
        <Button
          variant="text"
          style={{ backgroundColor: '#627daf', color: '#fff' }}
          onClick={handleAddStep}
        >
          {loader.show ? (
            <CircularProgress style={{ color: '#fff', width: 15, height: 15 }} />
          ) : (
            'Add'
          )}
        </Button>
        <Button
          variant="text"
          style={{
            backgroundColor: '#f2f2f2',
            color: '#222222',
            textTransform: 'none',
          }}
          onClick={hideForm}
        >
          Cancel
        </Button>
      </DialogActions>
    </div>
  );
}

export default React.memo(AddStepForm);
