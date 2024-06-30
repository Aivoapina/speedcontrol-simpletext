$(() => {
  const container = document.getElementById('cont');

  container.onclick = () => {
    container.requestFullscreen();
  }

  container.ondblclick = () => {
    document.exitFullscreen();
  }
});