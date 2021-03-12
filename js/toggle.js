// Toggle the appearance of information when clicking the arrow on the right side of the list
const toggleShort = (element) => {
  element.nextElementSibling.classList.toggle("hide");
  element.nextElementSibling.nextElementSibling.classList.toggle('hide');
};