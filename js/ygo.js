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

/* first version with card link
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
*/

document.querySelectorAll("li").forEach(li => {

    const walker = document.createTreeWalker(
        li,
        NodeFilter.SHOW_TEXT
    );

    const textNodes = [];
    let node;

    while (node = walker.nextNode()) {
        // Don't process text that is already inside a link
        if (node.parentElement.closest("a")) continue;

        textNodes.push(node);
    }

    // Longest names first
    const cards = Object.entries(ygocards)
        .sort(([a], [b]) => b.length - a.length);

    for (const textNode of textNodes) {
        let text = textNode.nodeValue;

        const fragment = document.createDocumentFragment();
        let position = 0;

        // Find all card names in this text node
        const matches = [];

        for (const [name, id] of cards) {
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const regex = new RegExp(`\\b${escapedName}\\b`, "gi");

            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    name,
                    id
                });
            }
        }

        // Sort by position, then prefer the longest match
        matches.sort((a, b) =>
            a.start - b.start ||
            (b.end - b.start) - (a.end - a.start)
        );

        // Remove overlapping matches
        const selected = [];

        for (const match of matches) {
            const overlaps = selected.some(
                existing =>
                    match.start < existing.end &&
                    match.end > existing.start
            );

            if (!overlaps) {
                selected.push(match);
            }
        }

        selected.sort((a, b) => a.start - b.start);

        for (const match of selected) {
            // Text before card name
            if (position < match.start) {
                fragment.appendChild(
                    document.createTextNode(
                        text.slice(position, match.start)
                    )
                );
            }

            const image =
                `https://images.ygoprodeck.com/images/cards/${match.id}.jpg`;

            const link = document.createElement("a");

            link.href = image;
            link.target = "_blank";
            link.dataset.bsToggle = "tooltip";
            link.dataset.bsHtml = "true";
            link.title =
                `<img src="${image}" alt="${match.name}" class="tooltip-img">`;

            link.textContent = match.name;

            fragment.appendChild(link);

            position = match.end;
        }

        // No matches
        if (selected.length === 0) {
            continue;
        }

        // Remaining text
        if (position < text.length) {
            fragment.appendChild(
                document.createTextNode(text.slice(position))
            );
        }

        textNode.parentNode.replaceChild(fragment, textNode);
    }
});

// Initialize Bootstrap tooltips
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
});