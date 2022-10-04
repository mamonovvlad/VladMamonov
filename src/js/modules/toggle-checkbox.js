import {changeCourseCity, updateTable} from "./sending-data.js";


export default function toggleCheckbox(params, num) {
  let input = document.createElement('input');
  let rowNode = params.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  input.type = "checkbox";
  input.className = 'default-checkbox '
  input.checked = params.value === 1 || params.value === '1';
  
  
  input.addEventListener('change', function (event) {
      if (params.value === '0' || params.value === 0) {
        params.value = 1;
      } else {
        params.value = 0;
      }
      params.node.data.col = params.value;
      rowNode.setDataValue(params.column.colId, params.value)
      
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: params.column.colId,
        value: params.value
      })
      
      
      if (num === 0) {
        changeCourseCity(data)
      } else if (num === 1) {
        updateTable(data)
      } else {
        return false
      }
    }
  );
  return input;
  
}