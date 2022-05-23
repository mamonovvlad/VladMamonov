import onRowDragEnd from './modules/row-drag.js'
import tableEnlargement from './modules/table-enlargement.js'
import buttonsRenderer from './modules/buttons-renderer.js'
import debounce from "./modules/debounce.js";
import openWindow from "./modules/open-window.js";
import {nav} from "./modules/nav.js";
import {updateTable, changeMultiple} from "./modules/sending-data.js";
import {startTimeout, resetTimeout, pauseTimeout, refresh, timeout} from "./modules/timeout.js";


const users = document.getElementById('users'),
  templates = document.getElementById('templates'),
  limiter = document.querySelector('.limiter'),
  buttonChange = document.querySelectorAll('.button__change'),
  sellCurrency = document.querySelector('.sell-currency'),
  buyCurrency = document.querySelector('.buy-currency'),
  proxy = "/proxy.php?url=";


let template_id = localStorage.getItem('template_id'),
  user_id = localStorage.getItem('user_id'),
  data = [],
  courseUsdRub,
  courseUsdUah,
  courseUahRub,
  courseEthEur,
  courseBtcEur,
  courseBtc,
  courseDash,
  courseZec,
  courseLtc,
  courseEth,
  courseDoge,
  courseTron;

////////////////////////////////////////Table////////////////////////////////
const gridOptions = {
  columnDefs: [
    {
      sortIndex: 0,
      headerName: '№',
      width: 70,
      rowDrag: true,
      suppressMovable: true,
      cellRenderer: params => {
        return '' + ++params.rowIndex;
      }
    },
    {
      sortIndex: 1,
      headerName: 'НАПРАВЛЕНИЕ',
      minWidth: 60,
      suppressMovable: true,
      cellRenderer: (params) => {
        return openWindow(params)
      }
    },
    {
      sortIndex: 2,
      headerName: 'КУРС',
      field: 'course',
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
          if (sell >= 1 && sell <= 1) {
            return buy.toFixed(number);
          } else if (buy >= 1 && buy <= 1) {
            return sell.toFixed(number);
          }
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
      width: 70,
      suppressMovable: true,
      cellClass: 'field-change',
      editable: true,
    },
    {
      sortIndex: 3,
      headerName: 'ТОР КУРС БЭСТА',
      field: "course.market_course",
      suppressMovable: true,
      width: 100,
    },
    {
      sortIndex: 4,
      headerName: 'МИН',
      width: 70,
      suppressMovable: true,
      field: 'course.min_course',
      editable: params => {
        if (params.data.is_edit_min === "1") {
          return true
        }
      },
      cellClass: params => {
        return params.data.is_edit_min === "1" ? 'field-change' : 'text-center';
      },
      cellRenderer: function (params) {
        return `${params.data.course.min_course}`
      }
    },
    {
      sortIndex: 5,
      headerName: 'МАКС',
      field: "course.max_course",
      width: 70,
      suppressMovable: true,
      editable: params => {
        if (params.data.is_edit_max === "1") {
          return true
        }
      },
      cellClass: params => {
        return params.data.is_edit_max === "1" ? 'field-change' : 'text-center';
      },
      cellRenderer: function (params) {
        return `${params.data.course.max_course}`
      }
    },
    {
      sortIndex: 6,
      headerName: 'ОГРАНИЧИТЕЛЬ',
      field: "course.limiter",
      width: 120,
      suppressMovable: true,
      cellClass: params => {
        return params.data.course.is_active_limiter === "1" ? 'field-change' : 'text-center';
      },
      editable: params => {
        return params.data.course.is_active_limiter === "1" ? true : '';
      },
      cellRenderer: function (params) {
        if (params.node.data.course.is_active_limiter === "1") {
          return `${params.data.course.limiter}`
        } else {
          return `—`
        }
      }
    },
    {
      sortIndex: 7,
      headerName: 'ОГРАНИЧИВАТЬ ?',
      field: "course.is_active_limiter",
      width: 100,
      editable: false,
      suppressMovable: true,
      cellRenderer: params => {
        let col = [`course.is_active_limiter`]
        return checkbox(params, col)
      }
    },
    {
      sortIndex: 8,
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 100,
      suppressMovable: true,
      editable: true,
      field: "course.min_max_percent",
      valueSetter: function (params) {
        if (params.oldValue !== params.newValue) {
          clearInterval(timeout);
          params.newValue = params.newValue.replace(/,/, '.');
          params.data.course.min_max_percent = params.newValue;
          calculationsData(params)
        }
      },
      cellRenderer: function (params) {
        return buttonsRenderer(params, gridOptions, calculationsData)
      }
    },
    {
      sortIndex: 9,
      headerName: 'ПРИВЯЗАТЬ К БИРЖЕ ?',
      width: 100,
      editable: false,
      suppressMovable: true,
      field: "course.link_to_exchange",
      cellRenderer: function (params) {
        return bindingCheckbox(params)
      }
    },
    {
      sortIndex: 10,
      headerName: 'ЗНАЧЕНИЕ УК',
      field: "course.smart_percent",
      width: 100,
      suppressMovable: true,
      editable: true,
      cellClass: 'field-change',
    },
    {
      sortIndex: 11,
      headerName: 'УМНЫЙ КУРС',
      width: 100,
      suppressMovable: true,
      editable: false,
      field: 'course.is_smart',
      cellRenderer: function (params) {
        return bindingCheckbox(params)
      }
    },
    {
      sortIndex: 12,
      headerName: 'ПАРСИТЬ ?',
      width: 100,
      editable: false,
      suppressMovable: true,
      field: 'course.is_parse',
      cellRenderer: function (params) {
        let col = [`course.is_parse`]
        return checkbox(params, col)
      }
    },
    {
      sortIndex: 13,
      headerName: 'ЗНАЧЕНИЕ ПАРСЕРА 2',
      field: "course.parse_populate_value",
      width: 100,
      suppressMovable: true,
      editable: true,
      cellClass: 'field-change',
    },
    {
      sortIndex: 14,
      headerName: 'ПАРСИТЬ 2?',
      width: 100,
      editable: false,
      suppressMovable: true,
      field: "course.is_parse_populate",
      cellRenderer: function (params) {
        let col = [`course.is_parse_populate`]
        return checkbox(params, col)
      }
    },
    {
      sortIndex: 15,
      headerName: 'ЗНАЧЕНИЕ ПАРСЕРА 3',
      field: "course.parse_superpopulate_value",
      width: 100,
      suppressMovable: true,
      editable: true,
      cellClass: 'field-change',
    },
    {
      sortIndex: 16,
      headerName: 'ПАРСИТЬ 3?',
      width: 100,
      suppressMovable: true,
      editable: false,
      field: "course.is_parse_superpopulate",
      cellRenderer: function (params) {
        let col = [`course.is_parse_superpopulate`]
        return checkbox(params, col)
      }
    },
  ],
  enableCellChangeFlash: true,
  rowDragManaged: true,
  singleClickEdit: true,
  animateRows: true,
  rowHeight: 40,
  defaultColDef: {
    resizable: true,
  },
  onGridReady: function (params) {
    params.api.sizeColumnsToFit();
  },
  getRowStyle: function (params) {
    if (params.node.rowIndex % 2 === 0) {
      return {background: '#f9f9f9'}
    }
  },

  onCellEditingStarted: function () {
    pauseTimeout();
  },
  onCellEditingStopped: function (params) {
    startTimeout()
    let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
    gridOptions.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});
    let data = JSON.stringify({
      id: params.node.data.course.id,
      field: params.column.colId,
      value: params.value
    })
    updateTable(data);
  },
  onRowDragEnd: () => {
    onRowDragEnd(gridOptions)
  },
};

document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('table');
  new agGrid.Grid(table, gridOptions);
  startTimeout();
  receivingUsers();
});


//Receiving users  - loading 1
function receivingUsers() {
  let url = proxy +
    encodeURIComponent(
      'https://api.7money.co/v1/admin?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json'
    );
  fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }).then(res => res.json()).then(res => {
    res.forEach(user => {
      let option = document.createElement('option')
      option.innerHTML = user.fullname;
      option.value = user.id;
      if (option.value === user_id) {
        option.selected = true;
      }
      if (user_id === null) {
        user_id = user.id;
      }
      users.append(option);
    });
    receivingTemplate();
    gettingCourses();
  });
}

//Receiving template - loading 2
function receivingTemplate() {
  let url = proxy +
    encodeURIComponent(
      `https://api.7money.co/v1/course-template/list-templates?user_id=${user_id}&access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    );
  fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }).then(res => res.json()).then(res => {
    templates.innerHTML = "";
    if (Object.keys(res.data).length) {
      res.data.forEach(item => {
        if (item.active > 0) {
          let option = document.createElement("option");
          option.innerHTML = item.name;
          option.value = item.id;
          option.setAttribute('data-name', item.name)
          if (template_id === null) {
            template_id = item.id;
          }
          if (option.value === template_id) {
            option.selected = true
          }
          templates.append(option);
        }
      })
      document.title = templates.options[templates.selectedIndex].text;
    } else {
      const option = document.createElement("option");
      option.innerHTML = 'Нет подходящих темплейтов';
      document.title = 'Нет подходящих темплейтов';
      templates.append(option);
    }

    receivingValue()
  });
}

//Receiving courses - loading 3
function gettingCourses() {
  let url = proxy +
    encodeURIComponent(
      `https://api.7money.co/v1/static-data?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    );
  fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }).then(res => res.json()).then(res => {
    for (let value of res) {
      let data;
      if (value.name === 'usd_uah_course') {
        courseUsdUah = Number(value.value);
      } else if (value.name === 'usd_rub_course') {
        courseUsdRub = Number(value.value);
      } else if (value.name === 'uah_rub_course') {
        courseUahRub = Number(value.value);
      } else if (value.name === 'bitcoin_course') {
        data = JSON.parse(value.value);
        courseBtc = Number(data.usd);
      } else if (value.name === 'dash_course') {
        data = JSON.parse(value.value);
        courseDash = Number(data.usd);
      } else if (value.name === 'zcash_course') {
        data = JSON.parse(value.value);
        courseZec = Number(data.usd);
      } else if (value.name === 'litecoin_course') {
        data = JSON.parse(value.value);
        courseLtc = Number(data.usd);
      } else if (value.name === 'ethereum_course') {
        data = JSON.parse(value.value);
        courseEth = Number(data.usd);
      } else if (value.name === 'dogecoin_course') {
        data = JSON.parse(value.value);
        courseDoge = Number(data.usd);
      } else if (value.name === 'tron_course') {
        data = JSON.parse(value.value);
        courseTron = Number(data.usd);
      } else if (value.name === 'bitcoin_euro_course') {
        data = JSON.parse(value.value);
        courseBtcEur = Number(data.usd);
      } else if (value.name === 'ethereum_euro_course') {
        data = JSON.parse(value.value);
        courseEthEur = Number(data.usd);
      }
    }
  });
}

//Receiving table - loading 4
function receivingValue() {
  template_id = templates.value
  user_id = users.value
  let params = {};
  if (user_id > 0) {
    params.user_id = user_id;
  }
  if (template_id > 0) {
    params.id = template_id;
  }
  receivingTable()

}

function receivingTable() {
  let urlTable = proxy +
    encodeURIComponent(
      `https://api.7money.co/v1/course-template/templates?user_id=${user_id}&id=${template_id}&access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    );
  agGrid
    .simpleHttpRequest({
      url: urlTable,
      method: 'get',
      dataType: "json",
    })
    .then(res => {
      if (res.data !== undefined) {
        data = JSON.parse(JSON.stringify(res.data));
        gridOptions.api.setRowData(data);
      } else {
        return false;
      }
    });
}

function checkbox(params, col) {
  let input = document.createElement('input');
  let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  input.type = "checkbox";
  input.className = 'default-checkbox '
  input.checked = params.value === "1";


  input.addEventListener('change', function (event) {
      if (params.value === '0') {
        params.value = '1';
      } else {
        params.value = '0';
      }
      params.node.data.col = params.value;

      rowNode.setDataValue(col, params.value)
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: params.column.colId,
        value: params.value
      })


      if (params.data.course.is_active_limiter) {
        gridOptions.api.redrawRows({rowNodes: [rowNode], columns: ['course.limiter']});
      }


      updateTable(data)
      gridOptions.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});
    }
  );
  return input;
}

function bindingCheckbox(params) {
  let input = document.createElement('input');
  let columnClass = params.colDef.field.split('course.').join('');
  let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  input.type = "checkbox";
  input.checked = params.value === "1";
  input.className = `default-checkbox check ids-${params.data.sellCurrency.id}-${params.data.buyCurrency.id} column-${columnClass}`;
  input.setAttribute('data-sell', `${params.data.sellCurrency.id}`)
  input.setAttribute('data-buy', `${params.data.buyCurrency.id}`)
  input.setAttribute('data-id', `${params.node.data.course.id}`)
  input.setAttribute('data-index', `${rowNode.id}`)


  if (params.data.course.link_to_exchange === '1') {
    input.classList.add('change--true');
  } else {
    input.classList.remove('change--true');
  }

  input.addEventListener('change', function () {

    let nameColumn = columnClass;
    if (this.classList.contains('column-is_smart')) {
      nameColumn = "link_to_exchange";
    } else if (this.classList.contains('column-link_to_exchange')) {
      nameColumn = 'is_smart'
    }

    let reverseCheckboxBuySell = document.querySelectorAll('.ids-' + input.getAttribute('data-sell') + '-' + input.getAttribute('data-buy') + '.column-' + nameColumn)
    let reverseCheckboxSellBuy = document.querySelectorAll('.ids-' + input.getAttribute('data-buy') + '-' + input.getAttribute('data-sell') + '.column-' + nameColumn)

    let checkboxBuySell = document.querySelectorAll('.ids-' + input.getAttribute('data-buy') + '-' + input.getAttribute('data-sell') + '.column-' + columnClass)
    let checkboxSellBuy = document.querySelectorAll('.ids-' + input.getAttribute('data-sell') + '-' + input.getAttribute('data-buy') + '.column-' + columnClass)


    checkboxBuySell.forEach(item => {
      if (!item.checked) {
        item.checked = true;
        item.classList.add('change--true');
        params.value = 1;
      } else {
        item.checked = false;
        item.classList.remove('change--true');
        params.value = 0;
      }
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: params.column.colId,
        value: params.value
      })
      updateTable(data);
    })
    checkboxSellBuy.forEach(item => {
      if (item.checked) {
        item.checked = true;
        params.value = '1';
        item.classList.add('change--true');
      } else {
        item.checked = false;
        params.value = "0";
        item.classList.remove('change--true');
      }
      let data = JSON.stringify({
        id: item.getAttribute('data-id'),
        field: params.column.colId,
        value: params.value
      })

      updateTable(data);
    })

    reverseCheckboxBuySell.forEach(item => {
      item.checked = false;
      params.value = '0';
      item.classList.remove('change--true');

    })
    reverseCheckboxSellBuy.forEach(item => {
      item.checked = false;
      item.classList.remove('change--true');
      params.value = "0";

    })


  })
  return input
}

function calculationsData(params, sing) {
  let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  let buyCurrency = params.node.data.buyCurrency.id;
  let sellCurrency = params.node.data.sellCurrency.id;
  const usdId = ['1', '2', '6', '7', '8', '12', '28', '29', '30', '42'];
  const uahId = ['3', '5', '26', '31', '35', '43', '44', '45'];
  const rubId = ['9', '11', '13', '14', '15', '16', '17', '18', '23', '24', '37', '40'];
  const eurId = ['32', '48'];

  let rub;
  let usd;
  let uah;
  let eur
  const btc = '4';
  const dash = '20';
  const zec = '21';
  const ltc = '19';
  const eth = '25';
  const doge = '39';
  const tron = '46';


  rubId.forEach(currency => {
    searchMatches(currency, 'rub')
  })

  usdId.forEach(currency => {
    searchMatches(currency, 'usd')
  })

  uahId.forEach(currency => {
    searchMatches(currency, 'uah')
  })

  eurId.forEach(currency => {
    searchMatches(currency, 'eur')
  })

  if (rub === sellCurrency && usd === buyCurrency || usd === sellCurrency && rub === buyCurrency) {
    formulaDefault(courseUsdRub)
  }

  if (uah === sellCurrency && usd === buyCurrency || usd === sellCurrency && uah === buyCurrency) {
    formulaDefault(courseUsdUah)
  }

  if (uah === sellCurrency && rub === buyCurrency || rub === sellCurrency && uah === buyCurrency) {
    formulaDefault(courseUahRub)
  }

  //Crypt - Usd
  if (btc === sellCurrency && usd === buyCurrency || usd === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc)
  }

  if (dash === sellCurrency && usd === buyCurrency || usd === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash)
  }

  if (zec === sellCurrency && usd === buyCurrency || usd === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec)
  }

  if (ltc === sellCurrency && usd === buyCurrency || usd === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc)
  }

  if (eth === sellCurrency && usd === buyCurrency || usd === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth)
  }

  if (doge === sellCurrency && usd === buyCurrency || usd === sellCurrency && doge === buyCurrency) {
    let res = (1 / courseDoge);
    formulaDefault(res)
  }
  if (tron === sellCurrency && usd === buyCurrency || usd === sellCurrency && tron === buyCurrency) {
    let res = (1 / courseTron);
    formulaDefault(res)
  }

  //Crypt - Rus
  if (btc === sellCurrency && rub === buyCurrency || rub === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc, courseUsdRub, 'crypt');
  }

  if (dash === sellCurrency && rub === buyCurrency || rub === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash, courseUsdRub, 'crypt');
  }

  if (zec === sellCurrency && rub === buyCurrency || rub === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec, courseUsdRub, 'crypt');
  }

  if (ltc === sellCurrency && rub === buyCurrency || rub === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc, courseUsdRub, 'crypt');
  }

  if (eth === sellCurrency && rub === buyCurrency || rub === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth, courseUsdRub, 'crypt');
  }

  if (doge === sellCurrency && rub === buyCurrency || rub === sellCurrency && doge === buyCurrency) {
    formulaDefault(courseDoge, courseUsdRub, 'crypt');
  }
  if (tron === sellCurrency && rub === buyCurrency || rub === sellCurrency && tron === buyCurrency) {
    formulaDefault(courseTron, courseUsdRub, 'crypt');
  }

  //Crypt - Uah
  if (btc === sellCurrency && uah === buyCurrency || uah === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc, courseUsdUah, 'crypt');
  }

  if (dash === sellCurrency && uah === buyCurrency || uah === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash, courseUsdUah, 'crypt');
  }

  if (zec === sellCurrency && uah === buyCurrency || uah === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec, courseUsdUah, 'crypt');
  }

  if (ltc === sellCurrency && uah === buyCurrency || uah === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc, courseUsdUah, 'crypt');
  }

  if (eth === sellCurrency && uah === buyCurrency || uah === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth, courseUsdUah, 'crypt');
  }

  if (doge === sellCurrency && uah === buyCurrency || uah === sellCurrency && doge === buyCurrency) {
    formulaDefault(courseDoge, courseUsdUah, 'crypt');
  }

  if (tron === sellCurrency && uah === buyCurrency || uah === sellCurrency && tron === buyCurrency) {
    formulaDefault(courseTron, courseUsdUah, 'crypt');
  }

  //Crypt - Euro
  if (btc === sellCurrency && eur === buyCurrency || eur === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtcEur);
  }

  if (eth === sellCurrency && eur === buyCurrency || eur === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEthEur);
  }


  function searchMatches(currency, name) {
    if (buyCurrency === currency || sellCurrency === currency) {
      if (name === "rub") {
        rub = currency;
      } else if (name === 'uah') {
        uah = currency;
      } else if (name === 'usd') {
        usd = currency;
      } else if (name === 'eur')
        eur = currency
    }
  }


  function formulaDefault(mainCourse, course, value) {
    params.value = params.data.course.min_max_percent;
    let res
    if (sing === '+') {
      res = (mainCourse + (0.01 * mainCourse * (Number(params.value) - 0.1)) + (mainCourse * 0.001)).toFixed(4);
      if (value === 'crypt') {
        res = (mainCourse + (0.01 * mainCourse * (Number(params.value) - 0.1)) + (mainCourse * 0.001));
        res = (res * course).toFixed(4);
      }
    } else if (sing === '-') {
      res = (mainCourse + (0.01 * mainCourse * (Number(params.value) + 0.1)) - (mainCourse * 0.001)).toFixed(4);
      if (value === 'crypt') {
        res = (mainCourse + (0.01 * mainCourse * (Number(params.value) + 0.1)) - (mainCourse * 0.001));
        res = (res * course).toFixed(4);
      }
    } else {
      res = (mainCourse + (mainCourse * (Number(params.value) / 100))).toFixed(4);
      if (value === 'crypt') {
        res = (mainCourse + (mainCourse * (Number(params.value) / 100)))
        res = (res * course).toFixed(4);
      }
    }


    if (params.data.course.min_course !== "1") {
      rowNode.setDataValue([`course.min_course`], +res);
    } else {
      rowNode.setDataValue([`course.max_course`], +res)
    }


  }
}

users.addEventListener('change', function () {
  localStorage.setItem('user_id', this.value);
  receivingValue();
  receivingTemplate();
  resetTimeout();
})

templates.addEventListener('change', function (event) {
  limiter.value = '';
  sellCurrency.value = '';
  buyCurrency.value = '';
  localStorage.setItem('template_id', this.value);
  document.title = this.options[this.selectedIndex].text;
  receivingValue()
  resetTimeout()
})

buttonChange.forEach(item => {
  let timer
  let startTimer
  let dataInput = item.getAttribute('data-input');
  let input = document.querySelector(`.${dataInput}`);

  item.addEventListener('mousedown', function () {
    clearInterval(timer)
    clearTimeout(startTimer)
    calculator()
    startTimer = setTimeout(() => {
      timer = setInterval(() => {
        calculator()
      }, 60)
    }, 1000)
  })
  item.addEventListener('mouseup', function () {
    clearInterval(timer);
    clearTimeout(startTimer)
    if (input === limiter) {
      limiter.dispatchEvent(new Event("change"));
    } else if (input === sellCurrency) {
      sellCurrency.dispatchEvent(new Event("change"));
    } else if (input === buyCurrency) {
      buyCurrency.dispatchEvent(new Event("change"));
    }
  })

  function calculator() {
    let dataSign = item.getAttribute('data-sign');
    let number = Number(input.value);
    number = eval(`number
    ${dataSign}
    0.1`).toFixed(1)
    input.value = number;
  }
})

limiter.addEventListener('change', debounce(function (e) {
  let count = gridOptions.api.getDisplayedRowCount();
  let value = this.value;
  let courses = [];
  for (let i = 0; i < count; i++) {
    let rowNode = gridOptions.api.getDisplayedRowAtIndex(i);
    if (rowNode.data.course.is_active_limiter === '1') {
      rowNode.data.course.limiter = value
      rowNode.setDataValue([`course.limiter`], value)
      courses.push({
        course_id: rowNode.data.course.id,
        field: `limiter`,
        value: value,
      });
      gridOptions.api.flashCells({rowNodes: [rowNode], columns: [`course.limiter`]});
    }
  }
  changeMultiple(courses)
}, 1500));

sellCurrency.addEventListener('change', debounce(function (e) {
  let value = this.value;
  let originalIds = this.getAttribute('data-primary_currency_ids');
  let currency = document.querySelectorAll('.my-value');
  let courses = [];
  if (typeof originalIds === 'string') {
    originalIds.split(',').map(function (item) {
      currency.forEach(input => {
        let currencyIndex = input.getAttribute('data-index')
        let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${currencyIndex}`);
        if (input.getAttribute('data-sell-currency') === item) {
          input.value = value;
          rowNode.setDataValue([`course.min_max_percent`], value)
          courses.push({
            course_id: rowNode.data.course.id,
            field: 'min_max_percent',
            value: value
          });
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: [`course.min_max_percent`]});
        }
      })
    });
  }
  changeMultiple(courses)
}, 1500));

buyCurrency.addEventListener('change', debounce(function (e) {
  let value = this.value;
  let originalIds = this.getAttribute('data-primary_currency_ids');
  let currency = document.querySelectorAll('.my-value');
  let courses = [];
  if (typeof originalIds === 'string') {
    originalIds.split(',').map(function (item) {
      currency.forEach(input => {
        let currencyIndex = input.getAttribute('data-index')
        let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${currencyIndex}`);
        if (input.getAttribute('data-buy-currency') === item) {
          input.value = value;
          rowNode.setDataValue([`course.min_max_percent`], value)
          courses.push({
            course_id: rowNode.data.course.id,
            field: 'min_max_percent',
            value: value
          });
          gridOptions.api.flashCells({rowNodes: [rowNode], columns: [`course.min_max_percent`]});
        }
      })
    });
  }
  changeMultiple(courses)
}, 1500));


nav(gridOptions, template_id)
tableEnlargement();

refresh(receivingTable,gettingCourses);