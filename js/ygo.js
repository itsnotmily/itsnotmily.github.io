const ygocards = {
  "Shaddoll Apkallone": "50907446",
  "Shaddoll Squamata": "30328508"
};

document.querySelectorAll("card-link").forEach(el => {
  const name = el.textContent.trim();
  const id = ygocards[name];

  if (!id) return;

  const image = `https://images.ygoprodeck.com/images/cards/${id}.jpg`;

  const link = document.createElement("a");

  link.href = image;
  link.target = "_blank";
  link.dataset.bsToggle = "tooltip";
  link.dataset.bsHtml = "true";
  link.title = `<img src="${image}" alt="${name}" class="tooltip-img">`;
  link.textContent = name;

  el.replaceWith(link);
});