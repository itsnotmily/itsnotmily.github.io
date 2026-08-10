const ygocards = {
  //shaddoll
  "Elder Entity N'tss": "80532587",
  "El Shaddoll Construct": "20366274",
  "El Shaddoll Fusion": "6417578",
  "El Shaddoll Meshachrer": "32467459",
  "El Shaddoll Shekhinaga": "74822425",
  "El Shaddoll Winda": "94977269",
  "El Shaddoll Wendikurhu": "8852158",
  "Infernoid Evil": "97051536",
  "Lev Shaddoll Fusion": "34950192",
  "Naelshaddoll Ariel": "97518132",
  "Reeshaddoll Wendi": "51023024",
  "Shaddoll Apkallone": "50907446",
  "Shaddoll Construct": "86938484",
  "Shaddoll Hedgehog": "4939890",
  "Shaddoll Schism": "21011044",
  "Shaddoll Squamata": "30328508",
  "Tohushaddoll Grysta": "95072744",
  "Void Unleashing": "61345801",
  //dracotail
  "Dracotail Arthalion": "33760966",
  "Dracotail Faimena": "1498449",
  "Dracotail Flame": "5431722",
  "Dracotail Gulamel": "79755671",
  "Dracotail Horn": "69932023",
  "Dracotail Ketu": "6153210",
  "Dracotail Lukias": "75003700",
  "Dracotail Mululu": "7375867",
  "Dracotail Rahu": "32548318",
  "Dracotail Urgula": "70871153"
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