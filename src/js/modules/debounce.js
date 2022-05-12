export default function debounce(func, wait, immediate) {
  let time;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      time = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !time;
    clearTimeout(time);
    time = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  }
}