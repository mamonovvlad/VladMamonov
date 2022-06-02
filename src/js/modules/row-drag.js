const proxy = "/proxy.php?url=",
  courseSort = "course-template",
  citySort = "course-city";

export default function onRowDragEnd(gridOptions, number) {
  let newArr = [];
  let count = gridOptions.api.getDisplayedRowCount();
  for (let i = 0; i < count; i++) {
    let arr
    let rowNode = gridOptions.api.getDisplayedRowAtIndex(i);
    rowNode.data.sort_order = rowNode.rowIndex;
    arr = rowNode.data.id + ':' + rowNode.data.sort_order;

    newArr.push(arr)
  }
  let data = newArr.join(',')

  fetch(proxy + encodeURIComponent(`https://api.7money.co/v1/${number === 1 ? citySort : courseSort}/set-sort-order-multiple-data?data=${data}&access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`), {
      method: 'get',
    }
  ).then(res => res.json());

}