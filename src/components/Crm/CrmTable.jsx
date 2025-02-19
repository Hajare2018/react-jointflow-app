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
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  displayCompanies,
  displayDialog,
  show,
} from "../../Redux/Actions/loader";
import "../Documents/DocumentsLibrary/document.css";
import {
  Button,
  IconButton,
  Radio,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { currencyFormatter, dateFormat } from "../Utils";
import SearchBar from "../../component-lib/SearchBar/SearchBar";
import {
  fetchCrmCompany,
  fetchCrmDeals,
  fetchCrmDealsBySearch,
  fetchCrmStages,
} from "../../Redux/Actions/crm-data";
import TemplatesTable from "../Documents/TemplatesLibrary/TemplatesTable";
import CompanyList from "./CompanyList";
import { FaListUl } from "react-icons/fa";
import {
  CloudDoneOutlined,
  CloudDownload,
  CloudDownloadOutlined,
} from "@mui/icons-material";
import { stableSort, getComparator } from "../../component-lib/JFTable/JFTable";
import { useTenantContext } from "../../context/TenantContext";

function EnhancedTableHead({ classes, order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: "dealname",
      numeric: false,
      disablePadding: false,
      label: "Deal Name",
    },
    { id: "amount", numeric: true, disablePadding: false, label: `Deal Value` },
    {
      id: "closedate",
      numeric: true,
      disablePadding: false,
      label: "Close Date",
    },
  ];

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
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
  selected_deal_id,
  data,
  company,
}) => {
  const dispatch = useDispatch();
  const showCompanies = useSelector((state) => state.companies);
  const showDialog = useSelector((state) => state.dialog);
  const handleCloningDeals = () => {
    dispatch(show(true));
    const requestBody = {
      crm: company,
      deal_id: selected_deal_id,
    };
    const cloneReqBody = {
      deal_name: data?.dealname,
      deal_val: data?.amount,
      target_end_date: data?.closedate,
      crm_id: selected_deal_id,
    };
    dispatch(fetchCrmCompany({ data: requestBody, cloneData: cloneReqBody }));
  };
  const closeDialog = () => {
    dispatch(displayDialog(false));
  };
  const closeCompanies = () => {
    dispatch(displayCompanies(false));
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
              onClick={() => handleCloningDeals()}
              style={{
                backgroundColor: "#6385b7",
                color: "#ffffff",
                fontSize: 16,
                float: "right",
              }}
            >
              NEXT
            </Button>
          </div>
        ) : (
          ""
        )}
      </Toolbar>
      <TemplatesTable show={showDialog?.show} handleHide={closeDialog} forCrm />
      <CompanyList open={showCompanies?.show} handleClose={closeCompanies} />
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#eef2f6",
    color: theme.palette.common.black,
    fontWeight: "700",
  },
  body: {
    fontSize: 16,
    height: 40,
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
    maxHeight: `65vh`,
    "@media(max-height: 1080px)": {
      maxHeight: `88vh`,
    },
    "@media(max-height: 1024px)": {
      maxHeight: `83vh`,
    },
    "@media(max-height: 900px)": {
      maxHeight: `70vh`,
    },
    "@media(max-height: 768px)": {
      maxHeight: `57vh`,
    },
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

function CrmTable() {
  const {
    crm_system,
    tenant_locale,
    currency_symbol,
    hubspot_pipeline_id,
    sfdc_import_stage,
    mscrm_import_stage,
  } = useTenantContext();
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.crmDealsData);
  const crmDealsDataBySearch = useSelector(
    (state) => state.crmDealsDataBySearch
  );
  const crm_data = data?.data?.deals;
  const crm_data_by_search = crmDealsDataBySearch?.data?.deals;
  console.log("crm_data", crm_data);
  console.log("crmDealsDataBySearch", crm_data_by_search);

  const importedDeals = crm_data?.filter(
    (deal) => deal.already_imported === false
  );
  // const importedDealsBySearch = crm_data_by_search?.filter(
  //   (deal) => deal.already_imported === false
  // );
  const [deals, setDeals] = useState(null);
  console.log("deals", deals);
  const [stage, setStage] = useState(null);
  const [rows, setRows] = useState(deals);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("amount");
  const [selected, setSelected] = React.useState("");
  const [selectedDeal, setSelectedDeal] = React.useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [searched, setSearched] = useState("");
  const [selectedData, setSelectedData] = React.useState({});
  const [display, setDisplay] = useState("list_view");

  const crm_stages = useSelector((state) => state.crmStatusData);
  const stageData =
    crm_stages?.data?.stages?.length > 0 ? crm_stages?.data?.stages : [];
  const message = useSelector((state) => state.messageData);

  const debounceTimeout = useRef(null);

  const toggleDisplay = (view) => {
    setDisplay(view);
    if (view === "list_view") {
      setDeals(crm_data);
    }
    if (view === "imported_deals") {
      setDeals(importedDeals);
    }
  };
 
  const requestSearch = (searchedVal) => {
    if (crm_system === "hubspot") {
      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        // Only call API when input length is 3 or more
        if (searchedVal.length >= 3) {
          const params = {
            crm_name: "hubspot",
            search_text: searchedVal,
          };
          dispatch(fetchCrmDealsBySearch(params));
        } else {
          setDeals(crm_data); // Reset to full data when search length is less than 3
          setRows(crm_data);
        }
      }, 250); // 250ms debounce delay
    } else {
      // Local filtering logic for non-HubSpot systems
      if (searchedVal.length >= 3) {
        const filteredRows = deals?.filter((row) =>
          row.dealname.toLowerCase().includes(searchedVal.toLowerCase())
        );
        setRows(filteredRows);
      } else {
        setRows(deals); // Reset rows to show all deals when search is less than 3 characters
      }
    }
  };

  useEffect(() => {
    if (crmDealsDataBySearch?.data?.deals) {
      setDeals(crmDealsDataBySearch.data.deals); // Update state with search results
      setRows(crmDealsDataBySearch.data.deals); // Update rows with search results
    }
  }, [crmDealsDataBySearch]);

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleClick = (event, data) => {
    let newSelected = selected;
    if (data?.dealname !== selected) {
      newSelected = data?.dealname;
      setSelectedDeal(data?.dealname);
      setSelectedId(data?.id);
      setSelectedData(data);
    }
    setSelected(newSelected);
  };

  const handleStage = (event) => {
    setSelectedDeal("");
    setSelectedId(0);
    setSelectedData({});
    setStage(event.target.value);
    setDeals([]);
    setRows([]);
    dispatch(
      fetchCrmDeals({
        crm_name: crm_system,
        stage: event.target.value,
        next: 0,
      })
    );
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  useEffect(() => {
    setSelectedId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (data?.data?.deals?.length > 0) {
      if (display === "list_view") {
        if (data?.data?.more && deals?.length > 0) {
          setDeals([...deals, ...data?.data?.deals]);
        } else {
          setDeals(data?.data?.deals);
        }
      }
      if (display === "imported_deals") {
        if (data?.data?.more && deals?.length > 0) {
          setDeals([...deals, ...importedDeals]);
        } else {
          setDeals(importedDeals);
        }
      }
    }
  }, [display, data]);

  useEffect(() => {
    if (crm_system !== undefined) {
      let pipeline_id = "default";

      if (crm_system === "hubspot" && hubspot_pipeline_id) {
        pipeline_id = hubspot_pipeline_id;
      }

      if (crm_system === "salesforce") {
        pipeline_id = sfdc_import_stage;
      }

      if (crm_system === "mscrm") {
        pipeline_id = mscrm_import_stage;
      }

      dispatch(
        fetchCrmStages({
          crm_name: crm_system,
          pipeline_id,
        })
      );
    }
  }, []);

  const loadMore = () => {
    setRows([]);
    dispatch(
      fetchCrmDeals({
        crm_name: crm_system,
        stage: stage,
        next: data?.data?.next,
      })
    );
  };

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  const isSelected = (dealname) => selected.indexOf(dealname) !== -1;

  return (
    <main className="panel-view">
      <div
        className="overview"
        style={{
          position: "sticky",
          top: 60,
          zIndex: 4,
        }}
      >
        <div className="d-flex p-3">
          <h1 className="text-2xl" style={{ float: "left" }}>
            IMPORT A CRM DEAL
          </h1>
        </div>
      </div>
      <div className="d-flex justify-space-between">
        {/* <div>
          <SearchBar
            className="search-bar"
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
        </div> */}
        <div>
          <SearchBar
            className="search-bar"
            value={searched}
            onChange={(searchVal) => {
              setSearched(searchVal); // Update the local state to reflect the current input value
              requestSearch(searchVal); // Call the updated search logic
            }}
            onCancelSearch={() => {
              setSearched(""); // Clear the search input
              requestSearch(searched);
              requestSearch(""); // Reset the search results
            }}
          />
        </div>
        <div className="d-flex selectbox selectbox-m">
          <label className="form-label" style={{ width: 145, color: "#222" }}>
            Deal Stage:
          </label>
          <select
            className="text-input"
            style={{ color: "#000000" }}
            value={stage}
            onChange={handleStage}
          >
            <option value="Stage" disabled={stage !== null}>
              Select A Stage
            </option>
            {stageData?.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", margin: "10px 0px 0px 10px" }}>
          <div
            style={{
              height: 40,
              width: 40,
              display: "flex",
              justifyContent: "center",
              borderRadius: "10px 0px 0px 10px",
              backgroundColor: display === "list_view" ? "#6385b7" : "#dadde9",
            }}
          >
            <Tooltip title={"Show List View"} placement="top" arrow>
              <IconButton onClick={() => toggleDisplay("list_view")}>
                <FaListUl
                  style={{
                    color: display === "list_view" ? "#ffffff" : "#6385b7",
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              height: 40,
              width: 40,
              display: "flex",
              justifyContent: "center",
              borderRadius: "0px 10px 10px 0px",
              backgroundColor:
                display === "imported_deals" ? "#6385b7" : "#dadde9",
            }}
          >
            <Tooltip title={"Hide Imported Deals"} placement="top" arrow>
              <IconButton onClick={() => toggleDisplay("imported_deals")}>
                <CloudDownload
                  style={{
                    height: 30,
                    width: 30,
                    color: display === "imported_deals" ? "#ffffff" : "#6385b7",
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      {deals?.length > 0 ? (
        <TableContainer className={`${classes.container} mt-2`}>
          <Table
            className="porjectTable"
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            stickyHeader
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(
                rows?.length > 0 ? rows : deals,
                getComparator(order, orderBy)
              ).map((row, index) => {
                const isItemSelected = isSelected(row.dealname);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow
                    onClick={(event) => {
                      handleClick(event, row);
                    }}
                    role={"checkbox"}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <StyledTableCell padding={"checkbox"}>
                      <Radio
                        checked={isItemSelected}
                        style={{ color: "#6385b7" }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{row?.dealname}</StyledTableCell>
                    <StyledTableCell align="right">
                      {currencyFormatter(
                        tenant_locale,
                        row?.amount == null ? 0 : row?.amount,
                        currency_symbol
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="d-flex justify-between">
                        {row.closedate == "" ? "NA" : dateFormat(row.closedate)}
                        {row?.already_imported ? (
                          <Tooltip title="Already Imported" placement="top">
                            <CloudDoneOutlined style={{ color: "green" }} />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Not Imported" placement="top">
                            <CloudDownloadOutlined
                              style={{ color: "#aeaeae" }}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          {data?.data?.more && (
            <div className="d-flex justify-centre mt-4">
              <button onClick={loadMore} className="app-color">
                <strong>Load more...</strong>
              </button>
            </div>
          )}
        </TableContainer>
      ) : (
        <div className="text-centre mt-20">
          <strong>{message.message}</strong>
        </div>
      )}
      {selected && (
        <EnhancedTableToolbar
          numSelected={selectedDeal}
          selected_deal_id={selectedId}
          searched={searched}
          cancelSearch={cancelSearch}
          requestSearch={requestSearch}
          data={selectedData}
          company={crm_system}
        />
      )}
    </main>
  );
}

export default React.memo(CrmTable);
