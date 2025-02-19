import React from 'react';
import PropTypes from 'prop-types';
import './my-node.css';
import { Avatar } from '@mui/material';

const propTypes = {
  nodeData: PropTypes?.object?.isRequired,
};

const MyNode = ({ nodeData }) => {
  return nodeData?.role == undefined ? (
    <p>Loading...</p>
  ) : (
    <div>
      <div className="d-flex position">
        <Avatar
          src={nodeData?.avatar}
          style={{ height: 25, width: 25, margin: 5 }}
        />
        <span>{nodeData?.first_name + ' ' + nodeData?.last_name}</span>
      </div>
      <div className="d-flex-column fullname">
        <strong>{nodeData?.role}</strong>
      </div>
    </div>
  );
};

MyNode.propTypes = propTypes;

export default React.memo(MyNode);
