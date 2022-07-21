function windowOpen(params) {
  const links = document.createElement("div");
  links.innerHTML = `
   ${params.data.sellCurrency.name_ru} - ${params.data.buyCurrency.name_ru}
  <a class="icon__table"  href="https://dvigmakaki.xyz/course/view?id=${params.node.data.course.id}"  target="_blank">
      <i class='far fa-eye'></i>
    </a>
    <a class="icon__table open-window"  data-sell="${params.data.sellCurrency.code}" data-buy="${params.data.buyCurrency.code}">
      <i class="fas fa-chart-line"></i>
    </a>
  `
  
  let link = links.querySelector('.open-window')
  link.addEventListener('click', () => {
    let sellCurrency = link.getAttribute('data-sell')
    let buyCurrency = link.getAttribute('data-buy')
    
    openTab(sellCurrency, buyCurrency)
  });
  
  return links;
}

const openTab = (sellCurrency, buyCurrency) => {
  const namesMap = {
    BNBBEP20: 'binance-coin',
    ETH: 'ethereum',
    LTC: 'litecoin',
    ZEC: 'zcash',
    DASH: 'dash',
    DOGE: 'dogecoin',
    PRRUB: 'payeer-rub',
    MONOBUAH: 'monobank',
    RFBUAH: 'raiffeisen-bank-uah',
    USBUAH: 'ukrsibbank',
    OSDBUAH: 'oschadbank',
    CASHUSD: 'dollar-cash',
    CASHRUB: 'ruble-cash',
    P24UAH: 'privat24-uah',
    PMUSD: 'perfectmoney-usd',
    PRUSD: 'payeer',
    BTC: 'bitcoin',
    XRP: 'ripple',
    PMBBUAH: 'pumb',
    YAMRUB: 'yandex-money',
    OKUSD: 'okpay',
    WEXEUSD: 'wex',
    QWRUB: 'qiwi',
    ADVCUSD: 'advanced-cash',
    SBERRUB: 'sberbank',
    TCSBRUB: 'tinkoff',
    ACRUB: 'alfaclick',
    TBRUB: 'telebank',
    RUSSTRUB: 'russtandart',
    CARDRUB: 'visa-mastercard-rur',
    CARDUAH: 'visa-mastercard-uah',
    TRX: 'tron',
    CASHEUR: 'euro-cash',
    USDTTRC20: 'tether-trc20',
    USDTERC20: 'tether-erc20',
  };
  window.open("//bestchange.ru/" + namesMap[sellCurrency] + '-to-' + namesMap[buyCurrency] + ".html", 'example', 'width=1000,height=500');
  
}

export default windowOpen;