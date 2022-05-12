export function nav(gridOptions, template) {

  const linkCopy = document.querySelector('.link__copy'),
    linkEdit = document.querySelector('.link__edit'),
    autoSizeAll = document.querySelector('.auto-size-all'),
    sizeToFit = document.querySelector('.size-to-fit'),
    verificationInput = document.querySelectorAll('.verification-input'),
    closeBurger = document.querySelector('.close__burger'),
    resetColumns = document.querySelector('.reset__columns'),
    resetRow = document.querySelector('.reset__row');

  let sortCol = [],
    sortInp = [];

  closeBurger.addEventListener('click', () => {
    document.querySelector('.ham').classList.toggle('active');
    document.querySelector('.buttons').classList.toggle('active-block');
  })


  if (template !== undefined) {
    linkEdit.addEventListener('click', function () {
      this.setAttribute("href", `/course-template/update?id=${template}`);
    })

    linkCopy.addEventListener('click', function () {
      this.setAttribute("href", `/course-template/copy?id=${template}`);
    })
  }

  autoSizeAll.addEventListener('click', () => {
    autoSize(false)
  });

  sizeToFit.addEventListener('click', () => {
    maxSize()
  });

  verificationInput.forEach(item => {
    item.addEventListener('keyup', () => {
      item.value = item.value.replace(/,/, '.');
    })

  })


  const determineSize = () => {
    if (localStorage.getItem('size')) {
      setTimeout(() => {
        if (localStorage.getItem('size') === '0') {
          autoSize(false);
        } else {
          maxSize()
        }
      }, 1000)
    }

  }

  const autoSize = (skipHeader) => {
    let allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    localStorage.setItem('size', '0')
  }

  const maxSize = () => {
    localStorage.setItem('size', '1')
    gridOptions.api.sizeColumnsToFit();
  }

///////////


  resetColumns.addEventListener('click', () => {
    localStorage.removeItem('hide');
  })

  if (resetRow) {
    resetRow.addEventListener('click', () => {
      localStorage.removeItem('row_id');
    })
  }


  document.querySelectorAll('.show-list').forEach(item => {
    let button = item.querySelector('button');
    let items = item.querySelector('.list-items');
    button.addEventListener('click', () => {
      items.classList.toggle('open');
    })
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest('.show-list') || null) {
      document.querySelectorAll('.list-items').forEach(item => {
        item.classList.remove('open');
      })

    }
  })


  const deleteColumn = () => {
    gridOptions.columnDefs.forEach(item => {
      sortCol.push(item)
      let li;
      li = document.createElement('li');
      li.innerHTML = `
  <label>
      <input type="checkbox" class="default-checkbox hide" data-idx="${item.sortIndex}">
      <span>${item.headerName}</span> 
  </label>
  `
      document.getElementById("filter-col").append(li);
    })

    for (let i = 0; i < document.querySelectorAll('.hide').length; i++) {
      let inp = document.querySelectorAll('.hide')[i];
      if (localStorage.getItem("hide")) {
        let saveHide = localStorage.getItem("hide").split(',');
        for (let a = 0; a < saveHide.length; a++) {
          if (saveHide[a] === inp.getAttribute('data-idx') && saveHide[a] === String(sortCol[i].sortIndex)) {
            inp.checked = true;
            sortCol[i].hide = true
          }
        }
      }
      inp.addEventListener('change', () => {
        if (Number(inp.getAttribute('data-idx')) === sortCol[i].sortIndex) {
          if (inp.checked === true) {
            sortInp.push(inp.getAttribute('data-idx'));
            sortCol[i].hide = true;
            localStorage.setItem('hide', String(sortInp));
          } else {
            sortCol[i].hide = false;
            localStorage.removeItem('hide')
          }
        }
      })
    }
  }


  deleteColumn();

  determineSize();

}

