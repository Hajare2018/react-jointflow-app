import { Button, CircularProgress, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import giveFeedback from '../../Redux/Actions/feedback';
import { show } from '../../Redux/Actions/loader';
import { getDevice } from '../Utils';
import RatingComponent from './RatingComponent';

const isMobile = getDevice();

const style = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'absolute',
  padding: `20px 50px`,
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isMobile ? '95%' : 'auto',
  justifyContent: 'center',
  backgroundColor: 'rgba(98,125,175,1)',
  color: '#ffffff',
  borderRadius: '0.8em',
};

function FeedbackForm({ open, handleClose }) {
  const [form, setForm] = useState({
    title: '',
    comment: '',
  });
  const [sentiments, setSentiments] = useState('');
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);

  useEffect(() => {}, [form, sentiments]);

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const getSentimentValues = (e) => {
    if (e === 1) {
      setSentiments('very_negative');
    }
    if (e === 2) {
      setSentiments('negative');
    }
    if (e === 3) {
      setSentiments('neutral');
    }
    if (e === 4) {
      setSentiments('positive');
    }
    if (e === 5) {
      setSentiments('very_positive');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(show(true));
    const reqBody = {
      topic: form.title,
      comment: form.comment,
      sentiment: sentiments,
    };
    dispatch(giveFeedback(reqBody));
    if (!loader.show) {
      handleClear();
    }
  };

  const handleClear = () => {
    setForm({
      title: '',
      comment: '',
    });
    setSentiments('');
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClear}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <div style={style}>
        <div
          className="mb-3"
          style={{ width: '100%' }}
        >
          <label
            className="form-label"
            style={{ color: '#ffffff' }}
          >
            Title
          </label>
          <input
            type="text"
            maxLength={25}
            value={form.title}
            style={{ color: '#000000' }}
            className="text-input"
            name="title"
            onChange={handleForm}
          />
        </div>
        <div
          className="mb-3"
          style={{ width: '100%' }}
        >
          <label
            className="form-label"
            style={{ color: '#ffffff' }}
          >
            Comment
          </label>
          <textarea
            style={{ color: '#000000' }}
            className="text-input-area"
            rows={4}
            value={form.comment}
            name="comment"
            onChange={handleForm}
          />
        </div>
        <div className="d-flex">
          <label
            className="form-label mr-3"
            style={{ color: '#ffffff' }}
          >
            Sentiments
          </label>
          <RatingComponent
            sentimentValue={getSentimentValues}
            sentiment={sentiments}
          />
        </div>
        <br />
        <div className="d-flex">
          <div className="mr-2">
            <Button
              onClick={handleClear}
              variant="outlined"
              color="inherit"
            >
              Close
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={form.title === '' || form.comment === '' || sentiments === ''}
            style={{
              color: '#ffffff',
              backgroundColor:
                form.title === '' || form.comment === '' || sentiments === ''
                  ? '#aeaeae'
                  : 'dark blue',
            }}
          >
            {loader.show ? (
              <CircularProgress
                color="inherit"
                size={20}
              />
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(FeedbackForm);
