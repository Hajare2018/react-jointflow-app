import { useState, useEffect } from 'react';
import Element from './components/Element';
import { FormContext } from './FormContext';
import { requestUpdateFormValues } from '../../Redux/Actions/create-project';
import { useDispatch } from 'react-redux';

function DynamicForm({ attributes, board }) {
  const dispatch = useDispatch();
  const [elements, setElements] = useState(null);
  useEffect(() => {
    setElements(attributes[0]);
  }, []);
  const { fields } = elements ?? {};
  const handleChange = (id, event, type) => {
    const newElements = { ...elements };
    newElements.fields.forEach((field) => {
      const { field_id } = field;
      if (id === field_id) {
        switch (type) {
          case 'checkbox':
            field['field_value'] = event.target.checked;
            break;
          case 'date':
            field['field_value'] = event;
            // TODO check this because by adding the break clause it might cause a bug
            break;
          default:
            field['field_value'] = event.target.value;
            break;
        }
      }
      setElements(newElements);
    });
  };
  const handleBlur = (id, value) => {
    const newElements = { ...attributes[0] };
    newElements.fields.forEach((field) => {
      const { field_id, field_value } = field;
      if (id === field_id) {
        if (id == 'multiselect' || field_value == value) {
          let arr = [];
          if (typeof value?.[0] === 'object') {
            value?.shift();
            arr.push(...value);
            handleupdate(id, value);
          } else {
            handleupdate(id, value);
          }
        } else if (field_value !== value) {
          handleupdate(id, value);
        } else {
          return;
        }
      }
    });
  };

  const handleupdate = (id, value) => {
    const reqBody = {
      attribute_name: id,
      attribute_value: value,
    };
    dispatch(requestUpdateFormValues({ board: board, data: reqBody }));
  };
  return (
    <FormContext.Provider value={{ handleChange, handleBlur }}>
      <div className="grid grid-cols-2 gap-x-4 p-4">
        {fields?.length > 0
          ? fields.map((field, i) => (
              <Element
                key={i}
                field={field}
                value={field.field_value}
              />
            ))
          : null}
      </div>
    </FormContext.Provider>
  );
}

export default DynamicForm;
