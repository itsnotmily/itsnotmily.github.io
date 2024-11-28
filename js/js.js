// Declare variables globally
let redditSwitchCheck = 0; // Default value for NSFW filter
let topSubredditsVisible = false; // To track visibility of top subreddits

// Get references to elements
const reddSelf = document.getElementById("redditSelf");
const reddInfo = document.getElementById("redditInfo");
const reddAuthor = document.getElementById("redditAuthor");
const reddFinal = document.getElementById("redditFinal");
const reddPerma = document.getElementById("redditPerma");
const reddSub = document.getElementById("redditSub");
const trendIcon = document.getElementById("trendIcon");
const trending25 = document.getElementById("trending25");

// Event Listeners

// Main function to fetch Reddit data
function reddit() {
  // Clear previous results
  reddSelf.innerHTML = "";
  reddInfo.innerHTML = "";
  reddAuthor.innerHTML = "";
  reddFinal.innerHTML = "";
  reddPerma.innerHTML = "";
  document.getElementById('sendIcon').addEventListener('click', reddit);
document.getElementById('redditSub').addEventListener('keydown', function(event) {
  if (event.keyCode === 13) { // Enter key
    reddit();
  }
});
document.getElementById('refreshIcon').addEventListener('click', redditRefresh);
document.getElementById('resetIcon').addEventListener('click', redditReset);
document.getElementById('redditSwitch').addEventListener('change', redditSFW);
trendIcon.addEventListener("click", redditTopsubs);


  let redditCheck = "/hot.json?" + Date.now();
  const redditRadio = document.getElementsByName("group1");

  // Determine the selected filter
  for (let i = 0; i < redditRadio.length; i++) {
    if (redditRadio[i].checked === true) {
      switch (redditRadio[i].id) {
        case "rHot":
          redditCheck = "/hot.json?" + Date.now();
          break;
        case "rNew":
          redditCheck = "/new.json?" + Date.now();
          break;
        case "topHour":
          redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=hour";
          break;
        case "top24":
          redditCheck = "/top.json?" + Date.now();
          break;
        case "topWeek":
          redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=week";
          break;
        case "topMonth":
          redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=month";
          break;
        case "topYear":
          redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=year";
          break;
        case "topAll":
          redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=all";
          break;
      }
    }
  }

  // Make the API request
  const url = `https://api.reddit.com/r/${reddSub.value.split(" ").join("_")}${redditCheck}`;
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const myArr = JSON.parse(this.responseText);
      let stickyChecker = 0;

      if (myArr.data.children[stickyChecker].data.stickied) {
        stickyChecker += 1;
      }

      if (redditSwitchCheck === 1 && myArr.data.children[stickyChecker].data.over_18) {
        reddFinal.innerHTML = "NSFW posts are disabled currently";
        reddSub.value = "";
        reddSelf.innerHTML = "";
        reddInfo.innerHTML = "";
        reddAuthor.innerHTML = "";
        reddPerma.innerHTML = "";
        return;
      }

      const firstURL = myArr.data.children[stickyChecker].data.url;
      const firstTitle = myArr.data.children[stickyChecker].data.title;
      const firstAuthor = myArr.data.children[stickyChecker].data.author;
      const firstPerma = myArr.data.children[stickyChecker].data.permalink;

      reddSelf.innerHTML = firstTitle;
      reddAuthor.innerHTML = "by " + firstAuthor;
      reddInfo.innerHTML = `<a href="${firstURL}" target="_blank">Link to post</a>`;
      reddPerma.innerHTML = `<a href="https://www.reddit.com${firstPerma}" target="_blank">Permalink</a>`;
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

// Handle the NSFW switch
function redditSFW() {
  redditSwitchCheck = document.getElementById('redditSwitch').checked ? 1 : 0;
}

// Refresh Reddit Data
function redditRefresh() {
  reddit();
}

// Reset Reddit Data
function redditReset() {
  reddSub.value = "";
  reddSelf.innerHTML = "";
  reddInfo.innerHTML = "";
  reddAuthor.innerHTML = "";
  reddFinal.innerHTML = "Waiting for your input";
  reddPerma.innerHTML = "";
}

// Fetch and display top 25 subreddits
function redditTopsubs() {
  // Toggle visibility of the trending subreddits list
  topSubredditsVisible = !topSubredditsVisible;
  if (topSubredditsVisible) {
    // Show loading message until the data is fetched
    trending25.innerHTML = "Loading top 25 subreddits...";

    // Fetch top 25 subreddits
    const url = "https://www.reddit.com/r/popular/top/.json?limit=25"; // Example for popular subreddits
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const myArr = JSON.parse(this.responseText);
        let topSubredditsHTML = "<ul>";

        // Loop through the top 25 subreddits and display them
        myArr.data.children.forEach(function (item) {
          const subredditName = item.data.subreddit;
          topSubredditsHTML += `<li><a href="https://www.reddit.com/r/${subredditName}" target="_blank">${subredditName}</a></li>`;
        });

        topSubredditsHTML += "</ul>";
        trending25.innerHTML = topSubredditsHTML;
      }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  } else {
    // Hide the top 25 subreddits list
    trending25.innerHTML = "";
  }
}


function eightBall() {
	
  var eighBt = document.getElementById("balltext");
  
      var answers = ['Maybe.','Certainly not.','I hope so.','Not in your wildest dreams.','There is a good chance.','Quite likely.','I think so.','I hope not.', 'I hope so.', 'Never!','Fuhgeddaboudit.','Ahaha! Really?!?','Pfft.','Sorry, bucko.','Hell, yes.','Hell to the no.','The future is bleak.','The future is uncertain.','I would rather not say.','Who cares!','Possibly.','Never,ever ever.','There is a small chance.', 'Yes!'];
      var answerz = answers[Math.floor(Math.random() * answers.length)];
      if (eighBt.value == "" || eighBt.value == " " || eighBt.value == null)
      {
          document.getElementById("ball").innerHTML = "At least ask something! ";
      document.getElementById("ballQuery").innerHTML = "";
  
      }
      else{
          document.getElementById("ball").innerHTML = answerz;
      document.getElementById("ballQuery").innerHTML = "You asked:" + "<br>" + eighBt.value;
          eighBt.value = "";
  
      }
  }
// storieschange function remains the same

function storieschange() {
  if ($('#collstories').hasClass('show') == false && document.querySelectorAll("#colltester")[0].innerHTML.split("(Click a story title to read more)").length < 2) {
    document.querySelectorAll("#colltester")[0].innerHTML = document.querySelectorAll("#colltester")[0].innerHTML.replace("Stories", "Stories (Click a story title to read more)");
  } else if (document.querySelectorAll("#colltester")[0].innerHTML.split("(Click a story title to read more)").length > 1) {
    document.querySelectorAll("#colltester")[0].innerHTML = document.querySelectorAll("#colltester")[0].innerHTML.replaceAll("(Click a story title to read more)", "");
  } else if (document.querySelectorAll("#colltester")[0].innerHTML.indexOf("Click a story") != -1) {
    document.querySelectorAll("#colltester")[0].innerHTML = document.querySelectorAll("#colltester")[0].innerHTML.replace("Stories (Click a story title to read more)", "Stories");
  }
}

// down arrow becomes up and vv
document.addEventListener("DOMContentLoaded", () => {
  const collapsibleLinks = document.querySelectorAll("[data-bs-toggle='collapse']");

  collapsibleLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const icon = this.textContent.match(/🔽|🔼/) ? this.textContent.match(/🔽|🔼/)[0] : "";
      if (icon) {
        this.innerHTML = this.innerHTML.replace(icon, icon === "🔽" ? "🔼" : "🔽");
      }
    });
  });
});


// list items click turn green funtion

document.addEventListener("DOMContentLoaded", function() {
  // Get all list items
  const items = document.querySelectorAll("ul li");

  // Add click event listener to each list item
  items.forEach(function(item) {
    item.addEventListener("click", function() {
      // Check if the clicked item already has the 'clicked' class
      if (item.classList.contains("clicked")) {
        // If it does, remove the 'clicked' class
        item.classList.remove("clicked");
      } else {
        // If it doesn't, first remove 'clicked' class from all items
        items.forEach(function(i) {
          i.classList.remove("clicked");
        });
        
        // Then add the 'clicked' class to the clicked item
        item.classList.add("clicked");
      }
    });
  });
});


  // Initialize tooltips with HTML content enabled
document.addEventListener('DOMContentLoaded', function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      html: true // This allows HTML content, such as <img> tags, to be rendered in the tooltip
    });
  });
});


//make collapses scroll into view
document.addEventListener('shown.bs.collapse', function (event) {
  const target = event.target; // The collapsible element

  // Get the trigger element that controls this collapsible
  const trigger = document.querySelector(`[href="#${target.id}"]`) || 
                 document.querySelector(`[data-bs-target="#${target.id}"]`);
  
  if (trigger) {
    // Calculate the offset for smooth scrolling
    const scrollOffset = target.offsetTop - 250; // Adjust the offset as needed
    
    // Smooth scrolling to the calculated position
    window.scrollTo({
      top: scrollOffset,
      behavior: 'smooth'
    });
  }
});


// Show or hide "Back to Top" link based on scroll position

const backToTopNav = document.getElementById('backToTopNav');
window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPosition = window.scrollY / scrollHeight;

  // Use visibility to prevent layout changes
  if (scrollPosition > 0.4) {
    backToTopNav.style.visibility = 'visible';
  } else {
    backToTopNav.style.visibility = 'hidden';
  }
});

// Scroll to top smoothly
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}