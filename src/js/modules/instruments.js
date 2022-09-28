let rowsId = [];

export function instruments(params, gridOptions, res) {
  let buttons = document.createElement('span')
  buttons.classList.add('buttons__icons')
  buttons.innerHTML = `
    <a href="/course-city/view?id=${params.data.id}" target="_blank" title="Просмотр" class="fa-solid fa-eye"></a>
    <a href="/course-city/update?id=${params.data.id}" target="_blank" title="Редактировать" class="fa-solid fa-pen-to-square"></a>
    <a href="/course-city/delete?id=${params.data.id}"  target="_blank" title="Удалить" data-method="POST" class="fa-solid fa-trash-can"></a>
    <button class="btn btn__delete" style="display: none"  data-row-idx="${params.data.id}">Удалить</button>
  `
  return buttons;
}


