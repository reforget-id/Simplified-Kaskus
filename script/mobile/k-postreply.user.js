// ==UserScript==
// @name          Kaskus : Bottom Post Reply
// @version       0.0.3
// @namespace     k-postreply
// @author        ffsuperteam
// @icon          https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Memindahkan kolom post reply di bawah thread
// @include       https://m.kaskus.co.id/thread/*
// @include       https://m.kaskus.co.id/post/*
// @include       https://m.kaskus.co.id/show_post/*
// @include       https://m.kaskus.co.id/lastpost/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-postreply.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-postreply.user.js


// ==/UserScript==

/* Adds Element BEFORE NeighborElement */
Element.prototype.appendBefore = function (element) {
  element.parentNode.insertBefore(this, element);
}, false;

/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}, false;


function cloneElement() {
  try {
    var elem = document.getElementById("quick_reply_wrapper");
    var clone = elem.cloneNode(true);
    var place = document.getElementsByClassName("c-pagination")[1];
    clone.appendAfter(place);
    elem.parentNode.removeChild(elem);
  } catch {}
}

cloneElement();