function truncateTitle(title, maxWords) {
  const words = title.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return title;
}

window.truncateTitle = truncateTitle;

const svgPdf = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="#000000" d="M3.5 8H3V7h.5a.5.5 0 0 1 0 1M7 10V7h.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z"/><path fill="#000000" fill-rule="evenodd" d="M1 1.5A1.5 1.5 0 0 1 2.5 0h8.207L14 3.293V13.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 13.5zM3.5 6H2v5h1V9h.5a1.5 1.5 0 1 0 0-3m4 0H6v5h1.5A1.5 1.5 0 0 0 9 9.5v-2A1.5 1.5 0 0 0 7.5 6m2.5 5V6h3v1h-2v1h1v1h-1v2z" clip-rule="evenodd"/></svg>`;
const svgDoc = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#000000"><path d="M3.5 13v-.804c0-2.967 0-4.45.469-5.636c.754-1.905 2.348-3.407 4.37-4.118C9.595 2 11.168 2 14.318 2c1.798 0 2.698 0 3.416.253c1.155.406 2.066 1.264 2.497 2.353c.268.677.268 1.525.268 3.22V13"/><path d="M3.5 12a3.333 3.333 0 0 1 3.333-3.333c.666 0 1.451.116 2.098-.057a1.67 1.67 0 0 0 1.179-1.18c.173-.647.057-1.432.057-2.098A3.333 3.333 0 0 1 13.5 2m7 15.22c-.051-1.19-.826-1.22-1.877-1.22c-1.619 0-1.887.406-1.887 2v2c0 1.594.268 2 1.887 2c1.051 0 1.826-.03 1.878-1.22M7.266 19c0 1.657-1.264 3-2.824 3c-.352 0-.528 0-.659-.08c-.313-.193-.282-.582-.282-.92v-4c0-.338-.031-.727.282-.92c.131-.08.307-.08.66-.08c1.559 0 2.823 1.343 2.823 3M12 22c-.888 0-1.331 0-1.607-.293s-.276-.764-.276-1.707v-2c0-.943 0-1.414.276-1.707S11.113 16 12 16s1.33 0 1.606.293s.276.764.276 1.707v2c0 .943 0 1.414-.276 1.707C13.331 22 12.887 22 12 22"/></g></svg>`;

function previewFile(event) {
  const input = event.target;
  const file = input.files[0];
  const preview = document.getElementById("image-preview");
  const btnPlus = document.getElementById("btn-plus");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
        preview.classList.add("block");
        btnPlus.style.display = "none";
      } else if (fileType === "application/pdf") {
        preview.src = "data:image/svg+xml;base64," + btoa(svgPdf);
        preview.classList.remove("hidden");
        preview.classList.add("block");
        btnPlus.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  }
}

window.previewFile = previewFile;

function removeFile() {
  const preview = document.getElementById("image-preview");
  const btnPlus = document.getElementById("btn-plus");
  preview.src = "";
  preview.classList.remove("block");
  preview.classList.add("hidden");
  btnPlus.style.display = "block";
}

window.removeFile = removeFile;
