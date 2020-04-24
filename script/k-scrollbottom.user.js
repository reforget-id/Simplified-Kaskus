// ==UserScript==
// @name          Kaskus : Scroll to Bottom
// @version       0.0.1
// @namespace     k-scrollbotton
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Memindahkan kolom post reply di bawah thread
// @include       https://m.kaskus.co.id/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-scrollbottom.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-scrollbottom.user.js


// ==/UserScript==

/* Adds Element BEFORE NeighborElement */
Element.prototype.appendBefore = function(element) {
  element.parentNode.insertBefore(this, element);
}, false;

/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function(element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}, false;


function bottomScroll(){
    var position = document.getElementsByClassName("arrowBacktoTop")[0];
    var NewElement1 = document.createElement('div');
	  var NewElement2 = document.createElement('div');
		var NewElement3 = document.createElement('div');
	
		NewElement1.setAttribute("class", "Pos(f) W(100%) Ta(c) C(c-white) Fz(16px) D(n) Z(99) End(0) B(0)");
		NewElement1.style.bottom = "60px";
	  NewElement1.style.display = "block";
	  NewElement1.style.cursor = "pointer";
	  NewElement1.appendAfter(position);
		NewElement1.appendChild(NewElement2);
		
	  NewElement2.setAttribute("class", "Maw(620px) M(marginAuto0) End(10px) B(20px) Pos(r)");
		NewElement2.appendChild(NewElement3);
	
    NewElement3.setAttribute("class", "W(40px) H(40px) Bgc(bgTransparent) Bdrs(50%) P(10px) End(0) Pos(a) nightmode_Bgc(bgTransparentDark) fas fa-arrow-down");
		NewElement3.style.bottom = "-42px";
	  
	  NewElement1.addEventListener("click", function(){
  			window.scrollTo(0,document.body.scrollHeight);});

}

bottomScroll();
