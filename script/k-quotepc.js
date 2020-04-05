// ==UserScript==
// @name          Kaskus : Insert Quote Button for PC
// @version       1.1.0
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
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-quotepc.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-quotepc.js
// @grant		      GM_addStyle
// @grant		      GM_setValue
// @grant		      GM_getValue
// @grant		      GM_deleteValue
// @run-at        document-idle

// ==/UserScript==


GM_addStyle(`
.single-quote {
margin-right: 18px !important;
padding-right: 10px !important;
margin-top: 5px !important;
font-size: 15px !important;
}
`);


var link = document.URL;

/* Adds Element BEFORE NeighborElement */
Element.prototype.appendBefore = function(element) {
  element.parentNode.insertBefore(this, element);
}, false;

/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function(element) {
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

function singleQuote(){
    var list = document.getElementsByClassName("Fx(flexOne) D(f) Ai(c) vote-wrapper");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "post");

    for (var i = 0; i < list.length ; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id");

        NewElement.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
        NewElement.href = "/post_reply/" + threadid + "/?post=" + postid.match(/[^post].*/g);
        NewElement.appendAfter(list[i]);        
    }
}


function getText(){
    var elem = document.getElementById("reply-messsage").value;
    var link = document.URL;
    if (link == link.match(/^.*\/\?post=.*/g)){		
        GM_setValue("quote", elem);
        link = link.match(/^.*\//g);
        window.location.href = link;
    }

    if (link == link.match(/^.*\/$/g)){
        document.getElementById("reply-messsage").value = GM_getValue("quote");
    }
	
		GM_deleteValue("quote");	
}


window.onload=function(){
    var reply = document.getElementsByClassName("Fx(flexZero) jsShowNestedTrigger Cur(p)");
    for (var i = 0; i < reply.length ; i++) {
        reply[i].click();
    }
    setTimeout(singleQuote, 2500);
}

getText();




