import React, { memo, useMemo } from 'react';
import Block from '../layout/block';
import NumberBlock from './numberBlock';
import { countTasksByStatus } from '../../utils/list';
import { useTaskFiltersContext } from '../../contexts/TaskFiltersContext';

const Overview = memo(function Overview() {
  const { filteredTasks } = useTaskFiltersContext();
  const stats = useMemo(() => ({
    total: filteredTasks?.length || 0,
    notStarted: countTasksByStatus(filteredTasks, 'notStarted'),
    inProgress: countTasksByStatus(filteredTasks, 'inProgress'),
    done: countTasksByStatus(filteredTasks, 'done'),
  }), [filteredTasks]);

  return (
    <Block>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" id="overview-title">نمای کلی</h2>
        <div
          className="grid grid-cols-4 gap-4"
          role="group"
          aria-labelledby="overview-title"
          aria-label="آمار وظایف"
        >
          <NumberBlock
            number={stats.total}
            title="مجموع"
            color="blue"
          />
          <NumberBlock
            number={stats.notStarted}
            title="در انتظار"
            color="yellow"
          />
          <NumberBlock
            number={stats.inProgress}
            title="در حال انجام"
            color="green"
          />
          <NumberBlock
            number={stats.done}
            title="تکمیل شده"
            color="red"
          />
        </div>
      </div>
    </Block>
  );
});

export default Overview;
