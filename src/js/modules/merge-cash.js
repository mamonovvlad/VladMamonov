let inputMergeCash = document.querySelector('.merge-cash input');
let inputMergePercentageExchange = document.querySelector('.merge-percentage-exchange input');
function mergeCash() {
  if (localStorage.getItem('merge-cash') !== null) {
    if (localStorage.getItem('merge-cash') === '1') {
      inputMergeCash.checked = true;
      inputMergeCash.value = localStorage.getItem('merge-cash')
    } else {
      inputMergeCash.checked = false;
      inputMergeCash.value = localStorage.getItem('merge-cash')
    }
  }

  inputMergeCash.addEventListener('change', () => {
    if (inputMergeCash.value === '0') {
      localStorage.setItem('merge-cash', '1');
      inputMergeCash.value = '1'
    } else {
      inputMergeCash.value = '0'
      localStorage.setItem('merge-cash', '0');
    }
  })
}
function mergePercentageExchange() {
  if (localStorage.getItem('merge-percentage-exchange') !== null) {
    if (localStorage.getItem('merge-percentage-exchange') === '1') {
      inputMergePercentageExchange.checked = true;
      inputMergePercentageExchange.value = localStorage.getItem('merge-percentage-exchange')
    } else {
      inputMergePercentageExchange.checked = false;
      inputMergePercentageExchange.value = localStorage.getItem('merge-percentage-exchange')
    }
  }

  inputMergePercentageExchange.addEventListener('change', () => {
    if (inputMergePercentageExchange.value === '0') {
      localStorage.setItem('merge-percentage-exchange', '1');
      inputMergePercentageExchange.value = '1'
    } else {
      inputMergePercentageExchange.value = '0'
      localStorage.setItem('merge-percentage-exchange', '0');
    }
  })
}

export { mergeCash ,mergePercentageExchange}