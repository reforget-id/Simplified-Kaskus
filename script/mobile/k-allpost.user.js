// ==UserScript==
// @name          Kaskus : Show All Post
// @version       1.0.4
// @namespace     k-allpost
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect show all post
// @include       https://*.kaskus.co.id/show_post/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @run-at        document-end
// ==/UserScript==


function showPost() {
	document.body.style.display = "none";
	var allpost = document.getElementsByClassName("Mend(15px)");
	for (var i = 0; i < allpost.length; i++) {
		if (allpost[i].className == "Mend(15px)") {
			allpost[i].click();
		}
	}
}

showPost();