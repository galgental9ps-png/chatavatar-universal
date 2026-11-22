/* Jimmy: detailed painted sprites and a eight complete walking frames with a consistent shoulder perspective. */
(function () {
  'use strict';
  const source = document.currentScript;
  const base = new URL('.', source.src).href;
  const images = {
    poses: base + 'assets/jimmy-poses-v1.webp',
    walk: base + 'assets/jimmy-walk-v2.webp'
  };
  let loaded;
  const poses = { idle: 0, wave: 1, talk: 2, point: 3, think: 13, held: 14, rest: 15, celebrate: 12, fall: 10, land: 11 };
  function paint(element, state = 'idle', frame = 0, facing = 1) {
    const sheet = state === 'walk' ? 'walk' : 'poses';
    const index = state === 'walk' ? frame % 8 : state === 'jump' ? [8,9,10,11][Math.min(3,frame)] : poses[state] ?? 0;
    const rows = sheet === 'walk' ? 2 : 4;
    if (element.dataset.sheet !== sheet) {
      element.style.backgroundImage = 'url("' + images[sheet] + '")';
      element.style.backgroundSize = '400% ' + (rows * 100) + '%';
      element.dataset.sheet = sheet;
    }
    element.style.backgroundPosition = ((index % 4) * 100 / 3) + '% ' + (Math.floor(index / 4) * 100 / (rows - 1)) + '%';
    element.style.scale = facing + ' 1';
    element.dataset.frame = String(index);
    element.dataset.pose = state;
  }
  window.JimmyMascot = {
    images,
    preload() {
      if (!loaded) loaded = Promise.all(Object.values(images).map(url => new Promise((resolve,reject) => {
        const image = new Image(); image.onload = resolve; image.onerror = () => reject(Error('Die Jimmy-Grafik konnte nicht geladen werden.')); image.src = url;
      })));
      return loaded;
    },
    create() {
      const element = document.createElement('span');
      element.className = 'jimmy-frame';
      element.setAttribute('aria-hidden','true');
      paint(element);
      return element;
    },
    paint
  };
})();
