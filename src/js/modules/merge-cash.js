export default function mergeCash() {
  let input = document.querySelector('.merge-cash input');

  if (localStorage.getItem('merge-cash') !== null) {
    if (localStorage.getItem('merge-cash') === '1') {
      input.checked = true;
      input.value = localStorage.getItem('merge-cash')
    } else {
      input.checked = false;
      input.value = localStorage.getItem('merge-cash')
    }
  }

  input.addEventListener('change', () => {
    if (input.value === '0') {
      localStorage.setItem('merge-cash', '1');
      input.value = '1'
    } else {
      input.value = '0'
      localStorage.setItem('merge-cash', '0');
    }
  })
}

