import FilterItem from './filterItem';
import {
  categories,
  priorities,
  statuses,
  sortOptions,
} from '../../constants/filters';

export default function Filters() {
  return (
    <div className="shadow-md bg-white border border-gray-100 rounded-md p-4">
      <div className="grid grid-cols-4 gap-4">
        <FilterItem title="دسته بندی" listItems={categories} />
        <FilterItem title="اولویت‌ها" listItems={priorities} />
        <FilterItem title="وضعیت" listItems={statuses} />
        <FilterItem title="مرتب سازی" listItems={sortOptions} />
      </div>
    </div>
  );
}
