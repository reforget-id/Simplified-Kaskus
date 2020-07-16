// ==UserScript==
// @name        Kaskus : Open in New Tab
// @version     1.1.1
// @icon        https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @namespace   k-newtab
// @author      ffsuperteam
// @homepage    https://github.com/reforget-id/Simplified-Kaskus
// @description Buka Last Post, First New Post, Hot Thread di Tab Baru
// @include     https://m.kaskus.co.id/*
// @downloadURL https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-newtab.user.js
// @updateURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-newtab.user.js
// @grant	none
// ==/UserScript==


function getAnchor(element) {
	while (element && element.nodeName != "A") {
		element = element.parentNode;
	}
	return element;
}

function getId(element) {
	while (element && element.nodeName != "DIV") {
		element = element.parentNode;
	}
	return element;
}

document.addEventListener("click", function(e){
	var anchor = getAnchor(e.target);

    if (!anchor || anchor.target || anchor.protocol == "javascript:" || e.isTrusted === false || !anchor.offsetParent || (e.isTrusted == null && !e.detail)) {
		return;
	}

    var atthref = anchor.getAttribute("href");
    var keyhref = /.*(\/lastpost\/|\?goto=newpost|&med=hot_thread).*/gm;
    var mhref = atthref.match(keyhref);

    var elem = getId(e.target);
    var prev = elem.previousElementSibling;
    var attclass = prev.getAttribute("class");
    var keyclass = /.*(jsPopoverTrigger).*/gm;
    var mclass = attclass.match(keyclass);

	if (atthref == mhref) {
        anchor.target = "_blank";
            if (attclass == mclass) {
                prev.click();
            }
	}
});

