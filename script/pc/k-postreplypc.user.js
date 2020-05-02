// ==UserScript==
// @name          Kaskus : Bottom Post Reply for PC
// @version       0.0.2
// @namespace     k-postreplypc
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Memindahkan kolom post reply di bawah thread
// @include       https://www.kaskus.co.id/thread/*
// @include       https://www.kaskus.co.id/post/*
// @include       https://www.kaskus.co.id/show_post/*
// @include       https://www.kaskus.co.id/lastpost/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-postreplypc.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-postreplypc.user.js


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
    var elem = document.getElementsByClassName("qr-section")[0];
    var clone = elem.cloneNode(true);
    var place = document.getElementsByClassName("My(16px) Bgc(c-white) Bd(borderSolidLightGrey) Px(16px) Py(8px)")[1];

    if (place.className == 'My(16px) Bgc(c-white) Bd(borderSolidLightGrey) Px(16px) Py(8px)') {
      clone.appendAfter(place);
      elem.parentNode.removeChild(elem);
    }
  } catch {}
}

cloneElement();