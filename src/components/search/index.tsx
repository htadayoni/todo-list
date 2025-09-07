'use client';
import React from 'react';
import Block from '../layout/block';

type SearchProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

export default function Search({ searchText, setSearchText }: SearchProps) {
  return (
    <Block>
      <input
        type="text"
        placeholder="جستجو..."
        className="border border-gray-300 rounded-md p-2 w-full"
        value={searchText}
        onChange={event => {
          setSearchText(event.target.value);
        }}
      />
    </Block>
  );
}
