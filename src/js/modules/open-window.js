function windowOpen(params, number = 0) {
  const links = document.createElement("div");
  links.innerHTML = `
   ${params.data.sellCurrency.name_ru} - ${params.data.buyCurrency.name_ru}
   
   ${number !== 1 ? `
        <a class='icon__table' href='https://dvigmakaki.xyz/course/view?id=${params.node.data.course.id}'  target='_blank'><i class=\'far fa-eye\'></i></a>
        <a class='icon__table open-window'data-sell='${params.data.sellCurrency.code}' data-buy='${params.data.buyCurrency.code}'><i class='fas fa-chart-line'></i></a` :
    `<a class='icon__table open-window' data-city='${params.data.city.code}'  data-sell='${params.data.sellCurrency.code}' data-buy='${params.data.buyCurrency.code}'><i class='fas fa-chart-line'></i></a>`
  }
  `
  
  let link = links.querySelector('.open-window')
  link.addEventListener('click', () => {
    let sellCurrency = link.getAttribute('data-sell')
    let buyCurrency = link.getAttribute('data-buy')
    let getCity = link.getAttribute('data-city')
    openTab(params,sellCurrency, buyCurrency, getCity, number)
  });
  
  return links;
}

const openTab = (params,sellCurrency, buyCurrency, getCity, number) => {
  if (number !== 1) {
    window.open("//bestchange.ru/" + params.data.sellCurrency.bestchange_code + '-to-' + params.data.buyCurrency.bestchange_code + ".html", 'example', 'width=1000,height=500');
  } else {
    window.open("//bestchange.ru/" + params.data.sellCurrency.bestchange_code + '-to-' + params.data.buyCurrency.bestchange_code + '-in-' + params.data.city.code.toLowerCase() + ".html", 'example', 'width=1000,height=500');
  }
  
}

export default windowOpen;