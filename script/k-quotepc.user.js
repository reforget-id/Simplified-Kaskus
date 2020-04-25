// ==UserScript==
// @name          Kaskus : Insert Quote Button
// @version       2.1.2
// @namespace     k-quote
// @author        ffsuperteam
// @icon          https://www.google.com/s2/favicons?domain=m.kaskus.co.id
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Tambah tombol quote di nested reply
// @include       https://m.kaskus.co.id/thread/*
// @include       https://m.kaskus.co.id/post/*
// @include       https://m.kaskus.co.id/show_post/*
// @include       https://m.kaskus.co.id/lastpost/*
// @include       https://m.kaskus.co.id/post_reply/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-quote.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/k-quote.user.js
// @grant		      GM_addStyle
// @grant		      GM_setValue
// @grant		      GM_getValue
// @grant		      GM_deleteValue
// @run-at        document-end

// ==/UserScript==


GM_addStyle(`
.quote_btn {
margin-right: 18px !important;
padding-right: 10px !important;
font-size: 16px !important;
color: var(--c-secondary);
}
.single-quote {
margin-right: 18px !important;
padding-right: 10px !important;
color: var(--c-secondary);
}
`);


var link = document.URL;

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

function quoteNested(){
    var list = document.getElementsByClassName("D(f) Jc(fs) Ai(c) Mstart(10px) C(#b3b3b3) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "nestedbit-");

    for (var i = 0; i < list.length ; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id");

        NewElement.setAttribute("class", "quote_btn fas fa-comment Fz(20px)");
        NewElement.href = "/post_reply/" + threadid + "/?post=" + postid.match(/[^nestedbit-].*/g);
        NewElement.appendBefore(list[i]);
        
    }
}

function singleQuote(){
		var list = document.getElementsByClassName("quote-btn D(f) Jc(fs) Ai(c) Mend(10px) Cur(p) is-multiquoted_Bgc(c-orange-night) Px(8px) Py(3px) Bdrs(8px) is-multiquoted_C(c-white) is-multiquoted_Fw(500)");  
	  var listreply = document.getElementsByClassName("D(f) Jc(fs) Ai(c) Cur(p) Mstart(10px) C(c-secondary) nightmode_C(c-secondary-night) reply-btn");  
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "cendol");

    for (var i = 0; i < listreply.length ; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id");

        NewElement.setAttribute("class", "single-quote fas fa-comment Fz(20px)");
        NewElement.href = "/post_reply/" + threadid + "/?post=" + postid.match(/[^cendol].*/g);
			  
				if(window.location.href.match(/^.*m\.kaskus\.co\.id\/show_post\/*./g)){
						NewElement.appendBefore(listreply[i]);  
				}
				else{
						NewElement.appendBefore(list[i]);  
				}
    }
}

function getText(){
    var elem = document.getElementById("jsCreateThread").value;
    var link = document.URL;
    if (link == link.match(/^.*\/\?post=.*/g)){			
        GM_setValue("quote", elem);
        link = link.match(/^.*\//g);
        window.location.href = link;
		}
	
     if (link == link.match(/^.*\/$/g)){
      	document.getElementById("jsCreateThread").value = GM_getValue("quote");
    }	
	
     GM_deleteValue("quote");
}


singleQuote();

window.onload=function(){
    var reply = document.getElementsByClassName("Fx(flex0Auto) jsShowNestedTrigger");
    for (var i = 0; i < reply.length ; i++) {
        reply[i].click();
    }
    setTimeout(quoteNested, 2500);
}

getText();




