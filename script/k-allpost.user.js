// ==UserScript==
// @name          Kaskus : Show All Post
// @version       1.0.0
// @namespace     k-allpost
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect show all post
// @include       https://*.kaskus.co.id/show_post/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-allpost.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-allpost.user.js
// ==/UserScript==


function showPost(){
		var allpost = document.getElementsByClassName("Mend(15px)");
		for (var i = 0; i < allpost.length ; i++) {
				allpost[i].click();
		}
		
}

showPost();
