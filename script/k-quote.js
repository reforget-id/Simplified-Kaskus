// ==UserScript==
// @name          Kaskus : Insert Quote Button
// @version       1.0.0
// @namespace     k-lastpost
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Tambah tombol quote di nested reply
// @include       https://m.kaskus.co.id/thread/*
// @include       https://m.kaskus.co.id/post/*
// @include       https://m.kaskus.co.id/show_post/*
// @include       https://m.kaskus.co.id/lastpost/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-quote.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-quote.js
// @grant		      GM_addStyle
// @run-at        document-idle

// ==/UserScript==


GM_addStyle(`
.quote_btn {
margin-right: 18px !important;
padding-right: 10px !important;
color: #484848 !important;
}
`);


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

    var list = document.getElementsByClassName("D(f) Jc(fs) Ai(c) Mstart(10px) C(#b3b3b3) reply-btn");
    var cl = document.getElementsByClassName("D(f) Jc(fs) Ai(c)"); 
		var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "nestedbit-");
    var btn = document.getElementsByClassName("quote_btn fas fa-comments Fz(20px)");

    for (var i = 0; i < list.length ; i++) {
        var NewElement = document.createElement('a');
			  var threadid = thread.getAttribute("value");
			  var postid = post[i].getAttribute("id");

        if (!cl[i].contains(btn[i])) {
					  //NewElement.innerHTML = 'Quote Post';
					  NewElement.setAttribute("class", "quote_btn fas fa-comments Fz(20px)");
            NewElement.href = "/post_reply/" + threadid + "/?post=" + postid.match(/[^nestedbit-].*/g);
            NewElement.appendBefore(list[i]);
        }
    }
}


window.onload=function(){
  var reply = document.getElementsByClassName("Fx(flex0Auto) jsShowNestedTrigger");
	
	for (var i = 0; i < reply.length ; i++) {
			reply[i].click();
	}
	setTimeout(Main, 3000);
}
