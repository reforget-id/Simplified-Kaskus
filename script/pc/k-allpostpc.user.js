// ==UserScript==
// @name          Kaskus : Show All Post for PC
// @version       2.0.1
// @namespace     k-allpostpc
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect show all post
// @match		  https://www.kaskus.co.id/show_post/*/-/*
// @match		  https://www.kaskus.co.id/show_post/*/?*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-allpostpc.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-allpostpc.user.js
// @run-at        document-start
// ==/UserScript==


function redirect() {
    var url = window.location.href;
    var host = url.match(/^.*\.id\//g);
    var post = url.match(/\w{24}/);
    window.location.href = host + "post/" + post + "/#post" + post;
}

redirect();