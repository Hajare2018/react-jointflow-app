import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import postProject, { updateProject } from '../../../Redux/Actions/create-project';
import { show } from '../../../Redux/Actions/loader';
import { useUserContext } from '../../../context/UserContext';
import { useTenantContext } from '../../../context/TenantContext';

function EditForm({ forTable, close }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: '',
    project_value: '',
    description: '',
    selectedType: null,
  });
  const project = useSelector((state) => state?.singleProjectData);
  const loader = useSelector((state) => state?.showLoader);
  const projectData = project?.data?.length > 0 ? project?.data?.[0] : [];
  const { project_type_list: projectTypeList } = useTenantContext();
  const { user } = useUserContext();

  useEffect(() => {
    if (forTable) {
      setForm({
        title: projectData?.name,
        project_value: projectData?.project_value,
        description: projectData?.description,
        selectedType: projectData?.project_type,
      });
    } else {
      setForm({
        title: '',
        project_value: '',
        description: '',
        selectedType: null,
      });
    }
  }, [project]);

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleTemplateCreation = () => {
    dispatch(show(true));
    if (forTable) {
      const editReqBody = {
        project_value: form.project_value,
        name: form.title,
        description: form.description,
        owner: user?.id,
        project_type: form.selectedType,
        archived: projectData?.archived,
      };
      dispatch(
        updateProject({
          id: projectData?.id,
          data: editReqBody,
          filterByTemplate: true,
          archivedTemplates: false,
          closedBoards: false,
        }),
      );
    } else {
      const addReqBody = {
        project_value: form.project_value,
        name: form.title,
        is_template: 'True',
        owner: user?.id,
        project_type: form.selectedType,
        description: form.description,
        archived: 'False',
      };
      dispatch(
        postProject({
          id: projectData?.id,
          data: addReqBody,
          filterByTemplate: true,
          archivedTemplates: false,
          closedBoards: false,
        }),
      );
      if (!loader.show) {
        setForm({
          title: '',
          project_value: '',
          selectedType: null,
          description: '',
        });
        close();
      }
    }
  };
  return (
    <div
      style={{
        borderRadius: '0.5rem',
        padding: forTable ? '' : 10,
      }}
      className="d-flex-column"
    >
      <div className="addNewUserWrapad flex items-center gap-x-4">
        <div style={{ flex: 3 }}>
          <label className="form-label">Title</label>
          <input
            type="text"
            className={'comment-form-control'}
            name="title"
            value={form.title}
            onChange={handleForm}
            maxLength={'80'}
          />
        </div>
        <div style={{ flex: 3 }}>
          <label className="form-label">Average Value</label>
          <input
            type="number"
            className={'comment-form-control'}
            name="project_value"
            value={form.project_value}
            onChange={handleForm}
          />
        </div>
        <div style={{ flex: 3 }}>
          <label className="form-label">Project Type</label>
          <select
            className="text-input task-type mr-3"
            style={{ color: '#000000', height: 47 }}
            name={'selectedType'}
            value={form.selectedType}
            onChange={handleForm}
          >
            <option>Select</option>
            {(projectTypeList || [])?.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>
        {forTable && (
          <div
            style={{
              flex: 1,
              marginTop: 22,
            }}
          >
            <Button
              variant="contained"
              onClick={handleTemplateCreation}
              style={{
                backgroundColor: '#6385b7',
                color: '#ffffff',
                fontSize: 16,
              }}
            >
              Update
            </Button>
          </div>
        )}
      </div>
      {!forTable && (
        <div className="addNewUserWrapad d-flex-row justify-space-around">
          <div style={{ flex: 5, marginRight: 20 }}>
            <label className="form-label">Description</label>
            <textarea
              type="text"
              className={'comment-form-control'}
              name="description"
              value={form.description}
              onChange={handleForm}
            />
          </div>
          <div
            style={{
              flex: 5,
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="contained"
              onClick={handleTemplateCreation}
              style={{
                backgroundColor: '#6385b7',
                color: '#ffffff',
                fontSize: 16,
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(EditForm);
