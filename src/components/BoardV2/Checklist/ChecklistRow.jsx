import { Checkbox, MenuItem, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import ButtonsPopover from '../../ButtonsPopover';
import checklistService from '../../../services/checklistService';
import CreateRow from './CreateRow';
import './style.scss';
const ChecklistRow = ({ index, checklistItem, subtaskId, setChecklist, visible, setVisible = () => {} }) => {
  const [loader, setLoader] = useState(false);
  const [textFieldVisible, setTextFieldVisible] = useState(false);
  const [checkboxLoader, setCheckboxLoader] = useState(false);
  const [checkboxStatus, setCheckboxStatus] = useState(false);

  const deleteChecklist = () => {
    setLoader(true);

    checklistService
      .delete(subtaskId, checklistItem.id)
      .then((res) => {
        setChecklist((prev) =>
          prev?.filter((el) => el.id !== checklistItem.id)
        );
      })
      .catch(() => setLoader(false));
  };

  const updateChecklistTitle = ({ title }) => {
    setLoader(true);

    const data = {
      ...checklistItem,
      subtask_id: subtaskId,
      title,
      status: checklistItem.status ? 'DONE' : 'NOT_DONE',
    };

    checklistService
      .update(data)
      .then((res) => {
        setChecklist((prev) =>
          prev?.map((el) => {
            if (el.id !== checklistItem.id) return el;
            return {
              ...checklistItem,
              title,
            };
          })
        );
        setTextFieldVisible(false);
      })
      .finally(() => setLoader(false));
  };

  const updateChecklistStatus = (status) => {
    setCheckboxLoader(true);

    const data = {
      ...checklistItem,
      subtask_id: subtaskId,
      status: status ? 'DONE' : 'NOT_DONE',
    };

    checklistService
      .update(data)
      .then((res) => {
        setChecklist((prev) =>
          prev?.map((el) => {
            if (el.id !== checklistItem.id) return el;
            return {
              ...checklistItem,
              status: status,
            };
          })
        );
      })
      .finally(() => setCheckboxLoader(false));
  };

  return (
    <MenuItem className='row'>
      {textFieldVisible ? (
        <div className='' style={{ width: 'calc(100% - 40px)' }}>
          <CreateRow
            visible={visible}
            setVisible={setVisible}
            initialTitle={checklistItem.title}
            onSubmit={updateChecklistTitle}
            loader={loader}
          />
        </div>
      ) : (
        <>
        <div className='left'>
          <Checkbox
            checked={checklistItem?.status}
            onChange={(_, val) => updateChecklistStatus(val)}
          />
          <div className='label'>
            {index + 1}. {checklistItem.title}
          </div>
          </div>
          <div className='show-on-hover'>
            <ButtonsPopover
              onDeleteClick={deleteChecklist}
              onEditClick={() => setTextFieldVisible(true)}
              loading={loader}
            />
          </div>
        </>
      )}
    </MenuItem>
  );
};

export default ChecklistRow;
