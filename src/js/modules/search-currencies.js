import {changeCourseCity} from "./sending-data.js";

function searchCurrencies(res, par) {
  updateMerge(par.data.id, par)
  // Save data table
  res.forEach(item => {
    if (item.city && par.data.city) {
      if (item.city.code === par.data.city.code) {
        if (par.data.buyCurrency.code === "CASHUSD" && item.buyCurrency.code === "CASHUSD" || par.data.buyCurrency.code === "CASHEUR" && item.buyCurrency.code === "CASHEUR") {
          if (par.data.sellCurrency.code === "USDTERC20" && item.sellCurrency.code === "USDTTRC20" || par.data.sellCurrency.code === "USDTTRC20" && item.sellCurrency.code === "USDTERC20") {
            updateMerge(item.id, par)
          }
        } else if (par.data.sellCurrency.code === "CASHUSD" && item.sellCurrency.code === "CASHUSD" || par.data.sellCurrency.code === "CASHEUR" && item.sellCurrency.code === "CASHEUR") {
          if (par.data.buyCurrency.code === "USDTERC20" && item.buyCurrency.code === "USDTTRC20" || par.data.buyCurrency.code === "USDTTRC20" && item.buyCurrency.code === "USDTERC20") {
            updateMerge(item.id, par)
          }
        }
      }
    }
  })
// Update data table
  par.api.forEachNode((rowNode) => {
    if (rowNode.data.city && par.data.city) {
      if (rowNode.data.city.code === par.data.city.code) {
        if (par.data.buyCurrency.code === "CASHUSD" && rowNode.data.buyCurrency.code === "CASHUSD" || par.data.buyCurrency.code === "CASHEUR" && rowNode.data.buyCurrency.code === "CASHEUR") {
          if (par.data.sellCurrency.code === "USDTERC20" && rowNode.data.sellCurrency.code === "USDTTRC20" || par.data.sellCurrency.code === "USDTTRC20" && rowNode.data.sellCurrency.code === "USDTERC20") {
            if (localStorage.getItem('merge-cash') === '1' && par.colDef.field === 'rate') {
              rowNode.setDataValue([`rate`], par.data.rate)
              par.api.flashCells({rowNodes: [rowNode], columns: ['rate']});
            } else if (localStorage.getItem('merge-percentage-exchange') === '1' && par.colDef.field === 'min_max_percent') {
              rowNode.setDataValue([`min_max_percent`], par.data.min_max_percent)
              par.api.flashCells({rowNodes: [rowNode], columns: ['min_max_percent']});
            }
          }
        } else if (par.data.sellCurrency.code === "CASHUSD" && rowNode.data.sellCurrency.code === "CASHUSD" || par.data.sellCurrency.code === "CASHEUR" && rowNode.data.sellCurrency.code === "CASHEUR") {
          if (par.data.buyCurrency.code === "USDTERC20" && rowNode.data.buyCurrency.code === "USDTTRC20" || par.data.buyCurrency.code === "USDTTRC20" && rowNode.data.buyCurrency.code === "USDTERC20") {
            if (localStorage.getItem('merge-cash') === '1' && par.colDef.field === 'rate') {
              rowNode.setDataValue([`rate`], par.data.rate)
              par.api.flashCells({rowNodes: [rowNode], columns: ['rate']});
            } else if (localStorage.getItem('merge-percentage-exchange') === '1' && par.colDef.field === 'min_max_percent') {
              rowNode.setDataValue([`min_max_percent`], par.data.min_max_percent)
              par.api.flashCells({rowNodes: [rowNode], columns: ['min_max_percent']});
            }
          }
        }
      }
    }
  });
}

function updateMerge(id, value) {
  if (localStorage.getItem('merge-cash') === '1' && value.colDef.field === 'rate') {
    let data = JSON.stringify({
      id: id,
      field: 'rate',
      value: value.data.rate
    })
    changeCourseCity(data)
  } else if (localStorage.getItem('merge-percentage-exchange') === '1' && value.colDef.field === 'min_max_percent') {
    let data = JSON.stringify({
      id: id,
      field: 'min_max_percent',
      value: value.data.min_max_percent
    })
    changeCourseCity(data)
  } else {
    return false;
  }

}

export {searchCurrencies}