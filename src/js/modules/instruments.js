let rowsId = [];

export function instruments(params, gridOptions, res) {
  let buttons = document.createElement('span')
  buttons.classList.add('buttons__icons')
  buttons.innerHTML = `
    <a href="/course-city/view?id=${params.data.id}" target="_blank" title="Просмотр" class="fa-solid fa-eye"></a>
    <a href="/course-city/update?id=${params.data.id}" target="_blank" title="Редактировать" class="fa-solid fa-pen-to-square"></a>
    <a href="/course-city/delete?id=${params.data.id}"  target="_blank" title="Удалить" data-method="POST" class="fa-solid fa-trash-can"></a>
    <button class="btn btn__delete"  data-row-idx="${params.data.id}">Удалить</button>
  `

  let btnDelete = buttons.querySelector('.btn__delete');

  btnDelete.addEventListener('click', function () {
    hideRow(btnDelete, res, params, gridOptions);
  })

  return buttons;
}


function hideRow(btn, res, params, gridOptions) {
  let firstRow = gridOptions.api.getFirstDisplayedRow();
  let lastRow = gridOptions.api.getLastDisplayedRow();

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

