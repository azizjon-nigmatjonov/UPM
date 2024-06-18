import React, { useEffect, useState } from 'react';
import FilterSelect from '../../../components/Selects/FilterSelect';
import listToOptions from '../../../utils/listToOptions';
import projectStageService from '../../../services/projectStageService';
import epicsService from '../../../services/epicsService';
import taskService from '../../../services/taskService';

export default function Filters({
  setLoader,
  setFilters,
  projectId,
}) {
  const [filterOptions, setFilterOptions] = useState({
    epics: [],
    stages: [],
    tasks: [],
  });

  const getFilterOptions = () => {
    setLoader(true);
    projectStageService.getList().then((res) => {
        let stages = listToOptions(res.stages, 'title', 'id');
        setFilterOptions((prev) => ({ ...prev, stages }));
        epicsService.getbyMainVersoin(projectId)
        .then((res) => {
        let epics = listToOptions(res.epic_items, 'title', 'id');
        setFilterOptions((prev) => ({ ...prev, epics }));
        })
        taskService.getByProjectId({project_id: projectId}).then((res) => {
        let tasks = listToOptions(res.tasks, 'title', 'id');
        console.log(res, 'TASKS LIKS')
        setFilterOptions((prev) => ({ ...prev, tasks }));
        })

    })
    .catch((err) => console.log(err))
    .finally(() => setLoader(false))
    }

  const onFilterChange = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getFilterOptions();
  }, []);

  return (
    <div className='filters-block'>
      <FilterSelect
        onChange={(e) => onFilterChange(e.target.value, 'epics')}
        label='Epic'
        width='120px'
        options={filterOptions.epics}
      />
      <FilterSelect
        onChange={(e) => onFilterChange(e.target.value, 'stages')}
        label='Stage'
        width='120px'
        options={filterOptions.stages}
      />
      <FilterSelect
        onChange={(e) => onFilterChange(e.target.value, 'tasks')}
        label='Tasks'
        width='120px'
        options={filterOptions.tasks}
      />
    </div>
  );
}
