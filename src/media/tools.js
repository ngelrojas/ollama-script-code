function truncateTitle(title, maxWords) {
  const words = title.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return title;
}

window.truncateTitle = truncateTitle;

function previewImage(event) {
  const input = event.target;

  const file = input.files[0];
  const preview = document.getElementById("image-preview");
  const btnPlus = document.getElementById("btn-plus");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
      preview.classList.add("block");
      btnPlus.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}
window.previewImage = previewImage;

function removeImage() {
  const preview = document.getElementById("image-preview");
  const btnPlus = document.getElementById("btn-plus");
  preview.src = "";
  preview.classList.remove("block");
  preview.classList.add("hidden");
  btnPlus.style.display = "block";
}

window.removeImage = removeImage;
