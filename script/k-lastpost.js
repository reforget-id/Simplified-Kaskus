// ==UserScript==
// @name        Kaskus : Open Last Post in New Tab
// @version     1.0.0
// @namespace   https://github.com/reforget-id/Simplified-Kaskus-Mobile-Webview
// @description Buka Last Post di Tab Baru
// @include     https://*.kaskus.co.id/*
// @grant		none
// ==/UserScript==

"use strict";

function getAnchor(element) {
	while (element && element.nodeName != "A") {
		element = element.parentNode;
	}
	return element;
}

document.addEventListener("click", function(e){
	var anchor = getAnchor(e.target);
    var att = anchor.getAttribute("href");
    var keyword = /.*(\/lastpost\/|\?goto=newpost).*/gm;
    var m = att.match(keyword);

	if (att == m) {
        anchor.target = "_blank";
	}
});
