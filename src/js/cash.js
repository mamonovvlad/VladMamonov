import {instruments} from "./modules/instruments.js";
import tableEnlargement from './modules/table-enlargement.js'
import {nav} from "./modules/nav.js";
import {changeCourseCity, updateTable} from "./modules/sending-data.js";

const proxy = "/proxy.php?url=",
  turnOff = document.querySelector('.turn-off'),
  enableAll = document.querySelector('.enable-all');

let res = [],
  newArr = [],
  removeRows = JSON.parse(localStorage.getItem('remove_rows'));

////////////////////////////////////////Table////////////////////////////////

const gridOptions = {
  columnDefs: [
    {
      sortIndex: 0,
      headerName: '№',
      width: 100,
      cellRenderer: params => {
        return refreshRows(params, gridOptions);
      }
    },
    {
      sortIndex: 1,
      headerName: 'НАЗВАНИЕ',
      field: 'title',
      minWidth: 60,
      sort: "asc"
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
        return checkbox(params, 'inp__active', 'active')
      }
    },
    {
      sortIndex: 4,
      headerName: 'КУРС',
      width: 120,
      cellClass: params => {
        return params.data.is_percent === 1 ? 'field-change' : 'text-center';
      },
      editable: params => {
        return params.data.is_percent === 1 ? true : '';
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
          updateTable(data)
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: ['course.buy']});
          return params.newValue;
        } else if (buy >= 1 && buy <= 1) {
          params.data.course.sell = params.newValue;
          let data = JSON.stringify({
            id: params.node.data.course.id,
            field: 'course.sell',
            value: params.newValue
          })
          updateTable(data)
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
        return checkbox(params, 'inp__is_percent', 'is_percent')
      }
    },
    {
      sortIndex: 6,
      headerName: 'ПРОЦЕНТ',
      width: 120,
      field: "rate_diff_percent",
      cellClass: params => {
        return params.data.is_percent === 0 ? 'field-change' : 'text-center';
      },
      editable: params => {
        return params.data.is_percent === 0 ? true : '';
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
      width: 100,
      cellRenderer: params => {
        return instruments(params, gridOptions, res)
      }
    }
  ],


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
  onCellEditingStopped: function (params) {
    let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
    if (params.colDef.field !== undefined) {
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: params.colDef.field,
        value: params.value
      })
      changeCourseCity(data);
    }
    gridOptions.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});
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
          res.forEach((row) => {
            if (row.is_primary === 1) {
              newArr.push(row);
            }
          })

          if (localStorage.getItem('remove_rows')) {
            let idxRemove = [];
            removeRows.forEach((item) => {
              idxRemove.push(Number(item))
              idxRemove.sort();
            })

            const selectedIds = idxRemove.map(function (rowNode) {
              return rowNode;
            });

            newArr = newArr.filter(function (dataItem) {
              return selectedIds.indexOf(dataItem.id) < 0;
            });
            gridOptions.api.setRowData(newArr);
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
          localStorage.setItem('remove_rows', JSON.stringify(rows))
        }
      })
    })
  })
}

function checkbox(params, cls, col) {
  let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  let input = document.createElement('input');
  input.type = "checkbox";
  input.className = `default-checkbox ${cls}`
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

    if (this.classList.contains('inp__is_percent')) {
      rowNode.setDataValue(params.colDef.field, params.value)
      gridOptions.api.redrawRows({rowNodes: [rowNode], columns: ['rate_diff_percent']});
    }

    changeCourseCity(data)
  });
  return input;
}

if (enableAll) {
  enableAll.addEventListener('click', () => {
    let data;

    res.forEach(item => {
      item.active = 1;

      data = JSON.stringify({
        id: item.id,
        field: 'active',
        value: item.active
      })

      changeCourseCity(data)

    })

    gridOptions.api.setRowData(newArr)

  })
}

if (turnOff) {
  turnOff.addEventListener('click', () => {
    let data;
    res.forEach(item => {
      if (item.city.code === 'KIEV') {
        item.active = 1;
        data = JSON.stringify({
          id: item.id,
          field: 'active',
          value: item.active
        })
      } else {
        item.active = 0;
        data = JSON.stringify({
          id: item.id,
          field: 'active',
          value: item.active
        })
      }
      changeCourseCity(data)
    })
    gridOptions.api.setRowData(newArr)
  })
}

nav(gridOptions);
tableEnlargement();

function refreshRows(params) {
  let buttons = document.createElement('span');
  buttons.classList.add('buttons__icons');
  buttons.innerHTML = `${'' + ++params.rowIndex}  <button class="btn btn__open" style="display: none"  data-row-idx="${params.data.id}">Открыть</button>`;

  if (params.data.is_primary) {
    let showBtn = buttons.querySelector('.btn__open');
    showBtn.style.display = 'block';
  }

  let btnOpen = buttons.querySelector('.btn__open');
  btnOpen.addEventListener('click', function () {
    openList(btnOpen, res, params, gridOptions);
  })
  return buttons;
}

function openList(btn, res, params, gridOptions) {
  let sell;
  let buy;
  let items = [];
  if (params.data.id === Number(btn.getAttribute('data-row-idx'))) {
    buy = params.data.buyCurrency.code;
    sell = params.data.sellCurrency.code;
  }
  res.forEach((item, idx) => {
    if (buy === item.buyCurrency.code && sell === item.sellCurrency.code && item.is_primary === 0) {
      items.push(item)
    }
  })

  let newStore = newArr.slice();
  for (let i = 0; i < items.length; i++) {
    let newItem = items[i];
    newStore.push(newItem)
  }
  // gridOptions.api.applyTransaction({add: [newArr]})
  gridOptions.api.setRowData(newStore);
  console.log(newStore)
}

