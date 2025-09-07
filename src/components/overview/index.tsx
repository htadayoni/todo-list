import React from 'react';
import Block from '../layout/block';
import NumberBlock from './numberBlock';
import { TaskItemType } from '../../types/tasks';
import { countTasksByStatus } from '../../utils/list';

type OverviewProps = {
  taskList: TaskItemType[];
};

export default function Overview({ taskList }: OverviewProps) {
  return (
    <Block>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">نمای کلی</h2>
        <div className="grid grid-cols-4 gap-4">
          <NumberBlock
            number={taskList?.length || 0}
            title="مجموع"
            color="blue"
          />
          <NumberBlock
            number={countTasksByStatus(taskList, 'notStarted')}
            title="در انتظار"
            color="yellow"
          />
          <NumberBlock
            number={countTasksByStatus(taskList, 'inProgress')}
            title="در حال انجام"
            color="green"
          />
          <NumberBlock
            number={countTasksByStatus(taskList, 'done')}
            title="تکمیل شده"
            color="red"
          />
        </div>
      </div>
    </Block>
  );
}
