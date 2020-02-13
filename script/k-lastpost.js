// ==UserScript==
// @name          Kaskus : Insert Last Post Button
// @version       1.1.0
// @namespace     k-lastpost
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Tambah tombol last post
// @include       https://m.kaskus.co.id/forum/*
// @include       https://m.kaskus.co.id/forum
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-lastpost.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-lastpost.js
// @grant		  none

// ==/UserScript==

function Main(){
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
    var cl = document.getElementsByClassName("Pos(r) D(f) Jc(fs) Py(10px) C(c-secondary) nightmode_C(c-secondary-night) Ai(c) c-compact__info is-compact-view_Pb(10px)");
    var postedOnes = getElementsByIdStartsWith("div", "menudata-");
    var lp = document.getElementsByClassName("lastpost-btn");

    for (var i = 0; i < list.length ; i++) {
        var NewElement = document.createElement('a');
        var threadid = postedOnes[i].getAttribute("data-threadid");
        var lastpostid = postedOnes[i].getAttribute("data-last-post-id");

        if (!cl[i].contains(lp[i])) {
            NewElement.innerHTML = 'Last Post';
            NewElement.setAttribute("class", "lastpost-btn");
            NewElement.href = "/lastpost/" + threadid + "#post" + lastpostid;
            NewElement.style.fontSize = '12px';
            NewElement.style.marginRight = '5px';
            NewElement.style.marginLeft = '5px';
            NewElement.style.textAlign = 'right';
            NewElement.style.fontWeight = '500';
            NewElement.target = '_blank';
            NewElement.appendBefore(list[i]);
        }
    }
}

Main();

window.onscroll = function()
{
    var scrollHeight, totalHeight;
    scrollHeight = document.body.scrollHeight * 0.95;
    totalHeight = window.scrollY + window.innerHeight;

    if (window.location.href == "https://m.kaskus.co.id/forum"){
        if (totalHeight >= scrollHeight){
            setTimeout(Main, 2500);
        }
    }
}