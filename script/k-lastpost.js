// ==UserScript==
// @name        Kaskus : Insert Last Post Button
// @version     1.0.0
// @namespace   https://github.com/reforget-id/Simplified-Kaskus-Mobile-Webview
// @description Tambah tombol last post
// @include     https://m.kaskus.co.id/forum/*
// @grant		none

// ==/UserScript==

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
}, false;

function getElementsByIdStartsWith(selectorTag, prefix) {
    var items = [];
    var myPosts = document.getElementsByTagName(selectorTag);
    for (var i = 0; i < myPosts.length; i++) {
        if (myPosts[i].id.lastIndexOf(prefix, 0) === 0) {
            items.push(myPosts[i]);
        }
    }
    return items;
}

var list = document.getElementsByClassName("Mstart(a)");
var postedOnes = getElementsByIdStartsWith("div", "menudata-");

for (var i = 0; i < list.length ; i++) {
    var NewElement = document.createElement('a');
    var threadid = postedOnes[i].getAttribute("data-threadid");
    var lastpostid = postedOnes[i].getAttribute("data-last-post-id");

    NewElement.innerHTML = 'Last Post';
    NewElement.href = "/lastpost/" + threadid + "#post" + lastpostid;
    NewElement.style.fontSize = '12px';
    NewElement.style.marginRight = '5px';
    NewElement.style.marginLeft = '5px';
    NewElement.style.textAlign = 'right';
    NewElement.target = '_blank';
    NewElement.appendBefore(list[i]);
}


