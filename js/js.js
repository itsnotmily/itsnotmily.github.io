var redditSwitchCheck = 0;
var reddSelf = document.getElementById("redditSelf");
var reddInfo = document.getElementById("redditInfo");
var reddAuthor = document.getElementById("redditAuthor");
var reddFinal = document.getElementById("redditFinal");
var reddPerma = document.getElementById("redditPerma");
var reddSub = document.getElementById("redditSub");


function whatyouselected() {
	var hello = document.getElementById("fruits").value;
	document.getElementById("what you selected").innerHTML = hello;
}



function eightBall() {

	var eighBt = document.getElementById("balltext");

	var answers = ['Maybe.', 'Certainly not.', 'I hope so.', 'Not in your wildest dreams.', 'There is a good chance.', 'Quite likely.', 'I think so.', 'I hope not.', 'I hope so.', 'Never!', 'Fuhgeddaboudit.', 'Ahaha! Really?!?', 'Pfft.', 'Sorry, bucko.', 'Hell, yes.', 'Hell to the no.', 'The future is bleak.', 'The future is uncertain.', 'I would rather not say.', 'Who cares!', 'Possibly.', 'Never,ever ever.', 'There is a small chance.', 'Yes!'];
	var answerz = answers[Math.floor(Math.random() * answers.length)];
	if (eighBt.value == "" || eighBt.value == " " || eighBt.value == null) {
		document.getElementById("ball").innerHTML = "At least ask something! ";
		document.getElementById("ballQuery").innerHTML = "";
	} else {
		document.getElementById("ball").innerHTML = "I say: " + answerz;
		document.getElementById("ballQuery").innerHTML = "You asked:" + "<br>" + eighBt.value;
		eighBt.value = "";
	}
}

function reddit() {
	reddSelf.innerHTML = "";
	reddInfo.innerHTML = "";
	reddAuthor.innerHTML = "";
	reddFinal.innerHTML = "";
	reddPerma.innerHTML = "";

	var redditRadio = document.getElementsByName("group1");
	var redditCheck = "/hot.json?" + Date.now();
	var redditResult;
	for (i = 0; i < redditRadio.length; i++) {
		if (redditRadio[i].checked == true) {
			if (redditRadio[i].id == "rHot") {
				redditCheck = "/hot.json?" + Date.now();
			} else if (redditRadio[i].id == "rNew") {
				redditCheck = "/new.json?" + Date.now();
			} else if (redditRadio[i].id == "topHour") {
				redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=hour";
			} else if (redditRadio[i].id == "top24") {
				redditCheck = "/top.json?" + Date.now();
			} else if (redditRadio[i].id == "topWeek") {
				redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=week";
			} else if (redditRadio[i].id == "topMonth") {
				redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=month";
			} else if (redditRadio[i].id == "topYear") {
				redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=year";
			} else if (redditRadio[i].id == "topAll") {
				redditCheck = "/top/.json?" + Date.now() + "?sort=top&t=all";
			}
		}
	}

	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.reddit.com/r/" + reddSub.value.split(" ").join("_") + redditCheck;
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

			var myArr = JSON.parse(this.responseText);
			console.log(myArr);
			var stickyChecker = 0;
			if (myArr.data.children[0].data.stickied == true) {
				stickyChecker += 1;
				console.log(stickyChecker);
			}

			if (myArr.data.children[0 + stickyChecker].data.stickied == true) {
				stickyChecker += 1;
			}
			if (redditSwitchCheck == 1) {
				if (myArr.data.children[stickyChecker].data.over_18 == true) {
					reddFinal.innerHTML = "NSFW posts are disabled currently";
					reddSub.value = "";
					reddSelf.innerHTML = "";
					reddInfo.innerHTML = "";
					reddAuthor.innerHTML = "";
					reddPerma.innerHTML = "";
					return;
				}
			}
			var firstURL = myArr.data.children[stickyChecker].data.url;
			var postTitle = myArr.data.children[stickyChecker].data.title;
			var postAuthor = myArr.data.children[stickyChecker].data.author;
			var postPerma = "<a href=\"https://api.reddit.com" + myArr.data.children[stickyChecker].data.permalink + "\" target=\"_blank\"> Permalink: https://api.reddit.com" + myArr.data.children[stickyChecker].data.permalink + "</a>";


			if (myArr.data.children[stickyChecker].data.selftext != "") {
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;
				console.log(postPerma);
			} else if (firstURL.includes("youtube.com") || firstURL.includes("youtu.be")) {
				console.log(firstURL);
				firstURL = firstURL.replace("watch?v=", "embed/");
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "<iframe src=" + firstURL + " frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\" width=\"640\" height=\"640\"><\/iframe>";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else if ((firstURL.includes("imgur.com") == 0) && (firstURL.includes("instagram.com") == 0) && (firstURL.includes("gfycat.com") == 0) && (firstURL.includes(".png") == 0) && (firstURL.includes(".gif") == 0) && (firstURL.includes(".jpg") == 0) && (firstURL.includes(".gifv") == 0)) {
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "<a href=" + myArr.data.children[stickyChecker].data.url + " target=\"_blank\" >" + myArr.data.children[stickyChecker].data.url + "</a>";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else if (firstURL.includes("gifv")) {
				firstURL = firstURL.replace(".gifv", "/embed");
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "<iframe src=" + firstURL + " frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\" width=\"640\" height=\"640\"><\/iframe>";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else if (firstURL.includes("imgur.com") && firstURL.includes("/gallery/")) {
				console.log(firstURL);
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "Cannot open gallery. Here is the link: <br>" + firstURL;
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else if (firstURL.includes("imgur.com") && (firstURL.includes("jpg") == 0) && (firstURL.includes("png") == 0) && (firstURL.includes("gif") == 0) && (firstURL.includes("gifv") == 0)) {
				firstURL = firstURL + "/embed";
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				console.log(firstURL);
				reddFinal.innerHTML = "<iframe src=" + firstURL + " frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\" width=\"640\" height=\"640\"><\/iframe>";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else if (firstURL.includes("gfycat.com")) {
				console.log(firstURL);
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "<iframe src=" + firstURL + " frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\" width=\"640\" height=\"640\"><\/iframe>";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else if (firstURL.includes("instagram.com")) {
				firstURL = firstURL + "embed";
				console.log(firstURL);
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "<iframe src=" + firstURL + " frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\" width=\"640\" height=\"640\"><\/iframe>";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			} else {
				console.log(firstURL);
				reddInfo.innerHTML = postTitle;
				reddAuthor.innerHTML = "posted by: " + postAuthor;
				reddFinal.innerHTML = "<img src=" + myArr.data.children[stickyChecker].data.url + ">";
				reddSelf.innerHTML = myArr.data.children[stickyChecker].data.selftext;
				reddPerma.innerHTML = postPerma;

			}
		} //end main if
		else if (this.status == 404 || this.status == 403) {
			console.log("Subreddit not found");
			reddFinal.innerHTML = "Subreddit not found.";
			reddSub.value = "";
		} //end else if 404,403




	};
	xmlhttp.open("GET", url, true);
	xmlhttp.onerror = function () {
		console.log("** An error occurred during the transaction");
		reddFinal.innerHTML = "Subreddit not found.";
		reddSub.value = "";
		reddSelf.innerHTML = "";
		reddInfo.innerHTML = "";
		reddAuthor.innerHTML = "";
		reddPerma.innerHTML = "";


	};
	xmlhttp.send();

} //end reddit

function redditRefresh() {
	if (reddFinal.innerHTML == "Waiting for your input" || reddFinal.innerHTML == "Nothing interesting happens.") {
		reddFinal.innerHTML = "Nothing interesting happens.";
	} else {
		reddit();
	}

} //end redditRefresh

function redditChange() {
	if (reddFinal.innerHTML == "Waiting for your input" || reddFinal.innerHTML == "Nothing interesting happens.") {
		console.log("Nothing needs to change yet");
	} else {
		reddit();
	}

} //end redditChange

function redditSFW() {
	if (document.getElementsByName("redditSwitch")[0].checked == false) {
		redditSwitchCheck = 0;
	} else {
		redditSwitchCheck = 1;
		redditReset();
	}

} //end redditSFW

function redditReset() {
	reddFinal.innerHTML = "Waiting for your input";
	reddSub.value = "";
	reddSelf.innerHTML = "";
	reddInfo.innerHTML = "";
	reddAuthor.innerHTML = "";
	reddPerma.innerHTML = "";


} //end redditReset

function redditTopsubs() {
	if (document.getElementById("trending25").innerHTML == "") {
		var xmlhttp = new XMLHttpRequest();
		var url = "https://www.reddit.com/reddits.json";

		xmlhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var myArr = JSON.parse(this.responseText);
				for (i = 0; i < myArr.data.children.length; i++) {
					var newParagraph = document.createElement('p');
					newParagraph.textContent = myArr.data.children[i].data.display_name;
					document.getElementById("trending25").appendChild(newParagraph);
				}
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	} else {
		document.getElementById("trending25").innerHTML = "";
	}

} //end redditTopsubs

function test() {
	var xmlhttp = new XMLHttpRequest();
	var url = "https://milycors.herokuapp.com/define/yolo";

	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var myArr = (this.responseText);
			console.log(myArr);
		} else if (this.status == 500) {}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
	scrollFunction();
};

/*
function scrollFunction() {
	if (
		document.body.scrollTop > 20 ||
		document.documentElement.scrollTop > 20
	) {
		mybutton.style.display = "block";
	} else {
		mybutton.style.display = "none";
	}
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}
*/

function storieschange() {
	if ($('#collstories').hasClass('show') == false && document.querySelectorAll("#colltester")[0].innerHTML.split("(Click a story title to read more)").length<2){
		document.querySelectorAll("#colltester")[0].innerHTML = document.querySelectorAll("#colltester")[0].innerHTML.replace("Stories", "Stories (Click a story title to read more)");

	} else if (document.querySelectorAll("#colltester")[0].innerHTML.split("(Click a story title to read more)").length > 1) {
		document.querySelectorAll("#colltester")[0].innerHTML = document.querySelectorAll("#colltester")[0].innerHTML.replaceAll("(Click a story title to read more)", "");
	} else if (document.querySelectorAll("#colltester")[0].innerHTML.indexOf(("Click a story")) != -1) {
		document.querySelectorAll("#colltester")[0].innerHTML = document.querySelectorAll("#colltester")[0].innerHTML.replace("Stories (Click a story title to read more)", "Stories");
	}
}

function toggleButtonClass(button) {
    // save first button state
	let originalButton = button.classList[1];

    // Toggle the other classes based on the current state
    if (button.classList.[1] !== originalButton {
        button.classList.remove(button.classList[1]);
        button.classList.add('btn-primary');
    } else {
        button.classList.remove('btn-primary');
        button.classList.add('originalButton');
    }
}