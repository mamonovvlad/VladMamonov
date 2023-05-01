import onRowDragEnd from './modules/row-drag.js'
import {instruments} from "./modules/instruments.js";
import tableEnlargement from './modules/table-enlargement.js'
import {nav} from "./modules/nav.js";
import {changeCourseCity, updateTable} from "./modules/sending-data.js";
import buttonsRenderer from './modules/buttons-renderer.js'
import openWindow from "./modules/open-window.js";
import toggleCheckbox from "./modules/toggle-checkbox.js";
import {gettingCourses} from './modules/getting-courses.js'
import {mergeCash, mergePercentageExchange} from "./modules/merge-cash.js";
import {searchCurrencies} from "./modules/search-currencies.js";
import calculationsData from "./modules/calculations.js";

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
      headerName: 'НАЗВАНИЕ',
      field: 'title',
      minWidth: 60,
      sort: 'asc',
      cellRenderer: (params) => {
        return openWindow(params, 1)
      }
    },
    {
      headerName: 'ГОРОД',
      field: 'city.name_ru',
      width: 100,
    },
    {
      headerName: 'АКТИВНОСТЬ',
      field: "active",
      width: 100,
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
      headerName: 'КУРС',
      width: 120,
      field: 'course',
      editable: true,
      cellClass: params => {
        return 'field-change';
      },
      valueGetter: function (params) {
        let sell = parseFloat(params.node.data.course.sell);
        let buy = parseFloat(params.node.data.course.buy);
        let buyCur = params.node.data.buyCurrency.id;
        let sellCur = params.node.data.sellCurrency.id;
        let usdId = ['1', '2', '6', '7', '8', '12', '28', '29', '30', '42'];
        let uahId = ['3', '5', '26', '31', '35', '43', '44', '45'];
        let rubId = ['9', '11', '13', '14', '15', '16', '17', '18', '23', '24', '37', '40'];

        if (usdId.includes(sellCur) && usdId.includes(buyCur) || uahId.includes(sellCur) && uahId.includes(buyCur) || rubId.includes(sellCur) && rubId.includes(buyCur)) {
          return course(5);
        } else {
          return course(5);
        }
        function course(number) {
          if (params.data.is_set_exchange === '1' || params.data.is_set_exchange === 1) {
            return params.data.min_course
          } else if (params.data.is_set_max_exchange === '1' || params.data.is_set_max_exchange === 1) {
            return params.data.max_course
          } else {
            if (sell >= 1 && sell <= 1) {
              return buy.toFixed(number);
            } else if (buy >= 1 && buy <= 1) {
              return sell.toFixed(number);
            }
          }
        }
      },
      valueSetter: function (params) {
        let sell = parseFloat(params.data.course.sell);
        let buy = parseFloat(params.data.course.buy);
        if (sell >= 1 && sell <= 1) {
          params.data.course.buy = params.newValue;
          let data = JSON.stringify({
            id: params.node.data.course.id,
            field: 'course.buy',
            value: params.newValue
          })
          updateTable(data);
          return params.newValue;
        } else if (buy >= 1 && buy <= 1) {
          params.data.course.sell = params.newValue;
          let data = JSON.stringify({
            id: params.node.data.course.id,
            field: 'course.sell',
            value: params.newValue
          })
          updateTable(data);
          return params.newValue;
        } else {
          return false
        }
      },
      cellRenderer: (params) => {
        if (params.data.is_set_exchange === '1' || params.data.is_set_exchange === 1) {
          return params.data.min_course
        } else if (params.data.is_set_max_exchange === '1' || params.data.is_set_max_exchange === 1) {
          return params.data.max_course
        } else {
          return params.data.rate
        }
      }
    },
    {
      headerName: 'ТАРИФЫ',
      width: 120,
      field: 'course.rate_field',
      cellRenderer: (params) => {
        if (params.data.is_primary === 1) {
          let select = document.createElement('select');
          if (params.data.course.rate_field === null || params.data.course.rate_field === 'null' || params.data.course.rate_field === 'sell' || params.data.course.rate_field === 'buy') {
            select.className = 'rate-field';
            select.selected = params.data.course.rate_field;
            select.innerHTML = `
            <option value="null">Дефолт</option>
            <option value="sell">Отдаю</option>
            <option value="buy">Получаю</option>
            `
            for (let i = 0; i < select.length; i++) {
              if (select[i].value === `${params.data.course.rate_field}`) select[i].selected = true;
            }

            select.addEventListener('change', (e) => {
              let data = JSON.stringify({
                id: params.node.data.course.id,
                field: params.column.colId,
                value: e.target.value
              })
              updateTable(data)
            })
          } else {
            select.innerHTML = `
              <option>Поле не найдено</option>
            `
          }

          return select
        }
      }
    },
    {
      headerName: 'ТОП КУРС БЭСТА',
      width: 120,
      field: "course.market_course",
    },
    {
      headerName: 'МИН',
      width: 70,
      field: 'min_course',
      editable: true,
      cellClass:() => {
        return 'field-change';
      },
      cellRenderer: function (params) {
        return `${params.data.min_course}`
      }
    },
    {
      headerName: 'МАКС',
      field: "max_course",
      width: 70,
      editable: true,
      cellClass:() => {
        return 'field-change';
      },
      cellRenderer: function (params) {
        return `${params.data.max_course}`
      }
    },
    {
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 100,
      suppressMovable: true,
      editable: false,
      field: "min_max_percent",
      valueSetter: function (params) {
        if (params.oldValue && params.newValue) {
          if (params.oldValue !== String(params.newValue)) {
            params.newValue = String(params.newValue).replace(/,/, '.');
            params.data.min_max_percent = +params.newValue;
            calculationsData(params,true)
          }
        }
      },
      cellRenderer: function (params) {
        return buttonsRenderer(params, gridOptions, 1, res)
      }
    },
    {
      headerName: 'ПРИВЯЗАТЬ К БИРЖЕ ?',
      width: 100,
      editable: false,
      suppressMovable: true,
      field: "link_to_exchange",
      cellRenderer: function (params) {
          return toggleCheckbox(params, 0)

      }
    },
    {
      headerName: 'РУЧНОЙ КУРС',
      width: 120,
      field: "is_rate",
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
      headerName: 'ПАРСИТЬ ГОРОД ?',
      width: 120,
      field: "is_rate_update",
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
      headerName: 'ЭКСПОРТ МИН В КУРС',
      width: 120,
      field: 'is_set_exchange',
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
      headerName: 'ЭКСПОРТ МАКС В КУРС',
      width: 120,
      field: 'is_set_max_exchange',
      cellRenderer: function (params) {
        return toggleCheckbox(params, 0)
      }
    },
    {
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
      if (localStorage.getItem('merge-cash') === '1' || localStorage.getItem('merge-percentage-exchange') === '1') {
        searchCurrencies(res, params);
      } else {
        let data = JSON.stringify({
          id: params.data.id,
          field: params.colDef.field,
          value: params.value
        })
        changeCourseCity(data);
        gridOptions.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});

      }
    }
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
mergePercentageExchange();


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