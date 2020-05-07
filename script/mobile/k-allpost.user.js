// ==UserScript==
// @name          Kaskus : Show All Post
// @version       2.0.1
// @namespace     k-allpost
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect single post menjadi show all post
// @match		  https://m.kaskus.co.id/show_post/*/-/*
// @match		  https://m.kaskus.co.id/show_post/*/?*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @run-at        document-start
// ==/UserScript==


function redirect() {
	var url = window.location.href;
	var host = url.match(/^.*\.id\//g);
	var post = url.match(/\w{24}/);
	window.location.href = host + "post/" + post + "/#post" + post;
}

redirect();