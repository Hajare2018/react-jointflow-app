import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  IconButton,
  Toolbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Close } from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { show } from "../../../Redux/Actions/loader";
import { cloneBoard } from "../../../Redux/Actions/clone-data";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  appBar: {
    position: "relative",
    backgroundColor: "#627daf",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    position: "absolute",
    right: 0,
    height: "100%",
  },
}));

function CloseDatePrompt({ open, handleHide, data }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const path = new URL(window.location.href);
  const navbar = new URLSearchParams(path.search).get("navbars");
  const [date, setDate] = useState(
    new Date()?.toJSON()?.slice(0, 10)?.replace(/-/g, "-")
  );
  const [height, setHeight] = useState("height-14");
  const loader = useSelector((state) => state.showLoader);

  useEffect(() => {
    if (!open) {
      handleDate(new Date());
    }
  }, [open]);
  console.log("data....--.....", data);

  const handleDate = (date) => {
    let selected = new Date(date).setDate(new Date(date).getDate());
    setDate(new Date(selected).toJSON().slice(0, 10).replace(/-/g, "-"));
    setHeight("height-14");
  };
  const handleCloningTemplate = () => {
    dispatch(show(true));
    const requestBody = {
      template_id: data.template_id,
      project_name: data.project_name,
      buyer_company: data.buyer_company,
      project_value: data.project_value,
      target_end_date: date,
      crm_id: data.crm_id,
    };

    dispatch(
      cloneBoard({
        data: requestBody,
        to_template: false,
        forCrm: false,
        showNavbars: navbar == null ? "True" : navbar,
      })
    );
  };

  const handleCalculatedDate = (startDate) => {
    const skipWeekends = (date) => {
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      return day !== 0 && day !== 6;
    };

    const getDateAfterNDays = (start, count) => {
      let currentDate = new Date(start);
      let workingDays = 0;

      while (workingDays < count) {
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        if (skipWeekends(currentDate)) {
          workingDays++; // Count only if not Saturday or Sunday
        }
      }

      return currentDate;
    };

    const dateAfterCalculation = getDateAfterNDays(
      new Date(startDate),
      data?.durationDays
    );
    handleDate(dateAfterCalculation);
  };
  return (
    <Dialog maxWidth="md" open={open}>
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong className="App-color">Select Target Close Date</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleHide}
            aria-label="close"
          >
            <Close className="App-color" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={`${height} p-5`}>
        <ReactDatePicker
          className={"form-control-input w-full"}
          dateFormat="dd/MM/yyyy"
          locale="en-GB"
          required
          selected={moment(date).toDate()}
          onChange={(date) => {
            handleDate(moment(date).toDate());
          }}
          onInputClick={() => setHeight("h-34")}
          onClickOutside={() => setHeight("height-14")}
          showPopperArrow
          selectsEnd
        />
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => handleCalculatedDate(moment(date).toDate())}
            className="next-btn"
          >
            Use payload Duration
          </Button>
          <Button
            variant="contained"
            onClick={handleCloningTemplate}
            className="next-btn"
            disabled={loader.show}
          >
            NEXT
            {loader.show && (
              <CircularProgress className="ml-2 h-5 w-5 white-color" />
            )}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default React.memo(CloseDatePrompt);
