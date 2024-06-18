import React, { useEffect, useState } from 'react';
import SprintSelect from '../../../components/Selects/SprintSelect';
import SearchInput from '../../../components/SearchInput';
import FilterSelect from '../../../components/Selects/FilterSelect';
import CreateButton from '../../../components/Buttons/CreateButton';
import useDebounce from '../../../hooks/useDebounce';
import listToOptions from '../../../utils/listToOptions';
import projectMembersService from '../../../services/projectMembersService';
import projectStageService from '../../../services/projectStageService';
import epicsService from '../../../services/epicsService';

export default function Filters({
  setLoader,
  filters,
  setFilters,
  projectId,
  isBugPage = false,
}) {
  const [filterOptions, setFilterOptions] = useState({
    users: [],
    epics: [],
    stages: [],
  });

  const getFilterOptions = () => {
    setLoader(true);
    projectMembersService
      .getList({ 'project-id': projectId })
      .then(({ project_members }) => {
        let users = project_members.map((member) => {
          return { value: member.user_id, label: member.user.name };
        });
        setFilterOptions((prev) => ({ ...prev, users }));
        projectStageService.getList().then((res) => {
          let stages = listToOptions(res.stages, 'title', 'id');
          setFilterOptions((prev) => ({ ...prev, stages }));
          epicsService.getbyMainVersoin(projectId).then((res) => {
            let epics = listToOptions(res.epic_items, 'title', 'id');
            setFilterOptions((prev) => ({ ...prev, epics }));
          });
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  const onFilterChange = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getFilterOptions();
  }, [ ]);

  return (
    <div className='filters-block'>
      <div>
        <SearchInput
          icon
          style={{ width: '240px' }}
          onChange={(e) => {
            onFilterChange(e, 'search');
          }}
        />
      </div>
      {/* <div>
        <SprintSelect />
      </div> */}
      <FilterSelect
        onChange={(e) => onFilterChange(e.target.value, 'users')}
        label='User'
        width='120px'
        options={filterOptions.users}
      />
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
      {/* {isBugPage && (
        <CreateButton onClick={() => setModalVisible(true)} title='Add bug' />
      )} */}
    </div>
  );
}
