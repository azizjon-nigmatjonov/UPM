import { CircularProgress, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import TypographyWithIcon from '../../TypographyWithIcon';
import checklistService from '../../../services/checklistService';
import ChecklistRow from './ChecklistRow';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { useDispatch, useSelector } from 'react-redux';
import SButton from '../SButton';
import { taskTypeActions } from '../../../redux/slices/taskType.slice';
import './style.scss';

const ChecklistBlock = ({ checklist, setChecklist, subtaskId }) => {
  const dispatch = useDispatch()
  const checkListAreaRef = useRef();
  const isCheckListMenuOpen = useSelector((state) => state.taskType.isCheckListMenuOpen);
  const userId = useSelector((state) => state.auth.userInfo.id);
  const textFieldRef= useRef(null)

  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState('');

  const addNewChecklist = (e) => {
    e.preventDefault();
    const data = {
      creator_id: userId,
      status: 'NOT_DONE',
      subtask_id: subtaskId,
      title: value,
    };

    setLoader(true);
    checklistService
      .add(data)
      .then((res) => {
        setChecklist(
          res.checklist_items?.map((el) => ({
            ...el,
            status: el.status === 'DONE' ? true : false,
          }))
        );
        setValue('');
        checkListAreaRef.current.scrollTo(
          0,
          checkListAreaRef.current.scrollHeight
        );
      })
      .finally(() => {
        setLoader(false);
        handleMenuOpen()
      });
  };

  function handleMenuOpen () {
    dispatch(taskTypeActions.setIsCheckListMenuOpen(!isCheckListMenuOpen))
  }

  useEffect(() => {
    if (isCheckListMenuOpen) {
      textFieldRef?.current?.focus()
    }
  }, [isCheckListMenuOpen, textFieldRef])

  return (
    <div className='ChecklistBlockNew space-top'>
      <TypographyWithIcon
        className='title'
        icon={CheckBoxOutlinedIcon}
        variant='h6'
      >
        Checklist
      </TypographyWithIcon>

      <div className='checklist space-left'>
        <div className='rows-group' ref={checkListAreaRef}>
          {checklist?.map((checklistItem, index) => (
            <ChecklistRow
              visible={isCheckListMenuOpen}
              setVisible={handleMenuOpen}
              key={checklistItem.id}
              checklistItem={checklistItem}
              subtaskId={subtaskId}
              setChecklist={setChecklist}
              index={index}
            />
          ))}
        </div>

        <form onSubmit={addNewChecklist} className='create-row'>
          {isCheckListMenuOpen && (
            <TextField
              size='small'
              fullWidth
              style={{ marginRight: '20px' }}
              placeholder='Add checklist item'
              value={value}
              inputRef={textFieldRef}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
          <div className='btns'>
            <div className='add-btn'>
              <SButton
                disabled={loader}
                onClick={(e) => {
                  isCheckListMenuOpen ? addNewChecklist(e) : handleMenuOpen();
                }}
                title={isCheckListMenuOpen ? "Add" : "Add element"}
                icon={loader  && <CircularProgress size={25} />}
              >

              </SButton>
            </div>
            {isCheckListMenuOpen && (
              <div className='close-btn'>
                <SButton
                  title="Close"
                  disabled={loader}
                  onClick={(e) =>  handleMenuOpen()}
                >
                </SButton>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChecklistBlock;
