// ==UserScript==
// @name          Kaskus : Insert Quote Button for PC 
// @version       2.4.0
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
.nested-height {
min-height: 50px !important;
padding-bottom: 20px !important;
}
`);


// Adds Element BEFORE NeighborElement 
Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
}, false;

// Adds Element AFTER NeighborElement 
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
};

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
		var postid = post[i].getAttribute("id");
		var btnid = "quote" + postid;
		var click = "quote('" + threadid + "', '" + postid.match(/[^post].*/g) + "');return false;";

		NewElement1.setAttribute("class", "D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) buttonMultiquote");
		NewElement1.setAttribute("onclick", click);
		NewElement1.href = "javascript:void(0);";
		NewElement1.id = btnid;
		NewElement1.setAttribute("postid", btnid);
		NewElement1.appendChild(NewElement2);
		NewElement1.appendChild(NewElement3);
		NewElement2.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
		NewElement2.setAttribute("postid", btnid);
		NewElement3.setAttribute("class", "C(c-secondary) Fz(12px)");
		NewElement3.innerHTML = "Single Quote";
		NewElement3.setAttribute("postid", btnid);
		NewElement1.addEventListener("click", function (e) {
			var check = document.getElementById("openiframe");
			if (typeof (check) == 'undefined' || check == null) {
				var frame = document.createElement('iframe');
				frame.style.display = "none";
				frame.src = "/post_reply/" + threadid;
				frame.setAttribute("id", "openiframe");
				frame.setAttribute("frameid", e.target.getAttribute("postid"));
				document.body.appendChild(frame);
				getIframe();
			}
		});

		if (document.URL.match(/^.*\/show_post\/*./g)) {
			NewElement1.appendBefore(listreply[i]);
		} else {
			NewElement1.appendBefore(list[i]);
		}
	}
	console.log("berhasil single quote");
};


function nestedSingleQuote() {
	var list = document.getElementsByClassName("jsButtonReply buttonReply");
	var thread = document.getElementById("thread_id");
	var post = getElementsByIdStartsWith("div", "post");

	for (var i = 0; i < list.length; i++) {
		var NewElement1 = document.createElement('a');
		var NewElement2 = document.createElement('i');
		var NewElement3 = document.createElement('span');
		var threadid = thread.getAttribute("value");
		var postid = post[i].getAttribute("id");
		var btnid = "quote" + postid;
		var click = "quote('" + threadid + "', '" + postid.match(/[^post].*/g) + "');return false;";

		if (list[i].className == 'jsButtonReply buttonReply') {
			NewElement1.setAttribute("class", "buttonMultiquote Mend(15px) Px(8px)");
			NewElement1.setAttribute("onclick", click);
			NewElement1.href = "javascript:void(0);";
			NewElement1.id = btnid;
			NewElement1.setAttribute("postid", btnid);
			NewElement1.appendBefore(list[i]);
			NewElement1.appendChild(NewElement2);
			NewElement1.appendChild(NewElement3);
			NewElement2.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
			NewElement2.setAttribute("postid", btnid);
			NewElement3.setAttribute("class", "C(c-secondary) Fz(12px)");
			NewElement3.innerHTML = "Single Quote";
			NewElement3.setAttribute("postid", btnid);
			NewElement1.addEventListener("click", function (e) {
				var check = document.getElementById("openiframe");
				if (typeof (check) == 'undefined' || check == null) {
					var frame = document.createElement('iframe');
					frame.style.display = "none";
					frame.src = "/post_reply/" + threadid;
					frame.setAttribute("id", "openiframe");
					frame.setAttribute("frameid", e.target.getAttribute("postid"));
					document.body.appendChild(frame);
					getIframe();
				}
			});
		}
	}
	console.log("berhasil nested single quote");
	setTimeout(nestedMultiQuote, 500);
};


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
	console.log("berhasil nested multi quote");
	setTimeout(focus, 1000);
};


function replaceKutip() {
	var list = document.getElementsByTagName("span");
	for (var i = 0; i < list.length; i++) {
		if (list[i].innerHTML === 'Kutip') {
			list[i].innerHTML = list[i].innerHTML.replace("Kutip", "Multi Quote");
		}
	}
	console.log("berhasil replace text");
};


function nestedProperty() {
	var item = [];
	var nest = document.getElementsByClassName("statusFetchData");
	for (var j = 0; j < nest.length; j++) {
		item.push(nest[j].style.display);
		console.log(item[j]);
	}

	if (item.includes("")) {
		console.log("gagal");
		setTimeout(nestedProperty, 300);
	} else {
		var list = document.getElementsByClassName("C(c-primary) Fz(14px) pagetext");
		for (var i = 0; i < list.length; i++) {
			if (list[i].className === 'C(c-primary) Fz(14px) pagetext') {
				list[i].classList.add("nested-height", "Bdb(borderSolidLightGrey)");
			}
		}
		console.log("berhasil property");
		nestedSingleQuote();
	}
};


function removeMultiquote() {
	var selected = document.getElementsByClassName("jsButtonMultiquote");
	for (var i = 0; i < selected.length; i++) {
		if (selected[i].classList.contains("is-selected")) {
			selected[i].click();
			console.log("multi quote dihapus");
		}
	}
}


function getIframe() {
	var frame = document.getElementById("openiframe");
	var link = frame.src;
	var elem = frame.contentWindow.document.getElementById("reply-messsage");
	var postid = frame.getAttribute("frameid");
	if (typeof (elem) == 'undefined' || elem == null) {
		console.log("element kosong");
		setTimeout(getIframe, 200);
	} else {
		var val = elem.value;
		GM_setValue("quote", val);
		console.log(GM_getValue("quote"));
		console.log(link);
		removeMultiquote();
		document.getElementById(postid).click();
		console.log("single quote dihapus");
		window.location.href = link + "/";
	}
};


function setText() {
	if (window.location.href.match(/^.*post_reply.*\/$/g)) {
		console.log(GM_getValue("quote"));
		document.getElementById("reply-messsage").value = GM_getValue("quote");
		//GM_deleteValue("quote");
	}

};


function loading() {
	var item = [];
	var balas = document.getElementsByClassName("jsShowNestedTrigger");
	for (var i = 0; i < balas.length; i++) {
		if (balas[i].classList.contains("getNestedAD")) {
			balas[i].click();
			console.log("klik " + i);
		}
	}
	for (var j = 0; j < balas.length; j++) {
		item.push(balas[j].className);
		console.log(item[j]);
	}
	if (item.includes("Fx(flexZero) jsShowNestedTrigger getNestedAD Cur(p)")) {
		console.log("gagal");
		setTimeout(loading, 500);
	} else {
		console.log("berhasil loading");
		nestedProperty();
	}
};


function focus() {
	var url = window.location.href;
	if (url.match(/.*\/(lastpost|post)\/.*/)) {
		var post = url.match(/(?!#post)\w{24}$/);
		var postid = "post" + post;
		var element = document.getElementById(postid);
		var headerOffset = 60;
		var bodyRect = document.body.getBoundingClientRect().top;
		var elementRect = element.getBoundingClientRect().top;
		var elementPosition = elementRect - bodyRect;
		var offsetPosition = elementPosition - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: "smooth"
		});
		console.log("focus berhasil");
	}
};

setText();
singleQuote();
replaceKutip();
loading();