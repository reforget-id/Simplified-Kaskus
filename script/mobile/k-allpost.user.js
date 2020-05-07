// ==UserScript==
// @name          Kaskus : Show All Post
// @version       2.0.0
// @namespace     k-allpost
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect single post menjadi show all post
// @match		  https://m.kaskus.co.id/show_post/*/-/*
// @match		  https://m.kaskus.co.id/show_post/*/?*
// @match		  https://m.kaskus.co.id/post/*/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @run-at        document-start
// ==/UserScript==


function redirect() {
	var url = window.location.href;
	var host = url.match(/^.*\.id\//g);
	var post = url.match(/\w{24}/);
	if (url.match(/.*\/show_post\/.*/g)) {
		window.location.href = host + "post/" + post + "/#post" + post;
	}
}

redirect();

setTimeout(function scroll() {
	var url = window.location.href;
	var post = url.match(/\w{24}/);
	var postid = "postcontent" + post;
	var element = document.getElementById(postid);
	if (typeof (element) == 'undefined' || element == null) {
		console.log("ID tidak ada");
		setTimeout(scroll, 1000);
	}
	var headerOffset = 85;
	var bodyRect = document.body.getBoundingClientRect().top;
	var elementRect = element.getBoundingClientRect().top;
	var elementPosition = elementRect - bodyRect;
	var offsetPosition = elementPosition - headerOffset;

	if (url.match(/.*co.id\/post\/.*/)) {
		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth"
		});
	}
}, 5000);