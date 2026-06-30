export const handleSort = (
  sort: string,
  setSort: (value: string) => void,
  sortBy: string, //identifier for the sort (e.g., 'name', 'email')
  sortColumn: string, //name of the column in the data to sort by
  setList: React.Dispatch<React.SetStateAction<any[]>>,
  defaultData: any[],
) => {
  const ascKey = sortBy + 'Asc';
  const desKey = sortBy + 'Des';

  if (sort !== ascKey && sort !== desKey) {
    setSort(ascKey);
    setList((prev) => [...prev].sort((a: any, b: any) => a[sortColumn]?.localeCompare(b[sortColumn])));
  } else if (sort === ascKey) {
    setSort(desKey);
    setList((prev) => [...prev].sort((a: any, b: any) => b[sortColumn]?.localeCompare(a[sortColumn])));
  } else {
    setSort('');
    setList(defaultData);
  }
  return { sort, setSort, sortBy, sortColumn, setList, defaultData };
};
