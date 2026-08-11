const ygocards = {
  //shaddoll
  "Armageddon Knight": "28985331",
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
  "Shaddoll Incarnation": "23912837",
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
  "Dracotail Phryxul": "84477320",
  "Dracotail Rahu": "32548318",
  "Dracotail Urgula": "70871153",
  "Filia Regis": "70538272",
  "Heavenly Spheres": "24361622",
  "Secretarion Dragon": "89851827",
  "Spirit with Eyes of Blue": "42097666",
  //branded
  "Albion the Branded Dragon": "87746184",
  "Albion the Sanctifire Dragon": "38811586",
  "Branded Fusion": "44362883",
  "Fallen of Albaz": "68468459",
  "Placeholer": "12345678" // Simply here because i forget last comma
};

// Replace card names in square brackets with links to their images
document.querySelectorAll("li").forEach(li => {
    li.innerHTML = li.innerHTML.replace(/\[([^\]]+)\]/g, (match, name) => {
        const id = ygocards[name];
        if (!id) return match;

        const image = `https://images.ygoprodeck.com/images/cards/${id}.jpg`;

        return `<a href="${image}" target="_blank"
            data-bs-toggle="tooltip" data-bs-html="true"
            title="<img src='${image}' alt='${name}' class='tooltip-img'>">${name}</a>`;
    });
});

document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el =>
    new bootstrap.Tooltip(el)
);