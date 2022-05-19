let rowsId = [];
let rowsMain = [];

export function instruments(params, gridOptions, res) {
  let buttons = document.createElement('span')
  buttons.classList.add('buttons__icons')
  buttons.innerHTML = `
    <a href="/course-city/view?id=${params.data.id}" target="_blank" title="Просмотр" class="fa-solid fa-eye"></a>
    <a href="/course-city/update?id=${params.data.id}" target="_blank" title="Редактировать" class="fa-solid fa-pen-to-square"></a>
    <a href="/course-city/delete?id=${params.data.id}"  target="_blank" title="Удалить" data-method="POST" class="fa-solid fa-trash-can"></a>
    <button class="btn btn__delete"  data-row-idx="${params.data.id}">Удалить</button>
    <button class="btn btn__open" style="display: none"  data-row-idx="${params.data.id}">Открыть</button>
  `
  if (params.data.is_primary) {
    let showBtn = buttons.querySelector('.btn__open');
    showBtn.style.display = 'block';
  }


  let btnDelete = buttons.querySelector('.btn__delete');
  let btnOpen = buttons.querySelector('.btn__open');

  btnDelete.addEventListener('click', function () {
    hideRow(btnDelete, res, params, gridOptions);
  })
  btnOpen.addEventListener('click', function () {
    openList(btnOpen, res, params, gridOptions);
  })

  return buttons;
}


function hideRow(btn, res, params, gridOptions) {
  var firstRow = gridOptions.api.getFirstDisplayedRow();
  var lastRow = gridOptions.api.getLastDisplayedRow();

  gridOptions.api.forEachNodeAfterFilter(function (node, index) {
    if (index >= firstRow && index <= lastRow) {
      node.setSelected(true);
    }
  });


  res.forEach((item, idx) => {
    if (item.id === Number(btn.getAttribute('data-row-idx'))) {
      btn.style.backgroundColor = 'red';
      rowsId.push(item.id)
      localStorage.setItem('row_id', JSON.stringify(rowsId));
      rowsId = JSON.parse(localStorage.getItem('row_id'));

      const statusBarComponent = gridOptions.api.getStatusPanel('statusBarCompKey');
      statusBarComponent.setVisible(!statusBarComponent.isVisible());


    }
  })
}


function openList(btn, res, params, gridOptions) {
  localStorage.removeItem('row_main');
  let sell;
  let buy;
  if (params.data.id === Number(btn.getAttribute('data-row-idx'))) {
    buy = params.data.buyCurrency.code;
    sell = params.data.sellCurrency.code;
  }
  res.forEach((item, idx) => {
    if (buy === item.buyCurrency.code && sell === item.sellCurrency.code && item.is_primary === 0) {
      rowsMain.push(item.id)
      localStorage.setItem('row_main', JSON.stringify(rowsMain));
      rowsMain = JSON.parse(localStorage.getItem('row_main'));
    }
  })

}

