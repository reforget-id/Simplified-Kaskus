// ==UserScript==
// @name          Kaskus : Insert Quote Button for PC 
// @version       2.5.0
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
.replybox {
min-height: 85px !important;
}
.toolbox {
margin-right: 10px !important;
color: #757373;
}
.toolbox:hover {
color: #000000;
}
.mr-divtools {
margin-top: 10px;
margin-bottom: 3px;
}
.tooltip {
  position: relative;
  display: inline-block;
}
.tooltip .tooltiptext {
  visibility: hidden;
  min-width: 110px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px 5px 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -55px;
  opacity: 0;
  transition: opacity 0.3s;
  font: 13px/normal "Roboto", Arial, sans-serif;
}
.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
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


function insertTextAtCursor(el, text) {
    var val = el.value,
        endIndex, range, doc = el.ownerDocument;
    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (doc.selection != "undefined" && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}


function singleQuote() {
    var list = document.getElementsByClassName("jsButtonMultiquote buttonMultiquote");
    var listreply = document.getElementsByClassName("D(ib) Td(n):h Fz(16px) jsButtonReply buttonReply");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "post");

    for (var i = 0; i < listreply.length; i++) {
        var NE1 = document.createElement('a');
        var NE2 = document.createElement('i');
        var NE3 = document.createElement('span');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id");
        var btnid = "quote" + postid;
        var click = "quote('" + threadid + "', '" + postid.match(/[^post].*/g) + "');return false;";

        NE1.setAttribute("class", "D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) buttonMultiquote");
        NE1.setAttribute("onclick", click);
        NE1.href = "javascript:void(0);";
        NE1.id = btnid;
        NE1.setAttribute("postid", btnid);
        NE1.appendChild(NE2);
        NE1.appendChild(NE3);
        NE2.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
        NE2.setAttribute("postid", btnid);
        NE3.setAttribute("class", "C(c-secondary) Fz(12px)");
        NE3.innerHTML = "Single Quote";
        NE3.setAttribute("postid", btnid);
        NE1.addEventListener("click", function (e) {
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
            NE1.appendBefore(listreply[i]);
        } else {
            NE1.appendBefore(list[i]);
        }
    }
    console.log("berhasil single quote");
};


function nestedSingleQuote() {
    var list = document.getElementsByClassName("jsButtonReply buttonReply");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "post");

    for (var i = 0; i < list.length; i++) {
        var NE1 = document.createElement('a');
        var NE2 = document.createElement('i');
        var NE3 = document.createElement('span');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id");
        var btnid = "quote" + postid;
        var click = "quote('" + threadid + "', '" + postid.match(/[^post].*/g) + "');return false;";

        if (list[i].className == 'jsButtonReply buttonReply') {
            NE1.setAttribute("class", "buttonMultiquote Mend(15px) Px(8px)");
            NE1.setAttribute("onclick", click);
            NE1.href = "javascript:void(0);";
            NE1.id = btnid;
            NE1.setAttribute("postid", btnid);
            NE1.appendBefore(list[i]);
            NE1.appendChild(NE2);
            NE1.appendChild(NE3);
            NE2.setAttribute("class", "single-quote fas C(c-secondary) fa-comment Mend(2px)");
            NE2.setAttribute("postid", btnid);
            NE3.setAttribute("class", "C(c-secondary) Fz(12px)");
            NE3.innerHTML = "Single Quote";
            NE3.setAttribute("postid", btnid);
            NE1.addEventListener("click", function (e) {
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
        var NE1 = document.createElement('a');
        var NE2 = document.createElement('i');
        var NE3 = document.createElement('span');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id").match(/[^post].*/g);
        var click = "quote('" + threadid + "', '" + postid + "');return false;";

        if (list[i].className == 'jsButtonReply buttonReply') {
            NE1.href = "javascript:void(0);";
            NE1.setAttribute("class", "D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) jsButtonMultiquote buttonMultiquote");
            NE1.setAttribute("onclick", click);
            NE1.appendBefore(list[i]);
            NE1.appendChild(NE2);
            NE1.appendChild(NE3);
            NE2.setAttribute("class", "single-quote fas C(c-secondary) fa-comments Mend(2px)");
            NE3.setAttribute("class", "C(c-secondary) Fz(12px)");
            NE3.innerHTML = "Multi Quote";
        }
    }
    console.log("berhasil nested multi quote");
    setTimeout(replyTools, 1000);
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


function replyTools() {
    let position = document.getElementsByClassName("Fx(flexOne) Pstart(15px) Pend(10px)");
    let textarea = getElementsByIdStartsWith("textarea", "qr-message-");

    for (let i = 0; i < position.length; i++) {
        let NE0 = document.createElement('div')
        let NE1 = document.createElement('button')
        let NE2 = document.createElement('i')
        let textareaId = textarea[i].getAttribute("id")
        let click = (x) => `insertBBCode('[${x}]','[/${x}]','#${textareaId}');return false;`
        let classAtt = `C(c-grey) C(c-normal):h toolbox jsTippy`

        textarea[i].classList.add('replybox')
        position[i].appendChild(NE0);
        NE0.setAttribute("class", "Fx(flexOne) D(f) Ai(c) mr-divtools");
        NE0.setAttribute('id', 'divtools')

        NE0.innerHTML =
            `
			<button type="button" class="${classAtt}" onclick="${click('B')}">
				<i class="far fa-fw fa-bold tooltip">
					<span class="tooltiptext">Set Text Bold</span>
				</i>
			</button>
			<button type="button" class="${classAtt}" onclick="${click('I')}">
				<i class="far fa-fw fa-italic tooltip">
					<span class="tooltiptext">Set Text Italic</span>
				</i>
			</button>
			<button type="button" class="${classAtt} Fz(15px) Pt(1px)" onclick="${click('U')}">
				<i class="far fa-fw fa-underline tooltip">
					<span class="tooltiptext">Set Text Underline</span>
				</i>
			</button>
			<div class="W(1px) H(16px) Bgc(c-lightgrey) toolbox"></div>
			<button type="button" class="${classAtt}" onclick="${click('LEFT')}">
				<i class="far fa-fw fa-align-left tooltip">
					<span class="tooltiptext">Set Align Left</span>
				</i>
			</button>
			<button type="button" class="${classAtt}" onclick="${click('CENTER')}">
				<i class="far fa-fw fa-align-center tooltip">
					<span class="tooltiptext">Set Align Center</span>
				</i>
			</button>
			<button type="button" class="${classAtt}" onclick="${click('RIGHT')}">
				<i class="far fa-fw fa-align-right tooltip">
					<span class="tooltiptext">Set Align Right</span>
				</i>
			</button>
			<div class="W(1px) H(16px) Bgc(c-lightgrey) toolbox"></div>
			<button type="button" class="${classAtt} urlbtn">
				<i class="far fa-fw fa-link tooltip">
					<span class="tooltiptext">Insert URL</span>
				</i>
			</button>
			<button type="button" class="${classAtt} imgurlbtn">
				<i class="far fa-fw fa-image tooltip">
					<span class="tooltiptext">Insert Image From URL</span>
				</i>
			</button>
			<button type="button" class="${classAtt} spoilerbtn">
				<i class="far fa-fw fa-comment-dots tooltip">
					<span class="tooltiptext">Insert Spoiler</span>
				</i>
			</button>
			
`
        let urlbtn = document.getElementsByClassName('urlbtn')
        urlbtn[i].addEventListener("click", function (e) {
            let url = prompt("URL :")
            if (!(url == null || url == '')) {
                let teks = prompt("Teks yang ditampilkan :")
                if (!(teks == null || teks == '')) {
                    insertTextAtCursor(textarea[i], `[URL="${url}"]${teks}[/URL]`)
                }
            }
        })

        let imgurlbtn = document.getElementsByClassName('imgurlbtn')
        imgurlbtn[i].addEventListener("click", function (e) {
            let url = prompt("Image URL :")
            if (!(url == null || url == '')) {
                insertTextAtCursor(textarea[i], `[IMG]${url}[/IMG]`)
            }
        })

        let spoilerbtn = document.getElementsByClassName('spoilerbtn')
        spoilerbtn[i].addEventListener("click", function (e) {
            let judul = prompt("Judul Spoiler :")
            if (!(judul == null || judul == '')) {
                insertTextAtCursor(textarea[i], `[SPOILER=${judul}] 

[/SPOILER]`)
            }
        })

    }
}


/*
function setJS(){
	let head = document.getElementsByTagName('head')[0]
	let script = document.createElement('script')
	
	script.setAttribute('type', 'text/javascript')
	script.setAttribute('src', 'https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/assets/simplified_kaskus.js')	
	head.appendChild(script)
	
	
}*/


//setJS();
setText();
singleQuote();
replaceKutip();
loading();