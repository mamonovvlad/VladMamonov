import onRowDragEnd from './modules/row-drag.js'
import {instruments} from "./modules/instruments.js";
import tableEnlargement from './modules/table-enlargement.js'
import {nav} from "./modules/nav.js";
import {changeCourseCity} from "./modules/sending-data.js";
import buttonsRenderer from './modules/buttons-renderer.js'
import openWindow from "./modules/open-window.js";
import toggleCheckbox from "./modules/toggle-checkbox.js";
import {gettingCourses} from './modules/getting-courses.js'
import calculationsData from './modules/calculations.js'
import mergeCash from "./modules/merge-cash.js";


const proxy = "/proxy.php?url=",
  host = "http://local.obmen.log",
  api = "https://api.7money.co",
  turnOff = document.querySelector('.turn-off'),
  enableAll = document.querySelector('.enable-all');

let res = [],
  newArr = [],
  newStore;

////////////////////////////////////////Table////////////////////////////////

const gridOptions = {
  columnDefs: [
    {
      sortIndex: 0,
      headerName: '№',
      field: 'buyCurrency.symbol',
      sort: 'asc',
      rowDrag: true,
      width: 120,
      cellRenderer: params => {
        return refreshRows(params, gridOptions);
      }
    },
    {
      sortIndex: 1,
      headerName: 'НАЗВАНИЕ',
      field: 'title',
      minWidth: 60,
      sort: 'asc',
      cellRenderer: (params) => {
        return openWindow(params, 1)
      }
    },
    {
      sortIndex: 2,
      headerName: 'ГОРОД',
      field: 'city.name_ru',
      width: 100,
    },
    {
      sortIndex: 3,
      headerName: 'АКТИВОСТЬ',
      field: "active",
      width: 100,
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
      field: 'rate',
      cellClass: params => {
        return params.data.is_rate === 1 ? 'field-change' : 'text-center';
      },
      editable: params => {
        return params.data.is_rate === 1 ? true : '';
      },
    },
    {
      sortIndex: 5,
      headerName: 'ТОП КУРС БЭСТА',
      width: 120,
      field: "course.market_course",
    },
    {
      sortIndex: 6,
      headerName: 'ПРОЦЕНТ',
      width: 120,
      field: "rate_diff_percent",
      cellClass: params => {
        return params.data.is_rate === 0 ? 'field-change' : 'text-center';
      },
      editable: params => {
        return params.data.is_rate === 0 ? true : '';
      },
    },
    {
      sortIndex: 7,
      headerName: 'МИН',
      width: 70,
      suppressMovable: true,
      field: 'course.min_course',
      editable: false,
      cellClass: params => {
        return 'field-change';
      },
      cellRenderer: function (params) {
        return `${params.data.course.min_course}`
      }
    },
    {
      sortIndex: 8,
      headerName: 'МАКС',
      field: "course.max_course",
      width: 70,
      suppressMovable: true,
      editable: false,
      cellClass: params => {
        return 'field-change';
      },
      cellRenderer: function (params) {
        return `${params.data.course.max_course}`
      }
    },
    {
      sortIndex: 9,
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 100,
      suppressMovable: true,
      editable: true,
      field: "course.min_max_percent",
      valueSetter: function (params) {
        if (params.oldValue !== params.newValue) {
          params.newValue = params.newValue.replace(/,/, '.');
          params.data.course.min_max_percent = params.newValue;
          calculationsData(params)
        }
      },
      cellRenderer: function (params) {
        return buttonsRenderer(params, gridOptions, 1, calculationsData)
      }
    },
    {
      sortIndex: 10,
      headerName: 'ПРИВЯЗАТЬ К БИРЖЕ ?',
      width: 100,
      editable: false,
      suppressMovable: true,
      field: "course.link_to_exchange",
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
      sortIndex: 11,
      headerName: 'ПАРСИТЬ ?',
      width: 100,
      editable: false,
      suppressMovable: true,
      field: 'course.is_parse',
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
      sortIndex: 12,
      headerName: 'КУРС АКТИВЕН',
      width: 120,
      field: "is_rate",
      cellRenderer: function (params) {
        return checkbox(params, 'inp__is_rate', 'is_rate')
      }
    },
    {
      sortIndex: 13,
      headerName: 'ПРОЦЕНТ АКТИВЕН',
      width: 120,
      field: "is_percent",
      cellRenderer: function (params) {
        return checkbox(params, 'inp__is_percent', 'is_percent')
      }
    },
    {
      sortIndex: 14,
      headerName: 'ИНСТРУМЕНТЫ',
      width: 100,
      cellRenderer: params => {
        return instruments(params, gridOptions, res)
      }
    },
  ],
  rowHeight: 40,
  defaultColDef: {
    resizable: true,
  },
  animateRows: true,
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
      if (localStorage.getItem('merge-cash') === '1') {
        searchCurrencies(params);
      } else {
        let data = JSON.stringify({
          id: params.data.id,
          field: params.colDef.field,
          value: params.value
        })
        changeCourseCity(data);
      }
    }
    gridOptions.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});
  },

  onRowDragMove: onRowDragMove,
  getRowId: getRowId,
  onRowDragEnd: () => {
    onRowDragEnd(gridOptions, 1)
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('table');
  new agGrid.Grid(table, gridOptions);
  gettingCourses();
  receivingTable();
});


function receivingTable() {
  let urlTable = proxy +
    encodeURIComponent(
      `${api}/v1/course-city/all?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
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
        res.forEach(row => {
          if (row.is_primary === 1 && row.is_archive === 0) {
            newArr.push(row);
          }
        })
        gridOptions.api.setRowData(newArr);
      }
    });
}

function checkbox(params, cls, col) {
  let input = document.createElement('input');
  let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  input.type = "checkbox";
  input.setAttribute('data-idx', rowNode.rowIndex);
  input.className = `default-checkbox ${cls}`
  input.checked = params.value === 1;


  input.addEventListener('change', function (event) {
    let inpPercent = document.querySelectorAll('.inp__is_percent');
    let inpRate = document.querySelectorAll('.inp__is_rate');

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

    if (this.classList.contains('inp__is_rate')) {
      inpPercent.forEach(item => {
        if (item.getAttribute('data-idx') === String(params.rowIndex)) {
          if (this.checked === true) {
            item.checked = false;
            params.data.is_percent = 0;
          } else {
            item.checked = true;
            params.data.is_percent = 1;
          }
        }
      })
      let data = JSON.stringify({
        id: params.data.id,
        field: 'is_percent',
        value: params.data.is_percent
      })
      changeCourseCity(data)
      setTimeout(() => {
        rowNode.setDataValue(params.colDef.field, params.value)
        gridOptions.api.redrawRows({rowNodes: [rowNode], columns: ['rate_diff_percent']})
      }, 500)
    }

    if (this.classList.contains('inp__is_percent')) {
      inpRate.forEach(item => {
        if (item.getAttribute('data-idx') === String(params.rowIndex)) {
          if (this.checked === true) {
            item.checked = false;
            params.data.is_rate = 0;
          } else {
            item.checked = true;
            params.data.is_rate = 1;
          }
          let data = JSON.stringify({
            id: params.data.id,
            field: 'is_rate',
            value: params.data.is_rate,
          })
          changeCourseCity(data)
        }
      })
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
mergeCash();


function refreshRows(params) {
  let agRowDrag = document.querySelectorAll('.ag-row-drag');
  let buttons = document.createElement('span');
  buttons.classList.add('buttons__icons');
  buttons.innerHTML = `${'' + ++params.rowIndex}  <button class="btn btn__open" style="display: none"  data-row-idx="${params.data.id}">Открыть</button>`;

  if (params.data.is_primary) {
    let showBtn = buttons.querySelector('.btn__open');

    agRowDrag.forEach(item => {
      if (!item.classList.contains('d-none'))
        item.classList.add('d-none');
    })
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
  res.forEach((item) => {
    if (buy === item.buyCurrency.code && sell === item.sellCurrency.code && item.is_primary === 0) {
      if (item.is_archive === 0) {
        items.push(item)
      }
    }
  })


  items.sort(function(a, b) {
    return parseFloat(a.sort_order) - parseFloat(b.sort_order);
  });

  newStore = newArr.slice();
  for (let i = 0; i < items.length; i++) {
    let newItem = items[i];
    newStore.push(newItem)

  }

  gridOptions.api.setRowData(newStore);
}

function searchCurrencies(par) {
  updateMergeCash(par.data.id, par.data.rate)
  // Save data table
  res.forEach(item => {
    if (item.city.code === par.data.city.code) {
      if (par.data.buyCurrency.code === "CASHUSD" && item.buyCurrency.code === "CASHUSD" || par.data.buyCurrency.code === "CASHEUR" && item.buyCurrency.code === "CASHEUR") {
        if (par.data.sellCurrency.code === "USDTERC20" && item.sellCurrency.code === "USDTTRC20" || par.data.sellCurrency.code === "USDTTRC20" && item.sellCurrency.code === "USDTERC20") {
          updateMergeCash(item.id, par.data.rate)
        }
      } else if (par.data.sellCurrency.code === "CASHUSD" && item.sellCurrency.code === "CASHUSD" || par.data.sellCurrency.code === "CASHEUR" && item.sellCurrency.code === "CASHEUR") {
        if (par.data.buyCurrency.code === "USDTERC20" && item.buyCurrency.code === "USDTTRC20" || par.data.buyCurrency.code === "USDTTRC20" && item.buyCurrency.code === "USDTERC20") {
          updateMergeCash(item.id, par.data.rate)
        }
      }
    }
  })
// Update data table
  gridOptions.api.forEachNode((rowNode) => {
    if (rowNode.data.city.code === par.data.city.code) {
      if (par.data.buyCurrency.code === "CASHUSD" && rowNode.data.buyCurrency.code === "CASHUSD" || par.data.buyCurrency.code === "CASHEUR" && rowNode.data.buyCurrency.code === "CASHEUR") {
        if (par.data.sellCurrency.code === "USDTERC20" && rowNode.data.sellCurrency.code === "USDTTRC20" || par.data.sellCurrency.code === "USDTTRC20" && rowNode.data.sellCurrency.code === "USDTERC20") {
          rowNode.setDataValue([`rate`], par.data.rate)
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: ['rate']});
        }
      } else if (par.data.sellCurrency.code === "CASHUSD" && rowNode.data.sellCurrency.code === "CASHUSD" || par.data.sellCurrency.code === "CASHEUR" && rowNode.data.sellCurrency.code === "CASHEUR") {
        if (par.data.buyCurrency.code === "USDTERC20" && rowNode.data.buyCurrency.code === "USDTTRC20" || par.data.buyCurrency.code === "USDTTRC20" && rowNode.data.buyCurrency.code === "USDTERC20") {
          rowNode.setDataValue([`rate`], par.data.rate)
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: ['rate']});
        }
      }
    }
  });
}

function updateMergeCash(id, value) {
  let data = JSON.stringify({
    id: id,
    field: 'rate',
    value: value
  })
  changeCourseCity(data)
}


function getRowId(params) {
  return params.data.id;
}

function onRowDragMove(event) {
  let movingNode = event.node;
  let overNode = event.overNode;
  let rowNeedsToMove = movingNode !== overNode;

  if (rowNeedsToMove) {
    let movingData = movingNode.data;
    let overData = overNode.data;


    let fromIndex = newStore.indexOf(movingData);
    let toIndex = newStore.indexOf(overData);


    let store = newStore.slice();
    moveInArray(store, fromIndex, toIndex);

    newStore = store;
    gridOptions.api.setRowData(store);
    // console.log(store)
    gridOptions.api.clearFocusedCell();
  }

  function moveInArray(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}