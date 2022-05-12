export default function tableEnlargement() {
  const zoomIn = document.querySelector('.zoom-in'),
    zoomOut = document.querySelector('.zoom-out'),
    zoomReset = document.querySelector('.zoom-reset');

  let zoom = Number(localStorage.getItem('zoom'));


  zoomIn.addEventListener('click', () => {
    zoom = (Number(zoom) + 0.1).toFixed(1);
    localStorage.setItem('zoom', zoom);
    document.getElementById('table').style.zoom = zoom;
  })


  zoomOut.addEventListener('click', () => {
    zoom = (zoom - 0.1).toFixed(1);
    localStorage.setItem('zoom', zoom);
    document.getElementById('table').style.zoom = zoom;
  })

  zoomReset.addEventListener('click', () => {
    zoom = 1
    localStorage.setItem('zoom', zoom);
    document.getElementById('table').style.zoom = zoom;
  })


  if (zoom === null || zoom === 0) {
    zoom = 1;
  }

  if (localStorage.getItem("zoom")) {
    document.getElementById('table').style.zoom = localStorage.getItem("zoom");
  }
}

