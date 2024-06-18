import { Collapse } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import CreateRow from '../CreateRow';
import { useMemo, useState } from 'react';
import RowLinearLoader from '../../../../components/RowLinearLoader';
import CreateRowButton from '../../../../components/CreateRowButton';
import { applyDrag } from '../../../../utils/applyDrag';
import { Container, Draggable } from 'react-smooth-dnd';
import { useDispatch, useSelector } from 'react-redux';
import EpicsRow from './EpicRow';
import {
  createNewEpicAction,
  updateEpicOrderAction,
} from '../../../../redux/thunks/epic.thunk';
import './style.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { addMultipleTasksToSprintAction } from '../../../../redux/thunks/sprint.thunk';
import { useFormik } from 'formik';
import 'react-calendar/dist/Calendar.css';
import EpicEditModal from './EpicEditModal';

const EpicsBlock = ({ disableEdit, insideGantt, insideBacklog }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [createFormVisible, setCreateFormVisible] = useState();
  const [createLoader, setCreateLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const ganttPercent = useSelector((state) => state.gantt.ganttPercent);
  const epicsList = useSelector((state) => {
    if (ganttPercent === 'all') {
      return state.epic.list;
    } else if (ganttPercent === '0_25') {
      return state.epic.list.filter(
        (el) =>
          (el?.percent ? el?.percent : 0) <= 25 &&
          (el?.percent ? el?.percent : 0) >= 0
      );
    } else if (ganttPercent === '26_50') {
      return state.epic.list.filter(
        (el) => el.percent <= 50 && el.percent > 25
      );
    } else if (ganttPercent === '51_75') {
      return state.epic.list.filter(
        (el) => el.percent <= 75 && el.percent > 50
      );
    } else if (ganttPercent === '76_100') {
      return state.epic.list.filter(
        (el) => el.percent <= 100 && el.percent > 75
      );
    }
  });
  const loader = useSelector((state) => state.epic.loader);
  const sprintList = useSelector((state) => state.sprint.list);
  const selectedSubtasks = useSelector(
    (state) => state.subtask.selectedSubtasks
  );

  const formik = useFormik({
    initialValues: {
      title: '',
      start_date: {
        expected: '',
      },
      end_date: {
        expected: '',
      },
      color:  '#1ABC9C',
    },
  });

  const moveToSprintBtnDisabled = useMemo(() => {
    const sprintSteps = sprintList?.[0]?.steps;

    if (!selectedSubtasks?.length) return true;
    if (
      !sprintSteps?.[sprintSteps?.length - 1] ||
      sprintSteps?.[sprintSteps?.length - 1]?.confirmed
    ) {
      return true;
    }

    return false;
  }, [sprintList, selectedSubtasks]);

  const onCreateFormSubmit = () => {
    setCreateLoader(true);
    dispatch(
      createNewEpicAction({
        title: formik.values.title,
        start_date: {
          expected: formik.values?.start_date?.expected,
        },
        end_date: {
          expected: formik.values?.end_date?.expected,
        },
        color: formik.values.color,
        locked: -1,
      })
    )
      .unwrap()
      .then(() => setCreateFormVisible())
      .catch(() => setCreateLoader(false));
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(epicsList, dropResult);

    if (result) {
      dispatch(
        updateEpicOrderAction({
          list: result,
          ...dropResult,
        })
      );
    }
  };

  const moveSubtasksToSprint = () => {
    setBtnLoader(true);

    dispatch(addMultipleTasksToSprintAction()).then(() => setBtnLoader(false));
  };
  const handleClick = (e) => {
    setOpen(true);
  };

  
  return (
    <div
      className={`EpicsBlock silver-right-border ${
        insideGantt ? 'insideGantt' : ''
      }`}
    >
      {!disableEdit && (
        <div className='header silver-bottom-border'>
          <div className='title'>EPICS</div>
          <div className='extra'>
            <LoadingButton
              variant='outlined'
              color='primary'
              loadingPosition='start'
              className={`move-to-sprint-btn ${
                moveToSprintBtnDisabled ? 'disabled' : ''
              }`}
              loading={btnLoader}
              disabled={moveToSprintBtnDisabled}
              startIcon={<ReadMoreIcon color='primary' />}
              endIcon={
                selectedSubtasks?.length ? (
                  <div className='counter'>{selectedSubtasks?.length} </div>
                ) : (
                  <></>
                )
              }
              onClick={moveSubtasksToSprint}
            >
              Move to sprint
            </LoadingButton>

            <CreateRowButton
              // formVisible={createFormVisible}
              // setFunction={setCreateFormVisible}
              onClick={handleClick}
            />

            <EpicEditModal
              formik={formik}
              open={open}
              setOpen={setOpen}
              epicsList={epicsList}
              onCreateFormSubmit={onCreateFormSubmit}
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>
      )}

      <Collapse in={createFormVisible} className='silver-bottom-border'>
        <CreateRow
          onSubmit={onCreateFormSubmit}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder='Epic title'
        />
      </Collapse>

      <Container
        onDrop={onDrop}
        lockAxis='y'
        dragHandleSelector='.drag-handler-btn'
        dropPlaceholder={{ className: 'drag-row-drop-preview' }}
      >
        {epicsList?.map((epic, index) => (
          <Draggable key={epic.id} style={{ overflow: 'visible' }}>
            <EpicsRow
              key={epic.id}
              epic={epic}
              index={index}
              level={1}
              disableEdit={disableEdit}
              insideGantt={insideGantt}
              insideBacklog={insideBacklog}
            />
          </Draggable>
        ))}
      </Container>
    </div>
  );
};

export default EpicsBlock;
