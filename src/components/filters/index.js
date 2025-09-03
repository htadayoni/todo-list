import FilterItem from './filterItem';
import {
  categories,
  priorities,
  statuses,
  sortOptions,
} from './../../constants/filters';
import Block from '../layout/block';

export default function Filters() {
  return (
    <Block>
      <div className="grid grid-cols-4 gap-4">
        <FilterItem title="دسته بندی" listItems={categories} />
        <FilterItem title="اولویت‌ها" listItems={priorities} />
        <FilterItem title="وضعیت" listItems={statuses} />
        <FilterItem title="مرتب سازی" listItems={sortOptions} />
      </div>
    </Block>
  );
}
