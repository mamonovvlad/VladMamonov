import onRowDragEnd from './modules/row-drag.js'
import {instruments} from "./modules/instruments.js";
import tableEnlargement from './modules/table-enlargement.js'
import {nav} from "./modules/nav.js";
import {changeCourseCity} from "./modules/sending-data.js";

const proxy = "/proxy.php?url=",
  turnOff = document.querySelector('.turn-off'),
  enableAll = document.querySelector('.enable-all');

let res = [],
  rowsMain = JSON.parse(localStorage.getItem('row_main')),
  rowsId = JSON.parse(localStorage.getItem('row_id'));

////////////////////////////////////////Table////////////////////////////////


const gridOptions = {
  columnDefs: [
    {
      sortIndex: 0,
      headerName: '№',
      width: 50,
      rowDrag: true,
      cellRenderer: params => {
        return '' + ++params.rowIndex;
      }
    },
    {
      sortIndex: 1,
      headerName: 'НАЗВАНИЕ',
      field: 'title',
      minWidth: 60,
    },
    {
      sortIndex: 2,
      headerName: 'ГОРОД',
      field: 'city.name_ru',
    },
    {
      sortIndex: 3,
      headerName: 'АКТИВОСТЬ',
      field: "active",
      width: 120,
      cellClass: params => {
        return 'field-active';
      },
      cellRenderer: function (params) {
        return checkbox(params)
      }
    },
    {
      sortIndex: 4,
      headerName: 'КУРС',
      width: 120,
      editable: true,
      cellClass: params => {
        return 'field-change';
      },
      valueGetter: function (params) {
        let sell = parseFloat(params.data.course.sell);
        let buy = parseFloat(params.data.course.buy);
        if (sell >= 1 && sell <= 1) {
          return buy.toFixed(4);
        } else if (buy >= 1 && buy <= 1) {
          return sell.toFixed(4);
        }
      },
      valueSetter: function (params) {
        let sell = parseFloat(params.data.course.sell);
        let buy = parseFloat(params.data.course.buy);
        let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);

        if (sell >= 1 && sell <= 1) {
          params.data.course.buy = params.newValue;

          let data = JSON.stringify({
            id: params.node.data.course.id,
            field: 'course.buy',
            value: params.newValue
          })
          changeCourseCity(data)
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: ['course.buy']});

          return params.newValue;
        } else if (buy >= 1 && buy <= 1) {
          params.data.course.sell = params.newValue;

          let data = JSON.stringify({
            id: params.node.data.course.id,
            field: 'course.sell',
            value: params.newValue
          })
          changeCourseCity(data)
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: ['course.sell']});

          return params.newValue;
        } else {
          return false
        }
      },
    },
    {
      sortIndex: 5,
      headerName: 'ПЕРЕКЛЮЧАТЕЛЬ КУРСА',
      width: 120,
      field: "is_percent",
      cellRenderer: function (params) {
        return checkbox(params)
      }
    },
    {
      sortIndex: 6,
      headerName: 'ПРОЦЕНТ',
      width: 120,
      field: "course.min_max_percent",
      editable: true,
      cellClass: params => {
        return 'field-change';
      },
    },
    {
      sortIndex: 8,
      headerName: 'ТОП КУРС БЭСТА',
      width: 120,
      field: "course.market_course",
    },
    {
      sortIndex: 9,
      headerName: 'ИНСТРУМЕНТЫ',
      width: 150,
      cellRenderer: params => {
        return instruments(params, gridOptions, res)
      }
    }
  ],
  enableRangeSelection: true,
  rowSelection: 'multiple',


  enableCellChangeFlash: true,
  rowDragManaged: true,
  singleClickEdit: true,
  animateRows: true,

  defaultColDef: {
    resizable: true,
    suppressMovable: true,
  },
  rowHeight: 40,

  onGridReady: function (params) {
    params.api.sizeColumnsToFit();
  },

  getRowStyle: function (params) {
    if (params.data.is_primary !== 1) {
      return {background: '#e7e6e6'}
    }
    if (params.node.rowIndex % 2 === 0) {
      return {background: '#f9f9f9'}
    }
  },

  onCellEditingStarted: function () {
  },
  onCellEditingStopped: function (params) {
  },
  onRowDragEnd: () => {
    onRowDragEnd(gridOptions, 1)
  },
};

document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('table');
  new agGrid.Grid(table, gridOptions);
  receivingTable();
});


function receivingTable() {
  let urlTable = proxy +
    encodeURIComponent(
      `https://api.7money.co/v1/course-city/all?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    );
  agGrid
    .simpleHttpRequest({
      url: urlTable,
      method: 'get',
      dataType: "json",
    })
    .then(data => {
        if (data !== undefined) {
          res = JSON.parse(JSON.stringify(data));
          let newArr = [];


          res.forEach((row, idx) => {
            if (row.is_primary === 1) {
              newArr.push(row);
            }
            if (localStorage.getItem('row_main')) {
              rowsMain.forEach(idx => {
                if (idx === row.id) {
                  newArr.push(row);
                }
              })
            }
          })


          if (localStorage.getItem('row_id')) {
            let j = 0;
            let idxRemove = [];
            let newArray = [];
            rowsId.forEach((item) => {
              idxRemove.push(Number(item))
              idxRemove.sort();
            })
            newArr.forEach((item, idx) => {
              if (item.id !== idxRemove[j]) {
                console.log()
                newArray.push(item);
              } else {
                j += 1;
              }
            })
            gridOptions.api.setRowData(newArray);
            deleteRows(idxRemove)
          } else {
            gridOptions.api.setRowData(newArr);
          }


        }
      }
    )
  ;
}


const deleteRows = (rows) => {
  rows.forEach(row => {
    let li;
    li = document.createElement('li')
    li.innerHTML =
      `
      <label>
        <input type="checkbox" class="default-checkbox row__item" data-row-idx="${row}">
        <span>${row}</span>
      </label>
      `
    document.getElementById('filter-row').append(li)
  })
  let rowItem = document.querySelectorAll('.row__item');
  rowItem.forEach(item => {
    item.addEventListener('change', () => {
      rows.forEach(row => {
        if (row === Number(item.getAttribute('data-row-idx'))) {
          let index = rows.findIndex(item => item === row)
          rows.splice(index, 1);
          localStorage.setItem('row_id', JSON.stringify(rows))
        }
      })
    })
  })
}

function checkbox(params) {
  let input = document.createElement('input');
  input.type = "checkbox";
  input.className = 'default-checkbox '
  input.checked = params.value === 1;

  input.addEventListener('change', function (event) {
    if (params.value === 0) {
      params.value = 1;
    } else {
      params.value = 0;
    }

    let data = JSON.stringify({
      id: params.data.id,
      field: params.colDef.field,
      value: params.value
    })

    changeCourseCity(data)
  });
  return input;
}

if (enableAll) {
  enableAll.addEventListener('click', () => {
    let count = gridOptions.api.getDisplayedRowCount();
    let inpActive = document.querySelectorAll('.field-active input');
    for (let i = 0; i < count; i++) {
      let rowNode = gridOptions.api.getDisplayedRowAtIndex(i);
      rowNode.data.active = 1
      let data = JSON.stringify({
        id: rowNode.data.id,
        field: 'active',
        value: rowNode.data.active
      })
      changeCourseCity(data)
    }
    inpActive.forEach(item => {
      item.checked = true;
    })
  })
}

if (turnOff) {
  turnOff.addEventListener('click', () => {
    let count = gridOptions.api.getDisplayedRowCount();
    let inpActive = document.querySelectorAll('.field-active input');
    for (let i = 0; i < count; i++) {
      let rowNode = gridOptions.api.getDisplayedRowAtIndex(i);
      if (rowNode.data.city.code === 'KIEV') {
        rowNode.data.active = 1
        let data = JSON.stringify({
          id: rowNode.data.id,
          field: 'active',
          value: rowNode.data.active
        })
        changeCourseCity(data)
        inpActive[i].checked = true;
      } else {
        rowNode.data.active = 0
        inpActive[i].checked = false;
        let data = JSON.stringify({
          id: rowNode.data.id,
          field: 'active',
          value: rowNode.data.active
        })
        changeCourseCity(data)
      }
    }


  })
}

nav(gridOptions);
tableEnlargement();


