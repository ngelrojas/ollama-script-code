function truncateTitle(title, maxWords) {
  const words = title.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return title;
}

window.truncateTitle = truncateTitle;
