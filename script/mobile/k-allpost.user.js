// ==UserScript==
// @name          Kaskus : Show All Post
// @version       1.0.5
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
	document.body.style.opacity = "0.0";
	var allpost = document.getElementsByClassName("Mend(5px) linkWithIcon:h_Td(u)");
	for (var i = 0; i < allpost.length; i++) {
		if (allpost[i].className == "Mend(5px) linkWithIcon:h_Td(u)") {
			allpost[i].click();
		}
	}
}

showPost();