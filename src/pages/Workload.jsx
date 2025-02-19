import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WorkloadTable from '../components/Workload/WorkloadTable';
import requestProject from '../Redux/Actions/dashboard-data';
import { requestDocumentsType } from '../Redux/Actions/documents-type';
import { show } from '../Redux/Actions/loader';

function Workload() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state?.dashboardData);
  const task_data = tasks?.data?.length > 0 ? tasks?.data : [];
  const [data, setData] = useState([]);
  const task_types = useSelector((state) => state?.documentsType);
  const allTypes = task_types?.data?.length > 0 ? task_types?.data : [];
  const only_actives = allTypes?.filter((type) => type.active === true);
  const active_types = only_actives?.filter(
    (type) => type.applies_to === 'Both' || type.applies_to === 'Tasks',
  );
  const [type, setType] = useState('Task Type');

  useEffect(() => {
    dispatch(show(true));
    dispatch(requestDocumentsType());
  }, []);

  useEffect(() => {
    if (type !== 'Task Type') {
      setData(task_data);
    } else {
      setData([]);
    }
  }, [tasks]);

  const handleType = (event) => {
    dispatch(show(true));
    if (event.target.value !== 'Task Type') {
      dispatch(
        requestProject({
          task_type__asc_ordering: event.target.value,
          orderBy: 'board__priority',
        }),
      );
      setType(event.target.value);
      setData(task_data);
    } else {
      return;
    }
  };

  return (
    <main
      id="page"
      className="panel-view"
    >
      <div
        className="overview insightPage"
        style={{
          position: 'sticky',
          top: 20,
          backgroundColor: '#f9fbfd',
          zIndex: 4,
        }}
      >
        <div className="project-header">
          <h1 className="overview__heading">Workload Prioritisation</h1>
          <div className="d-flex mt-20 mb-20 selectbox selectbox-m">
            <label
              className="form-label"
              style={{ width: 120, color: '#222' }}
            >
              Filter by:
            </label>
            <select
              className="form-select"
              style={{ color: '#000000' }}
              value={type}
              onChange={handleType}
            >
              <option
                value="Task Type"
                disabled
                aria-disabled
              >
                Task Type
              </option>
              {active_types?.map((item) => (
                <option
                  key={item.custom_label}
                  value={item.custom_label}
                >
                  {item.custom_label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="data-table-container">
        {data?.length > 0 ? (
          <WorkloadTable
            data={data}
            task_type={type}
          />
        ) : (
          <div
            className="d-flex justify-centre"
            style={{ marginTop: 120 }}
          >
            {type === 'Task Type' ? (
              <strong>Please select a Task Type above</strong>
            ) : (
              <strong>No Data available for {type}, Please select another one!</strong>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default React.memo(Workload);
