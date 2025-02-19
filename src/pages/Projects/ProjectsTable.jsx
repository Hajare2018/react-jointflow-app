import JFTable from '../../component-lib/JFTable/JFTable';
import { Tooltip, Avatar } from '@mui/material';
import { FaIcons } from 'react-icons/fa';
import {
  createImageFromInitials,
  currencyFormatter,
  dateFormat,
  getForecastStatus,
  findPercentage,
} from '../../components/Utils';
import AssigneeCount from '../../components/AssigneeCount';
import AppProgressbar from '../../components/AppProgressbar';
import { MoreVertOutlined } from '@mui/icons-material';
import AssigneeModal from '../../components/AssigneeModal';
import { useTenantContext } from '../../context/TenantContext';

export default function ProjectsTable(props) {
  const {
    data,
    orderedBy,
    orderDirection,
    onHeaderCellClick,
    showingClosedProjects,
    onProjectClick,
    onMoreActionsClick,
    handleShowAssignees,
    handleHideAssignees,
    boardData,
    assign_id,
    showAssignees,
    anchorAssignee,
    allAssignees,
  } = props;
  const { tenant_locale, currency_symbol } = useTenantContext();
  const columns = [
    {
      id: 'name',
      label: 'Name',
      cell: (row) => (
        <div className="d-flex">
          <Tooltip
            title={
              row?.buyer_company_details_light == null
                ? 'No Company'
                : row?.buyer_company_details_light?.name
            }
            placement="top"
          >
            {row?.buyer_company_details_light == null ? (
              <Avatar style={{ height: 22, width: 22 }}>
                <FaIcons.FaIndustry
                  style={{
                    color: '#627daf',
                    height: 18,
                    width: 18,
                  }}
                />
              </Avatar>
            ) : (
              <Avatar
                style={{ height: 22, width: 22 }}
                src={
                  row?.buyer_company_details_light?.company_image === null
                    ? createImageFromInitials(
                        300,
                        row?.buyer_company_details_light?.name,
                        '#627daf',
                      )
                    : row?.buyer_company_details_light?.company_image
                }
              />
            )}
          </Tooltip>
          <Tooltip
            title={row?.name}
            placement="top"
          >
            <h4
              onClick={() => onProjectClick({ id: row.id })}
              style={{
                cursor: 'pointer',
                color: '#6385b7',
                fontWeight: '700',
                marginLeft: 10,
                maxWidth: 200,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {/* {row?.name?.length > 30 ? (row?.name).substring(0, 30 - 3) + '...' : row?.name} */}
              {row.name}
            </h4>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 'project_value',
      label: 'Value',
      align: 'right',
      cell: (row) =>
        currencyFormatter(
          tenant_locale,
          row?.project_value == null ? 0 : row?.project_value,
          currency_symbol,
        ),
    },
    { id: 'owner_name', label: 'Owner' },
    {
      id: 'ext_assignee_count',
      label: 'MAAP Contacts',
      cell: (row) => (
        <>
          <AssigneeCount
            data={row}
            handleClick={handleShowAssignees}
          />
          {row?.id === boardData?.id && (
            <AssigneeModal
              id={assign_id}
              show={showAssignees}
              anchor={anchorAssignee}
              handleClose={handleHideAssignees}
              assignee_team={allAssignees?.data?.[0]?.ext_assignee_team}
            />
          )}
        </>
      ),
    },
    {
      id: 'target_close_date',
      label: 'Target Close Date',
      cell: (row) => dateFormat(new Date(row?.target_close_date)),
    },
    showingClosedProjects
      ? {
          id: 'actual_close_date',
          label: 'Actual End Date',
          cell: (row) =>
            row.actual_close_date !== null
              ? dateFormat(new Date(row?.actual_close_date))
              : 'Unavailable',
        }
      : {
          id: 'board_likely_end_date',
          label: 'Projected End Date',
          cell: (row) =>
            row.board_likely_end_date !== null
              ? dateFormat(new Date(row?.board_likely_end_date))
              : 'Unavailable',
        },
    {
      id: 'forecast_status',
      label: 'Forecast Status',
      cell: (row) => (
        <strong
          style={{
            color: getForecastStatus(row.forecast_status),
          }}
        >
          {row?.forecast_status?.charAt(0)?.toUpperCase() + row?.forecast_status?.slice(1)}
        </strong>
      ),
    },
    {
      id: 'left_tasks',
      label: 'Tasks Left',
      cell: (row) => (
        <div
          className="d-flex"
          style={{ justifyContent: 'space-between' }}
        >
          <AppProgressbar
            value={findPercentage(row?.total_closed_cards, row?.total_cards)}
            forBoards
          />
          <Tooltip
            title={`${findPercentage(row?.total_closed_cards, row?.total_cards)}% completed`}
            placement="top"
            arrow
          >
            <strong
              style={{
                float: 'left',
                marginLeft: '1rem',
              }}
            >
              {row?.left_cards}/{row?.total_cards}
            </strong>
          </Tooltip>
        </div>
      ),
    },
    {
      id: '',
      label: '',
      cell: (row) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={(event) => onMoreActionsClick(event, row)}
        >
          <MoreVertOutlined />
        </div>
      ),
    },
  ];

  return (
    <JFTable
      data={data}
      columns={columns}
      onHeaderCellClick={onHeaderCellClick}
      orderedBy={orderedBy}
      orderDirection={orderDirection}
    />
  );
}
