function truncateTitle(title, maxWords) {
  const words = title.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return title;
}

window.truncateTitle = truncateTitle;

function previewFile(event) {
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
window.previewFile = previewFile;

// function previewFile(event) {
//   const input = event.target;
//   const file = input.files[0];
//   const preview = document.getElementById("file-preview");
//   const btnPlus = document.getElementById("btn-plus");

//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       const fileType = file.type;

//       if (fileType.startsWith("image/")) {
//         // Preview image
//         preview.innerHTML = `<img src="${e.target.result}" class="block" />`;
//       } else if (fileType === "application/pdf") {
//         // Preview PDF using pdf.js
//         const pdfData = new Uint8Array(e.target.result);
//         const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//         loadingTask.promise.then(function (pdf) {
//           // Fetch the first page
//           pdf.getPage(1).then(function (page) {
//             const scale = 1.5;
//             const viewport = page.getViewport({ scale: scale });

//             // Prepare canvas using PDF page dimensions
//             const canvas = document.createElement("canvas");
//             const context = canvas.getContext("2d");
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;

//             // Render PDF page into canvas context
//             const renderContext = {
//               canvasContext: context,
//               viewport: viewport,
//             };
//             const renderTask = page.render(renderContext);
//             renderTask.promise.then(function () {
//               preview.innerHTML = "";
//               preview.appendChild(canvas);
//             });
//           });
//         });
//       } else if (
//         fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//         fileType === "application/msword"
//       ) {
//         // Preview DOC/DOCX
//         preview.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//           e.target.result
//         )}" class="block w-full h-full"></iframe>`;
//       } else if (
//         fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//         fileType === "application/vnd.ms-excel"
//       ) {
//         // Preview XLS/XLSX
//         preview.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//           e.target.result
//         )}" class="block w-full h-full"></iframe>`;
//       } else {
//         // Unsupported file type
//         preview.innerHTML = `<p>Unsupported file type</p>`;
//       }

//       preview.classList.remove("hidden");
//       preview.classList.add("block");
//       btnPlus.style.display = "none";
//     };

//     if (file.type.startsWith("image/") || file.type === "application/pdf") {
//       reader.readAsArrayBuffer(file);
//     } else {
//       reader.readAsArrayBuffer(file);
//     }
//   }
// }
// window.previewFile = previewFile;

function removeFile() {
  const preview = document.getElementById("image-preview");
  const btnPlus = document.getElementById("btn-plus");
  preview.src = "";
  preview.classList.remove("block");
  preview.classList.add("hidden");
  btnPlus.style.display = "block";
}

window.removeFile = removeFile;

// function removeFile() {
//   const preview = document.getElementById("file-preview");
//   const btnPlus = document.getElementById("btn-plus");
//   const fileInput = document.getElementById("send-req-ollama-bot-img");

//   // Clear the preview content
//   preview.innerHTML = "";
//   preview.classList.remove("block");
//   preview.classList.add("hidden");

//   // Reset the file input
//   fileInput.value = "";

//   // Show the plus button
//   btnPlus.style.display = "block";
// }

// window.removeFile = removeFile;
