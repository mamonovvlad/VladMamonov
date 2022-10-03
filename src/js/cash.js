import {instruments} from "./modules/instruments.js";
import tableEnlargement from './modules/table-enlargement.js'
import {nav} from "./modules/nav.js";
import {changeCourseCity} from "./modules/sending-data.js";
import buttonsRenderer from './modules/buttons-renderer.js'
import openWindow from "./modules/open-window.js";
import toggleCheckbox from "./modules/toggleCheckbox.js";


const proxy = "/proxy.php?url=",
  turnOff = document.querySelector('.turn-off'),
  enableAll = document.querySelector('.enable-all');

let res = [],
  newArr = [],
  selectedIds;

////////////////////////////////////////Table////////////////////////////////

const gridOptions = {
  
  columnDefs: [
    {
      headerName: '№',
      field: 'buyCurrency.symbol',
      sort: 'asc',
      width: 80,
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
      headerName: 'КУРС',
      width: 120,
      cellClass: params => {
        return params.data.is_rate === 1 ? 'field-change' : 'text-center';
      },
      editable: params => {
        return params.data.is_rate === 1 ? true : '';
      },
      field: 'rate'
    },
    {
      headerName: 'ТОП КУРС БЭСТА',
      width: 120,
      field: "course.market_course",
    },
    {
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
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 100,
      suppressMovable: true,
      editable: true,
      field: "course.min_max_percent",
      valueSetter: function (params) {
        if (params.oldValue !== params.newValue) {
          params.newValue = params.newValue.replace(/,/, '.');
          params.data.course.min_max_percent = params.newValue;
        }
      },
      cellRenderer: function (params) {
        return buttonsRenderer(params, gridOptions, 1)
      }
    },
    {
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
      headerName: 'КУРС АКТИВЕН',
      width: 120,
      field: "is_rate",
      cellRenderer: function (params) {
        return checkbox(params, 'inp__is_rate', 'is_rate')
      }
    },
    {
      headerName: 'ПРОЦЕНТ АКТИВЕН',
      width: 120,
      field: "is_percent",
      cellRenderer: function (params) {
        return checkbox(params, 'inp__is_percent', 'is_percent')
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
        id: params.data.id,
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
      if (item.is_archive === 0) {
        items.push(item)
      }
    }
  })
  
  
  let newStore = newArr.slice();
  for (let i = 0; i < items.length; i++) {
    let newItem = items[i];
    newStore.push(newItem)
  }
  // gridOptions.api.applyTransaction({add: [newArr]})
  if (selectedIds !== undefined) {
    newStore = newStore.filter(function (dataItem) {
      return selectedIds.indexOf(dataItem.id) < 0;
    });
  }
  gridOptions.api.setRowData(newStore);
}
