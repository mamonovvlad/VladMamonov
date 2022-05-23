const interval = "20",
  timerElement = document.getElementById('timer');

let leftTimeout = "20",
  timeout;


const resetTimeout = () => {
  timerElement.innerHTML = interval;
  clearInterval(timeout);
  timeout = null;
  timeout = setInterval(timer, 1000);
}

const startTimeout = () => {
  timerElement.innerHTML = leftTimeout;
  timeout = setInterval(timer, 1000);
}

function pauseTimeout() {
  leftTimeout = timerElement.innerHTML;
  clearInterval(timeout);
  timeout = null;
}

//test

function timer() {
  timerElement.innerHTML = parseInt(timerElement.innerHTML) - 1;
  if (timerElement.innerHTML <= "0") {
    timerElement.innerHTML = interval;
    refresh()
  }
}




let func1;
let func2;
function refresh(receivingTable, gettingCourses) {
  if (receivingTable !== undefined && gettingCourses !== undefined) {
    func1 = receivingTable;
    func2 = gettingCourses;
  }
  func1();
  func2();
}


export {startTimeout, resetTimeout, pauseTimeout, refresh, timeout};
