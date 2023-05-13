const proxy = "/proxy.php?url=";
export let courseUsdRub,
  courseUsdUah,
  courseEurUsd,
  courseUahRub,
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
  courseTron,
  courseCadUsd,
  courseGbpUsd;

export const gettingCourses = function () {
  let url = proxy +
    encodeURIComponent(
      `https://api.7money.co/v1/static-data?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    );
  fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }).then(res => res.json()).then(res => {
    for (let value of res) {
      let data;
      if (value.name === 'usd_uah_course') {
        courseUsdUah = Number(value.value);
      } else if (value.name === 'usd_rub_course') {
        courseUsdRub = Number(value.value);
      } else if (value.name === 'uah_rub_course') {
        courseUahRub = Number(value.value);
      } else if (value.name === 'eur_usd_course') {
        courseEurUsd = Number(value.value)
      } else if (value.name === 'usd_kzt_course') {
        courseUsdKzt = Number(value.value)
      } else if (value.name === 'rub_kzt_course') {
        courseRubKzt = Number(value.value)
      } else if (value.name === 'uah_kzt_course') {
        courseUahKzt = Number(value.value)
      } else if (value.name === 'bitcoin_course') {
        data = JSON.parse(value.value);
        courseBtc = Number(data.usd);
      } else if (value.name === 'dash_course') {
        data = JSON.parse(value.value);
        courseDash = Number(data.usd);
      } else if (value.name === 'zcash_course') {
        data = JSON.parse(value.value);
        courseZec = Number(data.usd);
      } else if (value.name === 'litecoin_course') {
        data = JSON.parse(value.value);
        courseLtc = Number(data.usd);
      } else if (value.name === 'ethereum_course') {
        data = JSON.parse(value.value);
        courseEth = Number(data.usd);
      } else if (value.name === 'dogecoin_course') {
        data = JSON.parse(value.value);
        courseDoge = Number(data.usd);
      } else if (value.name === 'tron_course') {
        data = JSON.parse(value.value);
        courseTron = Number(data.usd);
      } else if (value.name === 'bitcoin_euro_course') {
        data = JSON.parse(value.value);
        courseBtcEur = Number(data.usd);
      } else if (value.name === 'ethereum_euro_course') {
        data = JSON.parse(value.value);
        courseEthEur = Number(data.usd);
      } else if (value.name === 'bnb_course') {
        data = JSON.parse(value.value);
        courseBnb = Number(data.usd);
      } else if (value.name === 'cad_usd_course') {
        data = JSON.parse(value.value);
        courseCadUsd = Number(data);
      } else if (value.name === 'gbp_usd_course') {
        data = JSON.parse(value.value);
        courseGbpUsd = Number(data);
      }
    }
  });
}
