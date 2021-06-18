const initMountainSlider = () => {
  console.log('mountain slider');
  const mountains = document.querySelectorAll('.mountain');
  mountains.forEach((mountain) => {
    mountain.addEventListener('click', (e) => {
      console.log('mountain clicked!');
      // remove active from all other mountains
      removeActiveFromAllMountains(mountains);
      // remove h1 & h2 from all other mountains
      addInactiveToAllMountains(mountains);
      // toggle active on selected
      e.currentTarget.classList.remove('inactive');
      e.currentTarget.classList.add('active');
    })
  })
}

const removeActiveFromAllMountains = (mountains) => {
  mountains.forEach((mountain) => {
    mountain.classList.remove('active')
  })
}

const addInactiveToAllMountains = (mountains) => {
  mountains.forEach((mountain) => {
    mountain.classList.add('inactive')
  })
}

export { initMountainSlider }
