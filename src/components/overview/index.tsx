import React, { memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Block from '../layout/block';
import NumberBlock from './numberBlock';
import { countTasksByStatus } from '../../utils/list';
import { useTaskFiltersContext } from '../../contexts/TaskFiltersContext';

const Overview = memo(function Overview() {
  const { filteredTasks } = useTaskFiltersContext();
  const router = useRouter();
  const stats = useMemo(() => ({
    total: filteredTasks?.length || 0,
    notStarted: countTasksByStatus(filteredTasks, 'notStarted'),
    inProgress: countTasksByStatus(filteredTasks, 'inProgress'),
    done: countTasksByStatus(filteredTasks, 'done'),
  }), [filteredTasks]);

  return (
    <Block>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold" id="overview-title">نمای کلی</h2>
            <button
              className="bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-2 flex items-center gap-2"
              onClick={() => {
                router.push('/new-task');
              }}
            >
              <span className="text-lg">+</span>
              افزودن وظیفه جدید
            </button>
          </div>
          <div
            className="flex gap-4"
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
      </div>
    </Block>
  );
});

export default Overview;
