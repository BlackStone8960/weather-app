// Detect hide classes to keep them as they are even after fetching datum
const hideFinder = () => {
  document.querySelectorAll('.oneday-wrapper').forEach((element) => {
    console.log(element.classList, element.classList.contains("hide"))
  });
};

export default hideFinder;