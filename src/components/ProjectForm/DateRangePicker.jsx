import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import Loader from '../Loader';

function DateRangePicker({ open, handleClose }) {
  const data = useSelector((state) => state?.singleCardData);
  const loader = useSelector((state) => state.showLoader);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setStartDate(new Date(data?.data?.[0]?.start_date));
    setEndDate(new Date(data?.data?.[0]?.end_date));
  }, [data]);

  const handleDates = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const dateRangeMutation = useMutation({
    mutationFn: async () => {
      const result = await HttpClient.updateTask({
        id: data?.data?.[0]?.id,
        start_date: new Date(startDate).toJSON().slice(0, 10).replace(/-/g, '-'),
        end_date: new Date(endDate).toJSON().slice(0, 10).replace(/-/g, '-'),
        is_completed: true,
        dates_override: true,
      });
      return result;
    },
    onSuccess: () => {
      HttpClient.getSingleProject({ id: data?.data?.[0]?.board });
      handleClose();
    },
  });

  const handleSave = () => {
    dateRangeMutation.mutate();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Select Dates</DialogTitle>
      {loader.show || data?.length === 0 ? (
        <Loader />
      ) : (
        <>
          <DialogContent>
            <div className="flex justify-start px-5 py-[25px]">
              <div>
                <label className="form-label">Dates</label>
                <ReactDatePicker
                  className="border-2 text-center h-[40px] w-[12vw]"
                  dateFormat="dd-MM-yyyy"
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  popperPlacement="right"
                  required
                  onChange={(date) => {
                    handleDates(date);
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default DateRangePicker;
