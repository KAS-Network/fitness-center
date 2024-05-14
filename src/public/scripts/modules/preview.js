function onInputImg(input) {
  const imgInput = input.target;
  const label = imgInput.closest(".img-preview");
  const file = imgInput.files[0];
  if (file) {
    label.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    label.style.backgroundSize = "contain";
    label.style.backgroundPosition = "center center";
    label.style.backgroundRepeat = "no-repeat";
  }
}