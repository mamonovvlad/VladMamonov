import {
  courseUsdRub,
  courseUahRub,
  courseUsdUah,
  courseEurUsd,
  courseUsdKzt,
  courseRubKzt,
  courseUahKzt,
  courseEthEur,
  courseBtcEur,
  courseBtc,
  courseDash,
  courseZec,
  courseLtc,
  courseBnb,
  courseEth,
  courseDoge,
  courseTron
} from "./getting-courses.js";

const usdId = [1, 2, 6, 7, 8, 12, 28, 29, 30, 42];
const uahId = [3, 5, 26, 31, 35, 43, 44, 45];
const rubId = [9, 11, 13, 14, 15, 16, 17, 18, 23, 24, 37, 40];
const eurId = [32, 48];
const kztId = [50, 51];

let rub;
let usd;
let uah;
let eur;
let kzt;


//cripta
const btc = 4;
const dash = 20;
const zec = 21;
const ltc = 19;
const eth = 25;
const doge = 39;
const tron = 46;
const bnb = 49;

export default function calculationsData(params, sing) {

  let rowNode = params.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  let buyCurrency = Number(params.node.data.buyCurrency.id);
  let sellCurrency = Number(params.node.data.sellCurrency.id);

  rubId.forEach(currency => {
    searchMatches(currency, 'rub')
  });

  usdId.forEach(currency => {
    searchMatches(currency, 'usd')
  });

  uahId.forEach(currency => {
    searchMatches(currency, 'uah')
  });

  eurId.forEach(currency => {
    searchMatches(currency, 'eur')
  });

  kztId.forEach(currency => {
    searchMatches(currency, 'kzt')
  })

  if (rub === sellCurrency && usd === buyCurrency || usd === sellCurrency && rub === buyCurrency) {
    formulaDefault(courseUsdRub)
  }

  if (uah === sellCurrency && usd === buyCurrency || usd === sellCurrency && uah === buyCurrency) {
    formulaDefault(courseUsdUah)
  }

  if (uah === sellCurrency && rub === buyCurrency || rub === sellCurrency && uah === buyCurrency) {
    formulaDefault(courseUahRub)
  }

  if (eur === sellCurrency && usd === buyCurrency || usd === sellCurrency && eur === buyCurrency) {
    console.log(courseEurUsd)
  }


//kzt
  if (kzt === sellCurrency && usd === buyCurrency || usd === sellCurrency && kzt === buyCurrency) {
    formulaDefault(courseUsdKzt)
  }

  if (kzt === sellCurrency && rub === buyCurrency || rub === sellCurrency && kzt === buyCurrency) {
    console.log(courseRubKzt)
    formulaDefault(courseRubKzt)
  }

  if (kzt === sellCurrency && uah === buyCurrency || uah === sellCurrency && kzt === buyCurrency) {
    formulaDefault(courseUahKzt)
  }


  //Crypt - Usd
  if (btc === sellCurrency && usd === buyCurrency || usd === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc)
  }

  if (dash === sellCurrency && usd === buyCurrency || usd === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash)
  }
  
  if (zec === sellCurrency && usd === buyCurrency || usd === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec)
  }
  
  if (ltc === sellCurrency && usd === buyCurrency || usd === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc)
  }
  
  if (bnb === sellCurrency && usd === buyCurrency || usd === sellCurrency && bnb === buyCurrency) {
    formulaDefault(courseBnb)
  }
  
  if (eth === sellCurrency && usd === buyCurrency || usd === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth)
  }
  
  if (doge === sellCurrency && usd === buyCurrency || usd === sellCurrency && doge === buyCurrency) {
    let res = (1 / courseDoge);
    formulaDefault(res)
  }
  if (tron === sellCurrency && usd === buyCurrency || usd === sellCurrency && tron === buyCurrency) {
    let res = (1 / courseTron);
    formulaDefault(res)
  }
  
  //Crypt - Rus
  if (btc === sellCurrency && rub === buyCurrency || rub === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc, courseUsdRub, 'crypt');
  }
  
  if (dash === sellCurrency && rub === buyCurrency || rub === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash, courseUsdRub, 'crypt');
  }
  
  if (zec === sellCurrency && rub === buyCurrency || rub === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec, courseUsdRub, 'crypt');
  }
  
  if (ltc === sellCurrency && rub === buyCurrency || rub === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc, courseUsdRub, 'crypt');
  }
  
  if (bnb === sellCurrency && rub === buyCurrency || rub === sellCurrency && bnb === buyCurrency) {
    formulaDefault(courseBnb, courseUsdRub, 'crypt')
  }
  
  if (eth === sellCurrency && rub === buyCurrency || rub === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth, courseUsdRub, 'crypt');
  }
  
  if (doge === sellCurrency && rub === buyCurrency || rub === sellCurrency && doge === buyCurrency) {
    formulaDefault(courseDoge, courseUsdRub, 'crypt');
  }
  if (tron === sellCurrency && rub === buyCurrency || rub === sellCurrency && tron === buyCurrency) {
    formulaDefault(courseTron, courseUsdRub, 'crypt');
  }
  
  //Crypt - Uah
  if (btc === sellCurrency && uah === buyCurrency || uah === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc, courseUsdUah, 'crypt');
  }
  
  if (dash === sellCurrency && uah === buyCurrency || uah === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash, courseUsdUah, 'crypt');
  }
  
  if (zec === sellCurrency && uah === buyCurrency || uah === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec, courseUsdUah, 'crypt');
  }
  
  if (ltc === sellCurrency && uah === buyCurrency || uah === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc, courseUsdUah, 'crypt');
  }
  
  if (bnb === sellCurrency && uah === buyCurrency || uah === sellCurrency && bnb === buyCurrency) {
    formulaDefault(courseBnb, courseUsdUah, 'crypt')
  }
  
  if (eth === sellCurrency && uah === buyCurrency || uah === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth, courseUsdUah, 'crypt');
  }

  if (doge === sellCurrency && uah === buyCurrency || uah === sellCurrency && doge === buyCurrency) {
    formulaDefault(courseDoge, courseUsdUah, 'crypt');
  }

  if (tron === sellCurrency && uah === buyCurrency || uah === sellCurrency && tron === buyCurrency) {
    formulaDefault(courseTron, courseUsdUah, 'crypt');
  }

  //Crypt - Kzt
  if (btc === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtc, courseUsdKzt, 'crypt');
  }

  if (dash === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && dash === buyCurrency) {
    formulaDefault(courseDash, courseUsdKzt, 'crypt');
  }

  if (zec === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && zec === buyCurrency) {
    formulaDefault(courseZec, courseUsdKzt, 'crypt');
  }

  if (ltc === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && ltc === buyCurrency) {
    formulaDefault(courseLtc, courseUsdKzt, 'crypt');
  }

  if (bnb === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && bnb === buyCurrency) {
    formulaDefault(courseBnb, courseUsdKzt, 'crypt')
  }

  if (eth === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEth, courseUsdKzt, 'crypt');
  }

  if (doge === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && doge === buyCurrency) {
    formulaDefault(courseDoge, courseUsdKzt, 'crypt');
  }

  if (tron === sellCurrency && kzt === buyCurrency || kzt === sellCurrency && tron === buyCurrency) {
    formulaDefault(courseTron, courseUsdKzt, 'crypt');
  }

  //Crypt - Euro
  if (btc === sellCurrency && eur === buyCurrency || eur === sellCurrency && btc === buyCurrency) {
    formulaDefault(courseBtcEur);
  }

  if (eth === sellCurrency && eur === buyCurrency || eur === sellCurrency && eth === buyCurrency) {
    formulaDefault(courseEthEur);
  }
  
  
  function searchMatches(currency, name) {
    if (buyCurrency === currency || sellCurrency === currency) {
      if (name === "rub") {
        rub = currency;
      } else if (name === 'uah') {
        uah = currency;
      } else if (name === 'usd') {
        usd = currency;
      } else if (name === 'eur') {
        eur = currency;
      } else if (name === 'kzt') {
        kzt = currency;
      }
    }
  }
  
  
  function formulaDefault(mainCourse, course, value) {
    params.value = params.data.course.min_max_percent;
    let res
    if (sing === '+') {
      res = (mainCourse + (0.01 * mainCourse * (Number(params.value) - 0.1)) + (mainCourse * 0.001)).toFixed(4);
      if (value === 'crypt') {
        res = (mainCourse + (0.01 * mainCourse * (Number(params.value) - 0.1)) + (mainCourse * 0.001));
        res = (res * course).toFixed(4);
      }
    } else if (sing === '-') {
      res = (mainCourse + (0.01 * mainCourse * (Number(params.value) + 0.1)) - (mainCourse * 0.001)).toFixed(4);
      if (value === 'crypt') {
        res = (mainCourse + (0.01 * mainCourse * (Number(params.value) + 0.1)) - (mainCourse * 0.001));
        res = (res * course).toFixed(4);
      }
    } else {
      res = (mainCourse + (mainCourse * (Number(params.value) / 100))).toFixed(4);
      if (value === 'crypt') {
        res = (mainCourse + (mainCourse * (Number(params.value) / 100)))
        res = (res * course).toFixed(4);
      }
    }
    
    if (params.data.course.min_course !== "1" && params.data.course.min_course !== 1) {
      rowNode.setDataValue([`course.min_course`], +res);
    } else {
      rowNode.setDataValue([`course.max_course`], +res)
    }
  }
}