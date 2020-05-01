// ==UserScript==
// @name          Kaskus : Insert Quote Button
// @version       2.2.0
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
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-quote.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-quote.user.js
// @grant		  GM_addStyle
// @grant		  GM_setValue
// @grant		  GM_getValue
// @grant		  GM_deleteValue
// @run-at        document-end

// ==/UserScript==


GM_addStyle(`
.sq-post {
margin-right: 18px !important;
padding-right: 6px !important;
padding-left: 6px !important;
padding-top: 5px !important;
padding-bottom: 5px !important;
color: var(--c-secondary);
}
.sq-nested {
margin-right: 20px !important;
padding-right: 7px !important;
padding-left: 7px !important;
padding-top: 6px !important;
padding-bottom: 6px !important;
font-size: 16px !important;
color: var(--c-secondary);
}
.mq-nested {
padding-bottom: 6px !important;
padding-top: 6px !important;
padding-right: 10px !important;
padding-left: 10px !important;
margin-right: 6px !important;
font-size: 18px !important;
color: var(--c-secondary);
}
.mq-color {
background-color: var(--c-orange-night) !important;
color: var(--c-white) !important;
}
.reply-nested {
padding-bottom: 2px !important;
padding-top: 4px !important;
padding-left: 6px !important;
padding-right: 3px !important;
}
.reply-size {
font-size: 15px !important;
}
.mq-post {
padding-right: 4px !important; 
}
`);


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
};


function singleQuote() {
    var list = document.getElementsByClassName("quote-btn");
    var listreply = document.getElementsByClassName("Cur(p) C(c-secondary) nightmode_C(c-secondary-night) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "cendol");

    for (var i = 0; i < listreply.length; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g);

        NewElement.setAttribute("class", "sq-post D(f) Jc(fs) Ai(c) fas fa-comment Fz(20px)");
        NewElement.href = "/post_reply/" + threadid + "/?post=" + postid;

        if (document.URL.match(/^.*\/show_post\/*./g)) {
            NewElement.appendBefore(listreply[i]);
        } else {
            list[i].classList.add("mq-post");
            NewElement.appendBefore(list[i]);
        }
    }
};


function nestedSingleQuote() {
    var list = document.getElementsByClassName("C(#b3b3b3) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "nestedbit-");

    for (var i = 0; i < list.length; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id").match(/[^nestedbit-].*/g);

        NewElement.setAttribute("class", "sq-nested D(f) Jc(fs) Ai(c) fas fa-comment");
        NewElement.href = "/post_reply/" + threadid + "/?post=" + postid;
        NewElement.appendBefore(list[i]);

    }
};


function nestedMultiQuote() {
    var list = document.getElementsByClassName("C(#b3b3b3) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "nestedbit-");

    for (var i = 0; i < list.length; i++) {
        var NewElement1 = document.createElement('div');
        var NewElement2 = document.createElement('div');
        var NewElement3 = document.createElement('i');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id").match(/[^nestedbit-].*/g);
        var click = "return false;";

        list[i].classList.add("reply-nested");
        list[i].firstElementChild.classList.add("reply-size");
        NewElement1.setAttribute("class", "mq-nested quote-btn D(f) Jc(fs) Ai(c) Cur(p) Bdrs(8px) fas fa-comments");
        NewElement1.setAttribute("onclick", click);
        NewElement1.setAttribute("data-postid", postid);
        NewElement1.id = "mq_" + postid;
        NewElement1.appendBefore(list[i]);
    }
};


function getAnchor(element) {
    while (element && element.nodeName != "DIV") {
        element = element.parentNode;
    }
    return element;
};

document.addEventListener("click", function (e) {
    var anchor = getAnchor(e.target);

    if (anchor.classList.contains("mq-nested") && !anchor.classList.contains("mq-color")) {
        anchor.classList.add("mq-color");
    } else if (anchor.classList.contains("mq-nested") && anchor.classList.contains("mq-color")) {
        anchor.classList.remove("mq-color");
    } else {};
});


function getText() {
    var elem = document.getElementById("jsCreateThread").value;
    var link = document.URL;
    if (link.match(/^.*\/\?post=.*/g)) {
        GM_setValue("quote", elem);
        link = link.match(/^.*\//g);
        window.location.href = link;
    }
    if (link.match(/^.*\/$/g)) {
        document.getElementById("jsCreateThread").value = GM_getValue("quote");
    }
    GM_deleteValue("quote");
};


window.onload = function () {
    var reply = document.getElementsByClassName("Fx(flex0Auto) jsShowNestedTrigger");
    for (var i = 0; i < reply.length; i++) {
        reply[i].click();
    }
    setTimeout(nestedSingleQuote, 1000);
    setTimeout(nestedMultiQuote, 1500);
};

singleQuote();
getText();