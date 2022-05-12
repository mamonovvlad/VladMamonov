const interval = "20",
  timerElement = document.getElementById('timer');

let leftTimeout = "20",
  firstFun = null,
  secondFun = null,
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
const timer = (a, b) => {
  if (a !== undefined && b !== undefined) {
    firstFun = a;
    secondFun = b;
  }
  timerElement.innerHTML = parseInt(timerElement.innerHTML) - 1;
  if (timerElement.innerHTML <= "0") {
    timerElement.innerHTML = interval;
    firstFun();
    secondFun();
  }

}


export {startTimeout, resetTimeout, pauseTimeout, timer, timeout};
