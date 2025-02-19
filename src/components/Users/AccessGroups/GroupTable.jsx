import { IconButton, Radio, Tooltip } from '@mui/material';
import { Check, Edit } from '@mui/icons-material';
import React from 'react';
import { useSelector } from 'react-redux';
import ArchiveIcon from '../../../assets/icons/archive.png';
import ArchiveDanger from '../../../assets/icons/archive_danger.png';

function GroupTable({ data, onPress }) {
  const allPermissions = useSelector((state) => state.accessPermissionsData);
  const allPermissionsData = allPermissions?.data?.length > 0 ? allPermissions?.data : [];
  const handleClick = (event) => {
    onPress(event);
  };
  return (
    <div className="table-responsive">
      <table className="table table-header-rotated">
        {(data?.length && (
          <thead>
            <tr>
              <th>
                <p>Access</p>
                <p>Groups</p>
                <p>Permissions</p>
              </th>
              {allPermissionsData?.map((permission) => (
                // TODO FIXME
                // eslint-disable-next-line react/jsx-key
                <th className="rotate">
                  <Tooltip
                    title={permission.name}
                    placement="top"
                    arrow
                  >
                    <div>
                      <span>
                        {permission.name.length > 18
                          ? permission.name.substring(0, 18 - 3) + '...'
                          : permission.name}
                      </span>
                    </div>
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>
        )) || (
          <div className="text-centre">
            <strong>No Record found!</strong>
          </div>
        )}
        <tbody>
          {data?.map((access) => (
            // TODO FIXME
            // eslint-disable-next-line react/jsx-key
            <tr>
              <th className="column-header">
                <span>{access.name}</span>
              </th>
              {access.group_rights?.map((right) => (
                // TODO FIXME
                // eslint-disable-next-line react/jsx-key
                <th className="row-header">
                  {right[1] === true ? (
                    <span
                      onClick={() =>
                        handleClick({
                          deletePermission: true,
                          selected_id: right[3],
                          permission_name: right[0],
                          group_name: access?.name,
                          group: access?.id,
                        })
                      }
                    >
                      <Check
                        style={{ color: '#627daf', width: 25, height: 25, cursor: 'pointer' }}
                      />
                    </span>
                  ) : (
                    <span
                      onClick={() =>
                        handleClick({
                          addPermission: true,
                          selected_id: right[2],
                          permission_name: right[0],
                          group_name: access?.name,
                          group: access?.id,
                        })
                      }
                    >
                      <Radio
                        checked={false}
                        style={{ color: 'grey', cursor: 'pointer' }}
                      />
                    </span>
                  )}
                </th>
              ))}
              <th className="row-header">
                {!access?.archived ? (
                  <IconButton
                    style={{ padding: 8 }}
                    onClick={() => handleClick({ edit: true, selected_id: access?.id })}
                  >
                    <Edit style={{ color: '#627daf' }} />
                  </IconButton>
                ) : (
                  ''
                )}
                <IconButton
                  style={{ padding: 8 }}
                  onClick={() =>
                    handleClick({
                      handleArchive: true,
                      archive: access?.archived ? false : true,
                      selected_id: access?.id,
                    })
                  }
                >
                  <img
                    src={ArchiveIcon}
                    onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                    onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                    style={{ width: 20, height: 20 }}
                  />
                </IconButton>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(GroupTable);
