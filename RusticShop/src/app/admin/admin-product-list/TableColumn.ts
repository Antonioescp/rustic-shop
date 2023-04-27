interface TableColumn<T> {
  columnDef: string;
  header: string;
  cell: (item: T) => any;
}

export default TableColumn;
