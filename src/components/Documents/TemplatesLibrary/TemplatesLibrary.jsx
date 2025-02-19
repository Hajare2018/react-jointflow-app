import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import {
  currencyFormatter,
  dateFormat,
  getPlurals,
} from "../../../components/Utils";
import SearchBar from "../../../component-lib/SearchBar/SearchBar";
import requestDocumentsData from "../../../Redux/Actions/documents-data";
import { setMessage, show } from "../../../Redux/Actions/loader";
import {
  Button,
  Fab,
  FormControlLabel,
  Radio,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  Edit,
  LibraryBooksOutlined,
  RefreshRounded,
} from "@mui/icons-material";
import ArchiveIcon from "../../../assets/icons/archive.png";
import ArchiveDanger from "../../../assets/icons/archive_danger.png";
import AdditionalTableModal from "./TemplatesTask/index";
import { cloneBoard } from "../../../Redux/Actions/clone-data";
import postProject, {
  updateProject,
} from "../../../Redux/Actions/create-project";
import ConfirmDialog from "../../ProjectForm/Components/ConfirmDialog";
import requestSingleProject from "../../../Redux/Actions/single-project";
import { reload } from "../../../Redux/Actions/reload-data";
import AddForm from "./AddForm";
import Loader from "../../Loader";
import CloseDatePrompt from "./CloseDatePrompt";
import {
  stableSort,
  getComparator,
} from "../../../component-lib/JFTable/JFTable";
import { useTenantContext } from "../../../context/TenantContext";

function EnhancedTableHead({ classes, order, orderBy, onRequestSort, clone }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "times_used_as_template",
      numeric: true,
      disablePadding: false,
      label: "Used",
    },
    {
      id: "total_cards",
      numeric: false,
      disablePadding: false,
      label: "Nb Tasks",
    },
    {
      id: "board_document_count",
      numeric: true,
      disablePadding: false,
      label: "Nb docs",
    },
    {
      id: "project_duration",
      numeric: true,
      disablePadding: false,
      label: "Duration",
    },
    {
      id: "project_value",
      numeric: true,
      disablePadding: false,
      label: "Avg. Value",
    },
    {
      id: "last_activity_dt",
      numeric: true,
      disablePadding: false,
      label: "Last Updated",
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {clone && <StyledTableCell padding="checkbox" />}
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={headCell.id === "name" && "width-33"}
          >
            {headCell.label === "Duration" ? (
              <Tooltip title="Duration is an indicative lapse period which takes weekends into account">
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  Duration
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              </Tooltip>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            )}
          </StyledTableCell>
        ))}
        {!clone && <StyledTableCell align="right">Actions</StyledTableCell>}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: "#000000",
          backgroundColor: "rgba(183, 244, 216, 0.7)",
        }
      : {
          color: "#000000",
          backgroundColor: "rgba(183, 244, 216, 0.7)",
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = ({
  numSelected,
  templateId,
  company_id,
  navbar,
  durationDays,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const data = useSelector((state) => state.storedData);

  const message = useSelector((state) => state.messageData);
  const dispatch = useDispatch();
  const requestBody = {
    template_id: templateId,
    project_name: data?.data?.name,
    buyer_company: company_id ? company_id : data?.data?.buyer_company,
    project_value: data?.data?.project_value,
    target_end_date: data?.data?.target_close_date,
    crm_id: Object.keys(data?.data)?.length > 0 ? data?.data?.crm_id : null,
    durationDays: durationDays,
  };

  const handleCloningTemplate = () => {
    if (
      new Date(data?.data?.target_close_date) <= new Date() ||
      data?.data?.target_close_date === ""
    ) {
      setShowPrompt(true);
    } else {
      dispatch(show(true));
      dispatch(
        cloneBoard({
          data: requestBody,
          to_template: false,
          forCrm: false,
          showNavbars: navbar == null ? "True" : navbar,
        })
      );
    }
  };
  const handleClosePrompt = () => {
    setShowPrompt(false);
  };
  const classes = useToolbarStyles();
  return (
    <>
      <Toolbar
        style={{ display: "flex" }}
        className={clsx(classes.root, {
          [classes.highlight]: numSelected,
        })}
      >
        {numSelected ? (
          <div style={{ width: "100%", padding: 10 }}>
            <Typography
              style={{ float: "left" }}
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
            <Button
              variant="contained"
              onClick={handleCloningTemplate}
              className="next-btn"
              disabled={
                message.message == "Retrieving Deal details..." ||
                message.message == "Fetching Company Data..."
              }
            >
              {message.message == "" ? "NEXT" : message.message}
            </Button>
          </div>
        ) : (
          ""
        )}
      </Toolbar>
      <CloseDatePrompt
        open={showPrompt}
        handleHide={handleClosePrompt}
        data={requestBody}
      />
    </>
  );
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#eef2f6",
    color: theme.palette.common.black,
    fontWeight: "700",
    whiteSpace: "nowrap",
    overflow: `hidden !important`,
    textOverflow: "ellipsis",
  },
  root: {
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    fontSize: 16,
    height: 20,
    padding: 8,
  },
  alignRight: {
    textAlign: "unset",
    flexDirection: "unset",
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "rgba(183, 244, 216, 0.7)",
    },
  },
}))(TableRow);

const useStyles = makeStyles((_theme) => ({
  table: {
    minWidth: "100%",
    height: 40,
  },
  root: {
    width: "100%",
    "& .MuiTablePagination-root p": {
      fontSize: "0.7rem !important",
    },
  },
  container: {
    maxHeight: `calc(100vh - 278px)`,
  },
  fab: {
    backgroundColor: "#627daf",
    margin: 0,
    top: "auto",
    right: 80,
    bottom: 50,
    left: "auto",
    position: "fixed",
    "&:hover": {
      backgroundColor: "#4bdcba",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function TemplatesLibrary({ clone, selectedCompany, isCrm }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("total_tasks");
  const [openDialog, setOpenDialog] = useState(false);
  const [archiveData, setArchiveData] = useState({});
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = React.useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [searched, setSearched] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const isCrmData = useSelector((state) => state.singleCrmData);
  const message = useSelector((state) => state.messageData);
  const loader = useSelector((state) => state.showLoader);
  const loaded_data = useSelector((state) => state.reloadedData);
  const allProjects = useSelector((state) => state.templatesData);
  const allData = allProjects?.data?.length > 0 ? allProjects?.data : [];
  const path = new URL(window.location.href);
  const isNavbar = new URLSearchParams(path.search).get("navbars");
  const isCrm_id = new URLSearchParams(path.search).has("crm_id");
  const { tenant_locale, currency_symbol } = useTenantContext();

  const handleOpenDialog = (e) => {
    setArchiveData(e);
    setOpenDialog(!openDialog);
  };

  const handleCloseDialog = (e) => {
    if (e.close) {
      handleArchiveTemplate();
    }
    setOpenDialog(!openDialog);
  };

  const dispatch = useDispatch();

  const handleArchiveTemplate = () => {
    dispatch(show(true));
    const projectRequest = {
      project_value: archiveData?.project_value,
      name: archiveData?.name,
      nb_amber_flags: archiveData?.nb_amber_flags,
      nb_green_flags: archiveData?.nb_green_flags,
      nb_red_flags: archiveData?.nb_red_flags,
      target_close_date: archiveData?.target_close_date,
      archived: archiveData?.archived ? "False" : "True",
    };
    dispatch(
      updateProject({
        id: archiveData?.id,
        data: projectRequest,
        filterByTemplate: true,
        archivedTemplates: archiveData?.archived,
        closedBoards: false,
        showSuccess: true,
      })
    );
  };

  useEffect(() => {
    setRows(allData);
  }, [allProjects]);

  useEffect(() => {}, [loaded_data]);

  const handleSwitch = () => {
    dispatch(show(true));
    setArchived(!archived);
    if (archived) {
      dispatch(
        requestDocumentsData({
          filterByTemplate: true,
          archivedTemplates: false,
          closedBoards: false,
        })
      );
    } else {
      dispatch(
        requestDocumentsData({
          archivedTemplates: true,
          filterByTemplate: true,
          closedBoards: false,
        })
      );
    }
  };

  React.useEffect(() => {
    doRefresh();
    return setRows([]);
  }, []);

  const doRefresh = () => {
    dispatch(show(true));
    if (archived) {
      dispatch(
        requestDocumentsData({
          archivedTemplates: true,
          filterByTemplate: true,
          closedBoards: false,
        })
      );
    } else {
      dispatch(
        requestDocumentsData({
          filterByTemplate: true,
          archivedTemplates: false,
          closedBoards: false,
        })
      );
    }
  };

  const handleClick = (data) => {
    let newSelected = selected;
    setDurationDays(data.project_duration);
    if (data.name !== selected) {
      newSelected = data.name;
      setSelectedId(data.id);
    }
    setSelected(newSelected);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = (allData || [])?.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (!filteredRows?.length) {
      setRows([]);
      dispatch(setMessage("No Record(s) found!"));
    } else {
      setRows(filteredRows);
    }
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShowTasks = (e) => {
    if (e.id !== null) {
      dispatch(reload({ show: true, id: e.id }));
      dispatch(requestSingleProject({ id: e.id }));
    }
  };

  const handleCloseTask = () => {
    dispatch(reload({ show: false }));
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const storedData = useSelector((state) => state.storedData);
  const handleNewBoard = () => {
    dispatch(show(true));
    const requestBody = {
      name: storedData?.data?.name,
      buyer_company: storedData?.data?.buyer_company,
      project_value: storedData?.data?.project_value,
      target_close_date: new Date(storedData?.data?.target_close_date)
        ?.toJSON()
        ?.slice(0, 10)
        ?.replace(/-/g, "-"),
      owner: storedData?.data?.owner,
      is_template: "False",
    };
    dispatch(postProject({ data: requestBody }));
  };

  const isSelected = (id) => selectedId === id;

  const handleTemplateCopy = (e) => {
    const reqBody = {
      template_id: e.id,
      project_name: e.name + "-copy",
      project_value: e.project_value,
      to_template: true,
    };

    dispatch(cloneBoard({ data: reqBody, to_template: true }));
  };

  return (
    <>
      <div className="d-flex-wrap justify-space-around w-100">
        <SearchBar
          className="search-bar search"
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
        {!clone && (
          <div className="f-left">
            <FormControlLabel
              control={<Switch checked={archived} onChange={handleSwitch} />}
              label={
                <span>{!archived ? "Show" : "Hide"} Archived Templates</span>
              }
            />
          </div>
        )}
        {!clone && (
          <div className="f-left">
            <Tooltip title="Add New Template" placement="top" arrow>
              <Fab
                className="bg-[#627daf] text-[#ffffff]"
                size="small"
                onClick={handleOpen}
              >
                <Add className="h-[30px] w-[30px]" />
              </Fab>
            </Tooltip>
          </div>
        )}
        {!clone && (
          <div className="f-right">
            <Tooltip title="Refresh Table" placement="top" arrow>
              <IconButton onClick={doRefresh}>
                <RefreshRounded className="text-[#627daf] h-[30px] w-[30px]" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
      {allData?.length > 0 ? (
        <TableContainer className={classes.container}>
          <Table
            classes={classes.table}
            className="porjectTable"
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            stickyHeader
          >
            {rows?.length > 0 ? (
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={(event, value) => handleRequestSort(value)}
                clone={clone}
                rowCount={rows.length}
              />
            ) : (
              <div className="text-centre">
                <strong>{message.message}</strong>
              </div>
            )}
            <TableBody>
              {stableSort(
                rows.length > 0 ? rows : [],
                getComparator(order, orderBy)
              ).map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    role={clone && "checkbox"}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {clone && (
                      <StyledTableCell padding={clone ? "checkbox" : "none"}>
                        <Radio
                          checked={selectedId === row.id}
                          onChange={() => handleClick(row)}
                          value={row.id}
                          inputProps={{ "aria-labelledby": labelId }}
                          className={`radio-btn-${index} text-[#6385b7]`}
                        />
                      </StyledTableCell>
                    )}
                    {clone || archived ? (
                      <StyledTableCell align="left">
                        {row?.name}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell
                        component="th"
                        onClick={() => handleShowTasks({ id: row?.id })}
                        style={{
                          color: "#627daf",
                          fontWeight: "700",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        scope="row"
                      >
                        {row?.name}
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="right">
                      {row?.times_used_as_template}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row?.total_cards}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row?.board_document_count}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {getPlurals(
                        row?.project_duration == null
                          ? 0
                          : row?.project_duration,
                        "day"
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {currencyFormatter(
                        tenant_locale,
                        row?.project_value == null ? "0" : row?.project_value,
                        currency_symbol
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {dateFormat(new Date(row?.last_activity_dt))}
                    </StyledTableCell>
                    {!clone ? (
                      <StyledTableCell align="left">
                        {!archived && (
                          <>
                            <IconButton
                              onClick={() => handleShowTasks({ id: row?.id })}
                            >
                              <Edit className="text-[#627daf]" />
                            </IconButton>
                            <Tooltip title="Copy this template">
                              <IconButton
                                onClick={() => handleTemplateCopy(row)}
                              >
                                <LibraryBooksOutlined className="text-[#627daf]" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <IconButton onClick={() => handleOpenDialog(row)}>
                          <img
                            src={ArchiveIcon}
                            onMouseOver={(e) =>
                              (e.currentTarget.src = ArchiveDanger)
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.src = ArchiveIcon)
                            }
                            className="h-[20px] w-[20px]"
                          />
                        </IconButton>
                      </StyledTableCell>
                    ) : (
                      ""
                    )}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : loader.show ? (
        <Loader />
      ) : (
        <div className="text-centre">
          <strong>{message.message}</strong>
        </div>
      )}
      {selected ||
      (isCrmData?.data?.details == "Request Completed" && isCrm_id) ? (
        <EnhancedTableToolbar
          numSelected={selected}
          searched={searched}
          requestSearch={requestSearch}
          cancelSearch={cancelSearch}
          clone={clone}
          templateId={selectedId}
          company_id={selectedCompany}
          isCrm={isCrm}
          navbar={isNavbar}
          durationDays={durationDays}
        />
      ) : (
        <div>
          {clone && isCrmData?.data?.details == "Request Completed" && (
            <Button
              variant="contained"
              onClick={handleNewBoard}
              className="m-[12px] bg-[#627daf] text-[#ffffff] normal-case f-left"
            >
              + Create Project From Scratch
            </Button>
          )}
        </div>
      )}
      <AddForm open={open} handleclose={handleClose} />
      <AdditionalTableModal
        open={loaded_data?.data?.show}
        handleClose={handleCloseTask}
        refresh={doRefresh}
      />
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          dialogTitle={
            archiveData?.archived
              ? "UnArchive this template!"
              : "Archive this template!"
          }
          dialogContent={
            archiveData?.archived
              ? "Are you sure to unarchive this document?"
              : "Are you sure to archive this document?"
          }
        />
      )}
    </>
  );
}

export default React.memo(TemplatesLibrary);
