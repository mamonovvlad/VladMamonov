import {pauseTimeout, startTimeout, timeout} from "./timeout.js";
import {updateTable, changeCourseCity} from "./sending-data.js";
import debounce from "./debounce.js";


export default function buttonsRenderer(params, gridOptions, number, calculationsData) {
  
  const sellCurrency = document.querySelector('.sell-currency'),
    buyCurrency = document.querySelector('.buy-currency'),
    buttons = document.createElement("div");
  
  let rowNode = gridOptions.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  
  if (rowNode.data.template !== undefined) {
    let originalIds = rowNode.data.template.primary_currency_ids;
    if (originalIds !== null && originalIds !== "" && typeof originalIds === 'string') {
      originalIds.split(',').map(function (item) {
        if (rowNode.data.sellCurrency.id === item) {
          sellCurrency.placeholder = `${rowNode.data.sellCurrency.name_ru} на что-то`;
          sellCurrency.setAttribute('data-primary_currency_ids', `${params.data.template.primary_currency_ids}`)
        } else if (rowNode.data.buyCurrency.id === item) {
          buyCurrency.placeholder = `Что-то на  ${rowNode.data.buyCurrency.name_ru}`
          buyCurrency.setAttribute('data-primary_currency_ids', `${params.data.template.primary_currency_ids}`)
        }
      });
    } else {
      sellCurrency.placeholder = `Валюта не назначена`
      buyCurrency.placeholder = `Валюта не назначена`
    }
  }
  
  
  buttons.className = 'min_max_percent'
  buttons.innerHTML = `
    <button class="button-percent" data-sign="-">-</button>
        <span class="my-value"></span>
    <button class="button-percent" data-sign="+">+</button>`;
  
  let eValue = buttons.querySelector('.my-value'),
    buttonPercent = buttons.querySelectorAll('.button-percent');
  
  eValue.innerHTML = params.data.course.min_max_percent === '' ? '0' : +params.data.course.min_max_percent;
  eValue.setAttribute('data-index', `${rowNode.rowIndex}`)
  eValue.setAttribute('data-sell-currency', `${rowNode.data.sellCurrency.id}`)
  eValue.setAttribute('data-buy-currency', `${rowNode.data.buyCurrency.id}`)
  
  eValue.addEventListener("click", () => {
    params.colDef.editable = true;
  });
  
  
  buttonPercent.forEach(item => {
    // При нажатии (Таймер Начинается)
    item.addEventListener('mousedown', (e,) => {
      params.colDef.editable = false;
      editData(e.target.dataset.sign);
    })
    
    
    //При клике (Отправка)
    item.addEventListener('click', debounce((e) => {
      if (number === 0) {
        clearInterval(timeout);
        calculationsData(params, e.target.dataset.sign)
      }
      sendData();
    }, 500));
    
  })
  
  
  function editData(sing) {
    calculator(sing)
    if (number === 0) {
      pauseTimeout();
    }
    
  }
  
  
  function calculator(sing) {
    let number = Number(params.value);
    number = eval(`number
    ${sing}
    0.1`).toFixed(2);
    params.value = +number;
    params.data.course.min_max_percent = +number;
    params.eParentOfValue.querySelector('.my-value').innerHTML = +number;
  }
  
  function sendData() {
    let number = params.value;
    let data = JSON.stringify({
      id: params.node.data.course.id,
      field: params.column.colId,
      value: String(number)
    })
    if (number === 0) {
      startTimeout();
      updateTable(data);
    } else if (number === 1) {
      changeCourseCity(data)
    } else {
      return false
    }
    
  }
  
  return buttons;
}

