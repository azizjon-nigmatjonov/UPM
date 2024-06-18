import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FiltersBlock from '../../../components/FiltersBlock';
import GanttPercentSelect from '../../../components/Selects/GanttPercentSelect';
import GanttPeriodSelect from '../../../components/Selects/GanttPeriodSelect';
import VersionSelect from '../../../components/Selects/VersionSelect';
import { updateGanttPositionsAction } from '../../../redux/thunks/subtask.thunk';
import EpicsBlock from '../Backlog/Epics/EpicsBlock';
import GanttCalendar from './Calendar/index';
import GanttChart from './GanttChart';
import './style.scss';

const GanttPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateGanttPositionsAction());
  }, [dispatch]);

  return (
    <div className='GanttPage'>
      {/* <ProjectsHeader /> */}
      <FiltersBlock
        extra={[
          <GanttPercentSelect />,
          <GanttPeriodSelect />,
          <VersionSelect />,
        ]}
      />

      <div className='main-area'>
        <div className='main-section'>
          <div className='left'>
            <EpicsBlock insideGantt />
          </div>

          <div className='right'>
            <GanttCalendar />

            <GanttChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttPage;
