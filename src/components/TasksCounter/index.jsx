import { useMemo } from 'react';
import './style.scss';

const TasksCounter = ({ element, isStage }) => {
  const computedStatusColor = useMemo(() => {
    // if(!element.count_done || !element.count_all) return 'red'
    // if(!Number(element.count_done) || !Number(element.count_all)) return 'red'
    let percent = element.percent;
    let done = element.count_done || 0;
    let all = element.count_all || 0;
    if (isStage) percent = Math.round((done / all) * 100);
    if (percent <= 0 || percent <= 25) return 'red';
    if (percent <= 50) return 'yellow';
    if (percent <= 75) return 'blue';
    if (percent <= 100) return 'green';

    return 'red';
  }, [element.count_done, element.count_all]);
  return (
    <div className={`TasksCounter ${computedStatusColor}`}>
      {element?.count_done || 0} / {element?.count_all || 0}
    </div>
  );
};

export default TasksCounter;
