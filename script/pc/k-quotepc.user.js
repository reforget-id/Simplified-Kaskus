// ==UserScript==
// @name          Kaskus : Insert Quote Button for PC
// @version       1.6.1
// @namespace     k-quotepc
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Tambah tombol quote di nested reply di PC
// @include       https://www.kaskus.co.id/thread/*
// @include       https://www.kaskus.co.id/post/*
// @include       https://www.kaskus.co.id/show_post/*
// @include       https://www.kaskus.co.id/lastpost/*
// @include       https://www.kaskus.co.id/post_reply/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-quotepc.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-quotepc.user.js
// @grant		  GM_addStyle
// @grant		  GM_setValue
// @grant		  GM_getValue
// @grant		  GM_deleteValue
// @run-at        document-end

// ==/UserScript==


GM_addStyle(`
.single-quote {
padding-right: 3px !important;
font-size: 15px !important;
}
`);


/* Adds Element BEFORE NeighborElement */
Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
}, false;

/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
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

function singleQuote() {
	var list = document.getElementsByClassName("jsButtonMultiquote buttonMultiquote");
	var listreply = document.getElementsByClassName("D(ib) Td(n):h Fz(16px) jsButtonReply buttonReply");
	var thread = document.getElementById("thread_id");
	var post = getElementsByIdStartsWith("div", "post");

	for (var i = 0; i < listreply.length; i++) {
		var NewElement1 = document.createElement('a');
		var NewElement2 = document.createElement('i');
		var NewElement3 = document.createElement('span');
		var threadid = thread.getAttribute("value");
		var postid = post[i].getAttribute("id").match(/[^post].*/g);

		NewElement1.setAttribute("class", "D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) buttonMultiquote");
		NewElement1.href = "/post_reply/" + threadid + "/?post=" + postid;
		NewElement1.appendChild(NewElement2);
		NewElement1.appendChild(NewElement3);
		NewElement2.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
		NewElement3.setAttribute("class", "C(c-secondary) Fz(12px)");
		NewElement3.innerHTML = "Single Quote";

		if (document.URL.match(/^.*\/show_post\/*./g)) {
			NewElement1.appendBefore(listreply[i]);
		} else {
			NewElement1.appendBefore(list[i]);
		}
	}
}


function nestedSingleQuote() {
	var list = document.getElementsByClassName("jsButtonReply buttonReply");
	var thread = document.getElementById("thread_id");
	var post = getElementsByIdStartsWith("div", "post");

	for (var i = 0; i < list.length; i++) {
		var NewElement1 = document.createElement('a');
		var NewElement2 = document.createElement('i');
		var NewElement3 = document.createElement('span');
		var threadid = thread.getAttribute("value");
		var postid = post[i].getAttribute("id").match(/[^post].*/g);

		if (list[i].className == 'jsButtonReply buttonReply') {
			NewElement1.setAttribute("class", "buttonMultiquote Mend(15px) Px(8px)");
			NewElement1.href = "/post_reply/" + threadid + "/?post=" + postid;
			NewElement1.appendBefore(list[i]);
			NewElement1.appendChild(NewElement2);
			NewElement1.appendChild(NewElement3);
			NewElement2.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
			NewElement3.setAttribute("class", "C(c-secondary) Fz(12px)");
			NewElement3.innerHTML = "Single Quote";
		}
	}
}


function nestedMultiQuote() {
	var list = document.getElementsByClassName("jsButtonReply buttonReply");
	var thread = document.getElementById("thread_id");
	var post = getElementsByIdStartsWith("div", "post");

	for (var i = 0; i < list.length; i++) {
		var NewElement1 = document.createElement('a');
		var NewElement2 = document.createElement('i');
		var NewElement3 = document.createElement('span');
		var threadid = thread.getAttribute("value");
		var postid = post[i].getAttribute("id").match(/[^post].*/g);
		var click = "quote('" + threadid + "', '" + postid + "');return false;";

		if (list[i].className == 'jsButtonReply buttonReply') {
			NewElement1.href = "javascript:void(0);";
			NewElement1.setAttribute("class", "D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) jsButtonMultiquote buttonMultiquote");
			NewElement1.setAttribute("onclick", click);
			NewElement1.appendBefore(list[i]);
			NewElement1.appendChild(NewElement2);
			NewElement1.appendChild(NewElement3);
			NewElement2.setAttribute("class", "single-quote fas C(c-secondary) fa-comments Mend(2px)");
			NewElement3.setAttribute("class", "C(c-secondary) Fz(12px)");
			NewElement3.innerHTML = "Multi Quote";
		}
	}
}


function replaceKutip() {
	var list = document.getElementsByTagName("span");
	for (var i = 0; i < list.length; i++) {
		if (list[i].innerHTML === 'Kutip') {
			list[i].innerHTML = list[i].innerHTML.replace("Kutip", "Multi Quote");
		}
	}
}


function getText() {
	var elem = document.getElementById("reply-messsage").value;
	var link = document.URL;

	if (link.match(/^.*\/\?post=.*/g)) {
		GM_setValue("quote", elem);
		link = link.match(/^.*\//g);
		window.location.href = link;
	}
	if (link.match(/^.*\/$/g)) {
		document.getElementById("reply-messsage").value = GM_getValue("quote");
	}
	GM_deleteValue("quote");
}

window.onload = function () {
	var reply = document.getElementsByClassName("Fx(flexZero) jsShowNestedTrigger Cur(p)");
	for (var j = 0; j < reply.length; j++) {
		reply[j].click();					
	}
	setTimeout(nestedSingleQuote, 1000);
	setTimeout(nestedMultiQuote, 1500);
}


replaceKutip();
singleQuote();
getText();