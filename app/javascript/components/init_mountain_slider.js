const initMountainSlider = () => {
  console.log('mountain slider');
  const mountains = document.querySelectorAll('.mountain');
  mountains.forEach((mountain) => {
    mountain.addEventListener('click', (e) => {
      console.log('mountain clicked!');
      // remove active from all other mountains
      removeActiveFromAllMountains(mountains);
      // remove h1 & h2 from all other mountains
      // removeLocation(mountains);
      // toggle active on selected
      e.currentTarget.classList.toggle('active');
    })
  })
}

const removeActiveFromAllMountains = (mountains) => {
  mountains.forEach((mountain) => {
    mountain.classList.remove('active')
  })
}

// const removeLocation = (mountains) => {
//   mountains.forEach((mountain) => {
//     mountain.classList.remove('location')
//   })
// }

export { initMountainSlider }
