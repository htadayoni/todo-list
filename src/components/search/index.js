import Block from '../layout/block';

export default function Search() {
  return (
    <Block>
      <input
        type="text"
        placeholder="جستجو..."
        className="border border-gray-300 rounded-md p-2 w-full"
      />
    </Block>
  );
}
