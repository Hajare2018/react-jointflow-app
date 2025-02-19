import React from 'react';

function AssigneeCount({ data, handleClick }) {
  return data?.ext_assignee_count == 0 ? (
    <div className="red-circle">{data?.ext_assignee_count}</div>
  ) : data?.ext_assignee_count == 1 ? (
    <div
      onClick={(event) => handleClick(event, data)}
      className="orange-circle cursor-pointer"
    >
      {data?.ext_assignee_count}
    </div>
  ) : data?.ext_assignee_count > 1 ? (
    <div
      onClick={(event) => handleClick(event, data)}
      className="green-circle cursor-pointer"
    >
      {data?.ext_assignee_count}
    </div>
  ) : (
    'NA'
  );
}

export default React.memo(AssigneeCount);
