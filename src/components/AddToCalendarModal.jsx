import { Dialog, FormControlLabel, Radio, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import AppSwitch from './ProjectForm/Components/AppSwicth';
import AddToCalendar, { SHARE_SITES } from '@emreerdogan/react-add-to-calendar-hoc';
import TestButton from './TestButton';
import TestModal from './TestModal';
import moment from 'moment';
import Autocomplete from '@mui/lab/Autocomplete';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
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

function AddToCalendarModal({ open, handleClose }) {
  const classes = useStyles();
  const AddToCalendarModal = AddToCalendar(TestButton, TestModal);
  const [selectedValue, setSelectedValue] = useState('a');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fromCalendar, setFromCalendar] = useState(false);
  const [date, setDate] = useState('');
  let emails = [];
  const [selectedEmails, setSelectedEmails] = useState('');
  const loader = useSelector((state) => state.showLoader);
  const cardData = useSelector((state) => state.singleCardData);
  const card = cardData?.data?.length > 0 ? cardData?.data?.[0] : [];

  const handleSelectedValue = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleFromCalendar = () => {
    setFromCalendar(!fromCalendar);
  };

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleDate = (event) => {
    setDate(event.target.value);
  };

  emails?.push(
    card?.owner_details == null ? 'Unknown' : card?.owner_details?.email,
    card?.internal_assignee_details == null ? 'Unknown' : card?.internal_assignee_details?.email,
    card?.external_assignee_details == null ? 'Unknown' : card?.external_assignee_details?.email,
  );
  let filteredEmails = emails?.filter((email) => email !== 'Unknown');

  useEffect(() => {
    setTitle(`Work on task "${card?.title}"`);
    setDescription(
      `Time set aside to ${selectedValue === 'a' ? 'work on' : 'discuss'} "${
        card?.title
      }". The Task details and document(s) can be found here: https://${
        window.location.hostname
      }/board/?id=${card.board}&navbars=True&actions=True&card=${card.id}`,
    );
    setDate(card?.start_date);
  }, [card]);

  const startDatetime = moment.utc().add(2, 'days');
  const endDatetime = startDatetime.clone().add(2, 'hours');
  const duration = moment.duration(endDatetime.diff(startDatetime)).asHours();
  const event = {
    description: description,
    duration: duration.toString(),
    endDatetime: endDatetime.format('YYYYMMDDTHHmmssZ'),
    location: 'TBD',
    startDatetime: startDatetime.format('YYYYMMDDTHHmmssZ'),
    title: title,
    to: selectedEmails,
  };
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      style={{ height: 'auto' }}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Add To Calendar</strong>
          <IconButton
            edge="start"
            color="inherit"
            className="close-icon"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 15 }}>
        {loader.show ? (
          <Loader />
        ) : (
          <>
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                className="text-input"
                onChange={handleTitle}
                value={title}
              />
            </div>
            <div>
              <div
                className="addNewUserWrapad"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}
              >
                {!fromCalendar && (
                  <div className="flex-5">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={handleDate}
                      className="form-control"
                    />
                  </div>
                )}
                <div style={{ flex: !fromCalendar ? 1 : 6 }} />
                <div className="flex-4">
                  <AppSwitch
                    switchedValue={fromCalendar}
                    handleSwitch={handleFromCalendar}
                    switchedName="Pick in Calendar"
                    switchLabel="Pick in Calendar"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FormControlLabel
                value={selectedValue}
                control={
                  <Radio
                    checked={selectedValue === 'a'}
                    onChange={handleSelectedValue}
                    value="a"
                    name="Work on"
                    inputProps={{ 'aria-label': 'A' }}
                  />
                }
                label={<span style={{ fontSize: '1.8rem', fontWeight: '600' }}>Work on</span>}
                labelPlacement="end"
              />
              <FormControlLabel
                value={selectedValue}
                control={
                  <Radio
                    checked={selectedValue === 'b'}
                    onChange={handleSelectedValue}
                    value="b"
                    name="Discuss"
                    inputProps={{ 'aria-label': 'B' }}
                  />
                }
                label={<span style={{ fontSize: '1.8rem', fontWeight: '600' }}>Discuss</span>}
                labelPlacement="end"
              />
            </div>
            {selectedValue === 'b' && (
              <div className="d-flex-column">
                <div>
                  <label className="form-label">With:</label>
                  <div className={classes.root}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={filteredEmails}
                      getOptionDisabled={(option) => option === 'Unknown'}
                      onChange={(value, selected) => {
                        setSelectedEmails(selected.join(';'));
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          variant="outlined"
                          placeholder="example@buyercompany.com"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="form-label">Description</label>
              <textarea
                className="text-input"
                style={{ height: 150 }}
                value={description}
                onChange={handleDescription}
                rows="5"
                placeholder="Description"
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  color: '#627daf',
                  fontWeight: '700',
                  fontSize: 22,
                  borderWidth: 4,
                  borderColor: '#627daf',
                  borderRadius: 8,
                }}
              >
                <AddToCalendarModal
                  event={event}
                  buttonText={'+ Add To My Calendar'}
                  items={[
                    SHARE_SITES.GOOGLE,
                    SHARE_SITES.OUTLOOK,
                    SHARE_SITES.OFFICE,
                    SHARE_SITES.ICAL,
                    SHARE_SITES.YAHOO,
                  ]}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}

export default React.memo(AddToCalendarModal);
