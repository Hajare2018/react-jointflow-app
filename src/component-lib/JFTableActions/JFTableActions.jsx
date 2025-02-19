import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { Tooltip } from '@mui/material';
import { CSVLink } from 'react-csv';
import { GetAppOutlined } from '@mui/icons-material';
import Filters from './Filters';
import ViewOptions from '../ViewOptions/ViewOptions';

export default function JFTableActions(props) {
  const {
    searchText,
    handleSearchTextChange,
    handleCancelSearch,
    filters = [],
    handleViewChange,
    viewOptionValue,
    viewOptions,
    exportData,
    otherActions = null,
  } = props;

  return (
    <div className="d-flex justify-space-between">
      <div
        className="d-flex"
        style={{ gap: 16 }}
      >
        {handleSearchTextChange ? (
          <SearchBar
            className="search-bar search"
            value={searchText}
            onChange={handleSearchTextChange}
            onCancelSearch={handleCancelSearch}
          />
        ) : null}
        <Filters filters={filters} />
      </div>
      <div
        className="d-flex"
        style={{ gap: 16 }}
      >
        {otherActions}
        {exportData ? (
          <Tooltip
            title="Export to Excel"
            arrow
            placement="top"
          >
            <div>
              <CSVLink
                data={exportData}
                filename={`JF_Projects_Export_${new Date().toLocaleDateString()}`}
              >
                <div
                  style={{
                    borderRadius: '50%',
                    backgroundColor: '#6385b7',
                    padding: 8,
                  }}
                >
                  <GetAppOutlined className="white-color" />
                </div>
              </CSVLink>
            </div>
          </Tooltip>
        ) : null}
        <ViewOptions
          handleChange={handleViewChange}
          value={viewOptionValue}
          options={viewOptions}
        />
      </div>
    </div>
  );
}
