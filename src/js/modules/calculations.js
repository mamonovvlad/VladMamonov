import {
  courseUsdRub,
  courseUahRub,
  courseUsdUah,
  courseEurUsd,
  courseUsdKzt,
  courseRubKzt,
  courseUahKzt,
  courseBtc,
  courseDash,
  courseZec,
  courseLtc,
  courseBnb,
  courseEth,
  courseDoge,
  courseTron,
  courseEthEur,
  courseBtcEur,
} from "./getting-courses.js";

const usdId = [1, 2, 6, 7, 8, 12, 28, 29, 30, 42];
const uahId = [3, 5, 26, 31, 35, 43, 44, 45];
const rubId = [9, 11, 13, 14, 15, 16, 17, 18, 23, 24, 37, 40];
const eurId = [32, 48];
const kztId = [50, 51];


export default function calculationsData(params, sing) {
  let rowNode = params.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  let buyCurrency = Number(params.node.data.buyCurrency.id);
  let sellCurrency = Number(params.node.data.sellCurrency.id);
  let rub;
  let usd;
  let uah;
  let eur;
  let kzt;

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


  let currencies = [
    {
      name: 'rub',
      value: rub
    },
    {
      name: 'usd',
      value: usd
    },
    {
      name: 'uah',
      value: uah
    },
    {
      name: 'eur',
      value: eur
    },
    {
      name: 'kzt',
      value: kzt
    }
  ];
  let crypt = [
    {
      name: 'btc',
      value: 4,
      course: courseBtc
    }, {
      name: 'dash',
      value: 20,
      course: courseDash
    }, {
      name: 'zec',
      value: 21,
      course: courseZec
    }, {
      name: 'ltc',
      value: 19,
      course: courseLtc
    }, {
      name: 'eth',
      value: 25,
      course: courseEth
    }, {
      name: 'doge',
      value: 39,
      course: courseDoge
    }, {
      name: 'tron',
      value: 46,
      course: courseTron
    }, {
      name: 'bnb',
      value: 49,
      course: courseBnb
    },
  ]

  //Definition of currencies
  function definitionCurrencies(arr, curr, course, val) {
    for (let item of arr) {
      if (typeof item.value !== "undefined") {
        if (item.value === sellCurrency && curr === buyCurrency || curr === sellCurrency && item.value === buyCurrency) {
          if (curr === usd && (item.name === 'doge' || item.name === 'tron')) {
            let res = (1 / item.course);
            formulaDefault(res)
          } else if (val === 'curr') {
            formulaDefault(course)
          } else {
            formulaDefault(item.course, course, val);
          }
        }
      }
    }
  }

  //currency
  definitionCurrencies(currencies, usd, courseUsdRub, 'curr')
  definitionCurrencies(currencies, usd, courseEurUsd, 'curr')
  definitionCurrencies(currencies, usd, courseUsdUah, 'curr')
  definitionCurrencies(currencies, usd, courseUsdKzt, 'curr')
  definitionCurrencies(currencies, rub, courseUahRub, 'curr')
  definitionCurrencies(currencies, rub, courseRubKzt, 'curr')
  definitionCurrencies(currencies, uah, courseUahKzt, 'curr')
  //crypto
  definitionCurrencies(crypt, eur);
  definitionCurrencies(crypt, usd);
  definitionCurrencies(crypt, rub, courseUsdRub, 'crypt');
  definitionCurrencies(crypt, uah, courseUsdUah, 'crypt');
  definitionCurrencies(crypt, kzt, courseUsdKzt, 'crypt');

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