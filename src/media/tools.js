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
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
      preview.classList.add("block");
    };
    reader.readAsDataURL(file);
  }
}
window.previewImage = previewImage;

function removeImage() {
  const preview = document.getElementById("image-preview");
  preview.src = "";
  preview.classList.remove("block");
  preview.classList.add("hidden");
}

window.removeImage = removeImage;

// function getLocalStorage() {
//   return localStorage.getItem("selectedModel");
// }

// window.getLocalStorage = getLocalStorage;
