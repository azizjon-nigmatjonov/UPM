import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CancelButton from '../../../components/Buttons/CancelButton';
import CreateButton from '../../../components/Buttons/CreateButton';
import FiltersBlock from '../../../components/FiltersBlock';
import sprintService from '../../../services/sprintService';
import subtaskService from '../../../services/subtaskService';
import SprintSelect from '../../../components/Selects/SprintSelect';
import { sortByOrderNumber } from '../../../utils/sortByOrderNumber';
import DraggableTable from './DraggableTable';
import DraggableTable2 from './DraggableTable2';
import Filters from './Filters';
import { useParams } from 'react-router-dom';
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs';

const ListView = () => {
  const { projectId } = useParams();
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [lists, setLists] = useState(null);
  const [lists2, setLists2] = useState([]);
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(null);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [filters, setFilters] = useState({
    epics: '',
    stages: '',
    tasks: '',
    search: '',
  });

  // useSelector
  const selectedSprint = useSelector((state) => state.sprint.selectedSprintId);

  const getAll = (combine = false) => {
    setLoader(true);
    subtaskService
      .getListView({
        limit: 15,
        offset: page,
        project_id: projectId,
        epic_ids: filters.epics ? [filters.epics] : [],
        stage_ids: filters.stages ? [filters.stages] : [],
        task_ids: filters.tasks ? [filters.tasks] : [],
      })
      .then((res) => {
        setCount(res.count);
        if (combine) setLists2((prev) => [...lists2, ...res.subtasks]);
        else setLists2(res.subtasks);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  const getStep = () => {
    setLoader(true);
    sprintService
      .getById(selectedSprint)
      .then((res) => {
        const lastStep = res.steps?.pop();
        setStep(lastStep);
        setLists(lastStep?.sprint_subtask_items.sort(sortByOrderNumber));
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (selectedSprint && tabIndex === 0) getStep();
  }, [selectedSprint, tabIndex]);

  useEffect(() => {
    if (tabIndex === 1) {
      getAll();
      setPage(0);
      setLists2([]);
    } 
  }, [filters, tabIndex]);

  useEffect(() => {
    setFilters({
      epics: '',
      stages: '',
      tasks: '',
    });
  }, [tabIndex]);

  useEffect(() => {
    if (tabIndex === 1) getAll(true);
  }, [page]);

  return (
    <div className='listView'>
      <div className='TTab'>
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList>
            <Tab className='ttab'>
              <div className='with-icon'>Sprint</div>
            </Tab>
            <Tab className='ttab'>
              <div className='with-icon'>All tasks</div>
            </Tab>
          </TabList>

          {/* SPRINT */}
          <TabPanel>
            <FiltersBlock
              children={
                <>
                  <SprintSelect />
                </>
              }
              extra={[
                addingSubtask ? (
                  <CancelButton
                    onClick={() => {
                      setAddingSubtask(false);
                    }}
                  />
                ) : (
                  <CreateButton
                    title='Add subtask'
                    onClick={() => setAddingSubtask(true)}
                  />
                ),
              ]}
            />

            <div style={{ padding: '10px', borderRadius: '0px' }}>
              <Card style={{ padding: '0px', borderRadius: '0px' }}>
                <DraggableTable
                  loader={loader}
                  lists={lists}
                  setLists={setLists}
                  step={step}
                  stepID={step ? step?.id : null}
                  projectSprintStepID={
                    step ? step?.project_sprint_step_id : null
                  }
                  getStep={getStep}
                  setLoader={setLoader}
                  addingSubtask={addingSubtask}
                  setAddingSubtask={setAddingSubtask}
                />
              </Card>
            </div>
          </TabPanel>

          {/* ALL TASKS */}
          <TabPanel>
            <FiltersBlock
              children={
                <>
                  <Filters
                    setLoader={setLoader}
                    filters={filters}
                    setFilters={setFilters}
                    projectId={projectId}
                  />
                </>
              }
              extra={[
                addingSubtask ? (
                  <CancelButton
                    onClick={() => {
                      setAddingSubtask(false);
                    }}
                  />
                ) : (
                  <CreateButton
                    title='Add subtask'
                    onClick={() => setAddingSubtask(true)}
                  />
                ),
              ]}
            />
            <div style={{ padding: '10px', borderRadius: '0px' }}>
              <Card style={{ padding: '0px', borderRadius: '0px' }}>
                <DraggableTable2
                  count={count}
                  page={page}
                  setPage={setPage}
                  isDraggable={false}
                  loader={loader}
                  lists={lists2}
                  setLists={setLists2}
                  step={step}
                  stepID={step ? step?.id : null}
                  projectSprintStepID={
                    step ? step?.project_sprint_step_id : null
                  }
                  getStep={getAll}
                  setLoader={setLoader}
                  addingSubtask={addingSubtask}
                  setAddingSubtask={setAddingSubtask}
                />
              </Card>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default ListView;
