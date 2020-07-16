// ==UserScript==
// @name          Kaskus : Insert Quote Button 
// @version       2.7.1
// @namespace     k-quote
// @author        ffsuperteam
// @icon          https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
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
.padbottom {
padding-bottom: 5px !important;
}
.padtop {
padding-top: 5px !important;
}
.minheight {
min-height: 70px !important;
}
.replybox {
min-height: 92px
}
.toolbox {
padding-left: 1px;
padding-right: 3px
}
.btncolor {
color: #757575
}
.smilieswrapper {
box-shadow: 0px 6px 19px 6px rgba(0,0,0,0.1);
top: 30px;
}
.smilieswrapper:before {
content: "";
background-image: url(https://s.kaskus.id/assets/wap_1.0/images/icon-triangle-day.svg);
background-repeat: no-repeat;
background-size: contain;
width: 18px;
height: 18px;
position: absolute;
top: -9px;
left: 132px;
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

function getElementsByClassStartsWith(selectorTag, prefix) {
    var items = [];
    var myPosts = document.getElementsByClassName(selectorTag);
    for (var i = 0; i < myPosts.length; i++) {
        var next = myPosts[i].children[0];
        if ((myPosts[i].className == selectorTag) && (next.id.lastIndexOf(prefix, 0) === 0)) {
            items.push(next);
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
		el.focus()
    } else if (doc.selection != "undefined" && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}



function singleQuote() {
    var list = document.getElementsByClassName("quote-btn");
    var listreply = document.getElementsByClassName("Cur(p) C(c-secondary) nightmode_C(c-secondary-night) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByIdStartsWith("div", "cendol");

    for (var i = 0; i < listreply.length; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g);
        var click = "quote('" + threadid + "', '" + postid + "');return false;";

        NewElement.setAttribute("class", "sq-post D(f) Jc(fs) Ai(c) fas fa-comment Fz(20px)");
        NewElement.setAttribute("onclick", click);
        NewElement.id = "sq" + postid;
        NewElement.href = "javascript:void(0);";
        NewElement.addEventListener("click", function (e) {
            var check = document.getElementById("openiframe");
            if (typeof (check) == 'undefined' || check == null) {
                var frame = document.createElement('iframe');
                frame.style.display = "none";
                frame.src = "/post_reply/" + threadid;
                frame.setAttribute("id", "openiframe");
                frame.setAttribute("frameid", e.target.id);
                document.body.appendChild(frame);
                getIframe();
            }
        });

        if (document.URL.match(/^.*\/show_post\/*./g)) {
            NewElement.appendBefore(listreply[i]);
        } else {
            list[i].classList.add("mq-post");
            NewElement.appendBefore(list[i]);
        }
    }
    console.log("berhasil single quote");
};


function nestedSingleQuote() {
    var list = document.getElementsByClassName("C(#b3b3b3) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByClassStartsWith("D(f) Jc(fs) Ai(c) c-reputation Mend(20px)", "cendol");

    for (var i = 0; i < list.length; i++) {
        var NewElement = document.createElement('a');
        var threadid = thread.getAttribute("value");
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g);
        var click = "quote('" + threadid + "', '" + postid + "');return false;";

        NewElement.setAttribute("class", "sq-nested D(f) Jc(fs) Ai(c) fas fa-comment");
        NewElement.appendBefore(list[i]);
        NewElement.setAttribute("onclick", click);
        NewElement.id = "nsq" + postid;
        NewElement.href = "javascript:void(0);";
        NewElement.addEventListener("click", function (e) {
            var check = document.getElementById("openiframe");
            if (typeof (check) == 'undefined' || check == null) {
                var frame = document.createElement('iframe');
                frame.style.display = "none";
                frame.src = "/post_reply/" + threadid;
                frame.setAttribute("id", "openiframe");
                frame.setAttribute("frameid", e.target.id);
                document.body.appendChild(frame);
                getIframe();
            }
        });
    }
    console.log("berhasil nested single quote")
    setTimeout(nestedMultiQuote, 100);
};


function nestedMultiQuote() {
    var list = document.getElementsByClassName("C(#b3b3b3) reply-btn");
    var thread = document.getElementById("thread_id");
    var post = getElementsByClassStartsWith("D(f) Jc(fs) Ai(c) c-reputation Mend(20px)", "cendol");

    for (var i = 0; i < list.length; i++) {
        var NewElement1 = document.createElement('div');
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g);
        var click = "return false;";

        list[i].classList.add("reply-nested");
        list[i].firstElementChild.classList.add("reply-size");
        NewElement1.setAttribute("class", "mq-nested quote-btn D(f) Jc(fs) Ai(c) Cur(p) Bdrs(8px) fas fa-comments");
        NewElement1.setAttribute("onclick", click);
        NewElement1.setAttribute("data-postid", postid);
        NewElement1.id = "mq_" + postid;
        NewElement1.appendBefore(list[i]);
        NewElement1.addEventListener("click", function (e) {
            e.target.classList.toggle("mq-color");
        });
    }
    console.log("berhasil multi quote")
    setTimeout(focus, 700);
	setTimeout(replyTools, 1000)
};


function nestedProperty() {
    var item = [];
    var nest = document.getElementsByClassName("jsNestedItem statusFetchData");
    for (var j = 0; j < nest.length; j++) {
        item.push(nest[j].style.display);
        console.log(item[j]);
    }

    if (item.includes("")) {
        console.log("gagal");
        setTimeout(nestedProperty, 300);
    } else {
        var elem1 = document.getElementsByClassName("Py(16px) Bdt(borderSolidGray2) nightmode_Bdt(borderSolidGray6) ");
        var elem2 = document.getElementsByClassName("D(f) Jc(sb) Ai(c) W(100%) Pstart(36px) Pt(8px) Fz(12px) C(c-normal) nightmode_C(c-normal)");
        var elem3 = document.getElementsByClassName("D(f) Pos(r) Mb(10px)");

        for (var i = 0; i < elem1.length; i++) {
            if (elem1[i].className === 'Py(16px) Bdt(borderSolidGray2) nightmode_Bdt(borderSolidGray6) ') {
                elem1[i].classList.add("padbottom");
            }
            if (elem2[i].className === 'D(f) Jc(sb) Ai(c) W(100%) Pstart(36px) Pt(8px) Fz(12px) C(c-normal) nightmode_C(c-normal)') {
                elem2[i].classList.add("Bdt(borderSolidGray2)", "nightmode_Bdt(borderSolidGray6)", "padtop");
            }
            if (elem3[i].className === 'D(f) Pos(r) Mb(10px)') {
                elem3[i].classList.add("minheight");
            }
        }
        console.log("berhasil property");
        nestedSingleQuote();
    }
};


function removeMultiquote() {
    var selected = document.getElementsByClassName("quote-btn");
    for (var i = 0; i < selected.length; i++) {
        var style = getComputedStyle(selected[i]);
        var backgroundColor = style.backgroundColor;
        if (backgroundColor == "rgb(253, 186, 77)") {
            selected[i].click();
            console.log("multi quote dihapus");
        }
    }
};


function getIframe() {
    document.body.style.opacity = "0.5";
    var frame = document.getElementById("openiframe");
    var link = frame.src;
    var elem = frame.contentWindow.document.getElementById("jsCreateThread");
    var btnid = frame.getAttribute("frameid");
    if (typeof (elem) == 'undefined' || elem == null) {
        console.log("element kosong");
        setTimeout(getIframe, 200);
    } else {
        var val = elem.value;
        GM_setValue("quote", val);
        console.log(GM_getValue("quote"));
        removeMultiquote();
        document.getElementById(btnid).click();
        console.log("single quote dihapus");
        window.location.href = link + "/";
    }
};


function setText() {
    if (window.location.href.match(/^.*post_reply.*\/$/g)) {
        console.log(GM_getValue("quote"));
        document.getElementById("jsCreateThread").value = GM_getValue("quote");
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
    if (item.includes("Fx(flex0Auto) jsShowNestedTrigger getNestedAD")) {
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
        var postid = "postcontent" + post;
        var element = document.getElementById(postid);
        var headerOffset = 85;
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
    let position = document.getElementsByClassName('Ta(end) Mt(5px)')
    let textarea = document.querySelectorAll('textarea.Bdrs\\(3px\\)')

    for (let i = 0; i < position.length; i++) {
		textarea[i].setAttribute('id', `textarea${i}`)
        let NE0 = document.createElement('div')
		let textareaId = textarea[i].getAttribute('id')
        textarea[i].classList.add('replybox')
        position[i].prepend(NE0)
        NE0.setAttribute("class", "Fx(flexOne) D(f) Ai(c) mr-divtools");
        NE0.setAttribute('id', 'divtools')

        NE0.innerHTML = `
			<button type="button" class="btncolor toolbox boldbtn">
				<i class="far fa-fw fa-bold"></i>
			</button>
			<button type="button" class="btncolor toolbox italicbtn">
				<i class="far fa-fw fa-italic"></i>
			</button>
			<button type="button" class="btncolor toolbox Fz(15px) Pt(1px) ulbtn" style="margin-right: 3px">
				<i class="far fa-fw fa-underline"></i>
			</button>
			<div class="W(1px) H(16px)" style="background-color: #d6d3d3"></div>
			<button type="button" class="btncolor centerbtn">
				<i class="far fa-fw fa-align-center"></i>
			</button>
			<div class="W(1px) H(16px)" style="background-color: #d6d3d3"></div>
            <button type="button" class="btncolor smiliesbtn">
            	<i class="far fa-fw fa-smile"></i>
            </button>
			<button type="button" class="btncolor urlbtn">
				<i class="far fa-fw fa-link"></i>
			</button>
			<button type="button" class="btncolor imgurlbtn">
				<i class="far fa-fw fa-image"></i>
			</button>
`		
		
		let boldbtn = document.getElementsByClassName('boldbtn')
        boldbtn[i].addEventListener("click", () => {
                insertTextAtCursor(textarea[i], `[B] [/B]`)
        })
		
		let italicbtn = document.getElementsByClassName('italicbtn')
        italicbtn[i].addEventListener("click", () => {
                insertTextAtCursor(textarea[i], `[I] [/I]`)
        })
		
		let ulbtn = document.getElementsByClassName('ulbtn')
        ulbtn[i].addEventListener("click", () => {
                insertTextAtCursor(textarea[i], `[U] [/U]`)
        })
		
		let cbtn = document.getElementsByClassName('centerbtn')
        cbtn[i].addEventListener("click", () => {
                insertTextAtCursor(textarea[i], `[CENTER] [/CENTER]`)
        })
		
        let urlbtn = document.getElementsByClassName('urlbtn')
        urlbtn[i].addEventListener("click", () => {
            let url = prompt("URL :")
            if (!(url == null || url == '')) {
                let teks = prompt("Teks yang ditampilkan :")
                if (!(teks == null || teks == '')) {
                    insertTextAtCursor(textarea[i], `[URL="${url}"]${teks}[/URL]`)
                }
            }
        })
				
        let imgurlbtn = document.getElementsByClassName('imgurlbtn')
        imgurlbtn[i].addEventListener("click", () => {
            let url = prompt("Image URL :")
            if (!(url == null || url == '')) {
                insertTextAtCursor(textarea[i], `[IMG]${url}[/IMG]`)
            }
        })
		
		let smiliesbtn = document.getElementsByClassName('smiliesbtn')
        smiliesbtn[i].addEventListener("click", function () {
			let smiliesBox = document.getElementById('smiliesBox')
			if (!(typeof (smiliesBox) == 'undefined' || smiliesBox == null)){
				smiliesBox.remove()
				this.removeAttribute('style')
			}
			else{
				this.setAttribute('style', 'color: rgb(25, 152, 237)')
				let smilediv = document.createElement('div')
				smilediv.setAttribute('id', 'smiliesBox')
				smilediv.setAttribute('style', 'z-index: 999999; position: relative')
				position[i].prepend(smilediv)
				smilediv.innerHTML = `
<div class="Pos(a) T(37px) Start(0) W(100%) Bgc(c-white) nightmode_Bgc(c-gray-7) Bd(light-grey-border) nightmode_Bdc(c-dark-grey-2) nightmode_Bxsh(shadowShare) Z(99) D(n) smilieswrapper" style="position: absolute; display: block"><div class="jsSmiliesTabNav"><ul class="Ov(h) Maw(100%) Whs(nw) D(f) Jc(fs) Ovx(a) Ai(c)" id="jsSmiliesTabNavHead">
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab0" data-categoryname="Plus Exclusive">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaqurkkof.gif" alt="Plus Exclusive">
</a>
</li>
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab1" data-categoryname="Smilies 3.0">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/march2017/smilie_group_fbohhwkox78o.gif" alt="Smilies 3.0">
</a>
</li>
<li class="Px(13px) Py(5px) active">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab2" data-categoryname="Only in KASKUS">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaqv1h9do.gif" alt="Only in KASKUS">
</a>
</li>
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab3" data-categoryname="Only in KASKUS(small)">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaquwaje1.gif" alt="Only in KASKUS(small)">
</a>
</li>
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab4" data-categoryname="Standart Smilies">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaqv2cprr.gif" alt="Standart Smilies">
</a>
</li>
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab5" data-categoryname="RaisaxOPPO">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/december2016/smilie_group_fbfj6i47tv7j.gif" alt="RaisaxOPPO">
</a>
</li>
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab6" data-categoryname="Sundul Dunia">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/july2018/smilie_group_fbyqecle0wyv.gif" alt="Sundul Dunia">
</a>
</li>
<li class="Px(13px) Py(5px)">
<a href="#" class="smilies-tab" onclick="return false" data-id="#tab7" data-categoryname="Giphy">
<img class="Grayscale(100%) W(28px) H(auto) Maw(28px) Mah(28px)" src="https://s.kaskus.id/img/seasonal/june2018/smilie_group_fbynlhikkobq.png" alt="Giphy">
</a>
</li>
</ul></div><div class="Ovy(a) Ov(h) Px(16px) Py(5px) Mah(230px)" id="jsSmiliesTabContent" textareaid=${textareaId}>
<div class="D(n) tabcontent" style="display:none" id="tab0">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeo3cobwwnh.gif" data-src=":welcome">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeo3coe6ltn.gif" data-src=":terimakasih">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9n3iqj.gif" data-src=":tepuktangan">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbey5o7hwr1s.gif" data-src=":tepar">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ognstk6ml.gif" data-src=":sudahkuduga">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9huzjo.gif" data-src=":siapgan">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9cln0l.gif" data-src=":semangat">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeo3cojogfl.gif" data-src=":sale">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5i1ormrmng.gif" data-src=":pertamax">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ognt7s97w.gif" data-src=":pencet">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeo3coop1hn.gif" data-src=":paket">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeo3cohriho.gif" data-src=":nyantai">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntj5ay6.gif" data-src=":nulisah">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li8hidgu.gif" data-src=":monggo">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li8c2qu0.gif" data-src=":merdeka">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5i1oqzqzc2.gif" data-src=":kangen">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5i1oqy98xv.gif" data-src=":jones">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5i1oqtmu9v.gif" data-src=":insomnia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeo3confsaw.gif" data-src=":hargapas">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9rpj03.gif" data-src=":goyang">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li8a2db4.gif" data-src=":garudadidadaku">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntmyt72.gif" data-src=":gagalpaham">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntoc022.gif" data-src=":gaasik">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntptuty.gif" data-src=":dor">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntt5wfk.gif" data-src=":cih">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogktza4ll.gif" data-src=":ceyem">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5i2wtqtpje.gif" data-src=":butuhpacar">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5iakdq4cug.gif" data-src=":bokek">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fby5xxz3p50r.gif" data-src=":belumtidur">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li80dvu9.gif" data-src=":batik">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li7ugrgl.gif" data-src=":banggapakebatik">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbp6li76gyt8.gif" data-src=":ayoindonesia">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab1">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbohhx46ijiq.gif" data-src=":ngamuk">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbohhxbaeg1k.gif" data-src=":lemparbata">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbohhx488el3.gif" data-src=":keepposting">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbohhx4dkayo.gif" data-src=":hansip">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbohhx40jqmd.gif" data-src=":cendolgan">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbohhx42ehj0.gif" data-src=":bigkiss">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:block" id="tab2">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5p7bhjffzl.gif" data-src=":xmas">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiimgq21.gif" data-src=":wow">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtykhbhj.gif" data-src=":wkwkwk">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiiief4q.gif" data-src=":wakaka">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyu0dd5rpa3.gif" data-src=":wagelaseh">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1zwmwkm.gif" data-src=":ultahhore">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1i58kbq.gif" data-src=":ultah">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/traveller.gif" data-src=":travel">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1iothbu.gif" data-src=":toast">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz15dew4.gif" data-src=":telolet4">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz123tem.gif" data-src=":telolet3">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz113cdq.gif" data-src=":telolet2">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz0z4sbg.gif" data-src=":telolet1">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1itttkb.gif" data-src=":takut">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pxsn75.gif" data-src=":sup:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1iy2y34.gif" data-src=":sup2">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xldg9p.gif" data-src=":sorry">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeqyos6i5nk.gif" data-src=":shakehand2">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtwaipmr.gif" data-src=":selamat">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiiddd93.gif" data-src=":salamkenal">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/lebaran03.gif" data-src=":salaman">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/salah_kamar.gif" data-src=":salahkamar">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pti017.gif" data-src=":request">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtyqhwnh.gif" data-src=":repost:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_repost2.gif" data-src=":repost2">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_repost1.gif" data-src=":repost">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xidtbd.gif" data-src=":recsel">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvqnpxx.gif" data-src=":rate5">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqlyagi7.gif" data-src=":peluk">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfjmzk6nrxc.gif" data-src=":omtelolet">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fben9zk8izp8.gif" data-src=":nyepi">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zbaufk9.gif" data-src=":nosara">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6ps8oqq.gif" data-src=":nohope">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtyfyn16.gif" data-src=":ngakak">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/ngacir2.gif" data-src=":ngacir2">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/ngacir3.gif" data-src=":ngacir">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/najis.gif" data-src=":najis">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiicfbwj.gif" data-src=":motret">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtveegn8.gif" data-src=":mewek">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvdpjkq.gif" data-src=":matabelo">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5l20l4pt7z.gif" data-src=":marigerak">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zb3lb65.gif" data-src=":marah">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvafv6q.gif" data-src=":malu">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/lebaran04.gif" data-src=":maafaganwati">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/lebaran01.gif" data-src=":maafagan">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fber17aocqul.gif" data-src=":lehuga">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zbf7ivh.gif" data-src=":kts:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvf8ymz.gif" data-src=":kr">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqlwohnn.gif" data-src=":kiss">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/kimpoi.gif" data-src=":kimpoi">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/lebaran05.gif" data-src=":ketupat">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zay8rj5.gif" data-src=":kbgt:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zb8qj68.gif" data-src=":kacau:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zavolvn.gif" data-src=":jrb:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqm927y2.gif" data-src=":imlek2">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqm4l950.gif" data-src=":imlek">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pmu1yk.gif" data-src=":ilovekaskus">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xu2wka.gif" data-src=":iloveindonesia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/hoax.gif" data-src=":hoax">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/hotnews.gif" data-src=":hn">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pkrrrw.gif" data-src=":hammer">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtxkkci6.gif" data-src=":hai">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xc0hnl.gif" data-src=":games">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ogii64nj7.gif" data-src=":entahlah">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeqyos193hf.gif" data-src=":dp">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pg5o6d.gif" data-src=":cystg">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtw20w8z.gif" data-src=":cool">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6q3de6x.gif" data-src=":coblos">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqmdvjfl.gif" data-src=":cipok">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pblpkt.gif" data-src=":cendolbig">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/cekpm.gif" data-src=":cekpm">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeqyortimyf.gif" data-src=":cd:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zaps8px.gif" data-src=":cd">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbf1wzm9bml4.gif" data-src=":catchemall:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/bola.gif" data-src=":bola">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6p94iii.gif" data-src=":bingung">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeqyoryg2b4.gif" data-src=":bigo:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_maho.gif" data-src=":betty">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zalcx0i.gif" data-src=":berduka">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/lebaran02.gif" data-src=":bedug">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqljqkd1.gif" data-src=":batabig">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/babygirl.gif" data-src=":babygirl">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/babyboy1.gif" data-src=":babyboy1">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/babyboy.gif" data-src=":babyboy">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejlbrhvlpt.gif" data-src=":angpau">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbejiqle36zb.gif" data-src=":angel">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1x373yj.gif" data-src=":2thumbup">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1j43vv5.gif" data-src=":1thumbup">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab3">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_peace.gif" data-src=":Yb">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/takuts.gif" data-src=":takuts">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sundulgans.gif" data-src=":sundulgans">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/shutup-kecil.gif" data-src=":shutups">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/reposts.gif" data-src=":reposts">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/ngakaks.gif" data-src=":ngakaks">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/najiss.gif" data-src=":najiss">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/malus.gif" data-src=":malus">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/mads.gif" data-src=":mads">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/kisss.gif" data-src=":kisss">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/iluvkaskuss.gif" data-src=":ilovekaskuss">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/iloveindonesias.gif" data-src=":iloveindonesias">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/hammers.gif" data-src=":hammers">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/cendols.gif" data-src=":cendols">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_cendol.gif" data-src=":cendolb">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/cekpms.gif" data-src=":cekpms">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/capedes.gif" data-src=":capedes">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/bookmark-kecil.gif" data-src=":bookmarks">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/bingungs.gif" data-src=":bingungs">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/mahos.gif" data-src=":bettys">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/berdukas.gif" data-src=":berdukas">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/berbusa-kecil.gif" data-src=":berbusas">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/batas.gif" data-src=":batas">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_batamerah.gif" data-src=":bata">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/army-kecil.gif" data-src=":armys">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/add-friend-kecil.gif" data-src=":addfriends">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/s_sm_smile.gif" data-src=":)b">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab4">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/13.gif" alt=";)">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/001.gif" data-src=":wowcantik">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/44.gif" data-src=":tv">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/47.gif" data-src=":thumbup">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/48.gif" data-src=":thumbdown">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/006.gif" data-src=":think:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/shit-3.gif" data-src=":tai">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/tabrakan.gif" data-src=":tabrakan:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/39.gif" data-src=":table:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/008.gif" data-src=":sun:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/020.gif" data-src=":siul">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/5.gif" data-src=":shutup:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/49.gif" data-src=":shakehand">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/34.gif" data-src=":rose:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/01.gif" data-src=":rolleyes">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/32.gif" data-src=":ricebowl:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/e02.gif" data-src=":rainbow:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/60.gif" data-src=":rain:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/40.gif" data-src=":present:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/41.gif" data-src=":Phone:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/005.gif" data-src=":Peace:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/paw.gif" data-src=":Paws:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/6.gif" data-src=":p">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/rice.gif" data-src=":Onigiri">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/07.gif" data-src=":o">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/35.gif" data-src=":norose:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/q11.gif" data-src=":nohope:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/ngacir.gif" data-src=":ngacir:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/007.gif" data-src=":moon:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/q17.gif" data-src=":metal">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/33.gif" data-src=":medicine:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/004.gif" data-src=":matabelo:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/1.gif" data-src=":malu:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/12.gif" data-src=":mad">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/26.gif" data-src=":linux2:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/25.gif" data-src=":linux1:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/28.gif" data-src=":kucing:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/36.gif" data-src=":kissmouth">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/014.gif" data-src=":kissing:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/smiley_couple.gif" data-src=":kimpoi:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/3.gif" data-src=":kagets:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/hi.gif" data-src=":hi:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/37.gif" data-src=":heart:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/8.gif" data-src=":hammer:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/crazy.gif" data-src=":gila:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/q03.gif" data-src=":genit">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/fuck-4.gif" data-src=":fuck:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/fuck-8.gif" data-src=":fuck3:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/fuck-6.gif" data-src=":fuck2:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/frog.gif" data-src=":frog:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smileyfm329wj.gif" data-src=":fm:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/e03.gif" data-src=":flower:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/52.gif" data-src=":exclamati">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/43.gif" data-src=":email">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/4.gif" data-src=":eek">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/18.gif" data-src=":doctor">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/14.gif" data-src=":D">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/05.gif" data-src=":cool:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/7.gif" data-src=":confused">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/31.gif" data-src=":coffee:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/42.gif" data-src=":clock">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/kaskuslove.gif" data-src=":ck">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/woof.gif" data-src=":buldog">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/38.gif" data-src=":breakheart">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/bolakbalik.gif" data-src=":bingung:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/vana-bum-vanaweb-dot-com.gif" data-src=":bikini">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/q20.gif" data-src=":berbusa">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/smiley_beer.gif" data-src=":beer:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/30.gif" data-src=":baby:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/27.gif" data-src=":babi:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/24.gif" data-src=":army">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/29.gif" data-src=":anjing:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/017.gif" data-src=":angel:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/amazed.gif" data-src=":amazed:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/kribo.gif" data-src=":afro:">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/15.gif" data-src=":)">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/sumbangan/06.gif" data-src=":(">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab5">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4cagtf.gif" data-src=":tempted">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4iwkvj.gif" data-src=":surprised">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4ngca1.gif" data-src=":sad">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4dt90b.gif" data-src=":excited">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4jyfhe.gif" data-src=":angry">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab6">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)">
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynlheek6ga.gif" data-src=":xabi">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyq989xe9up.gif" data-src=":uruguay">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyq989yzuz6.gif" data-src=":swiss">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyqecl7mf6w.gif" data-src=":swedia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynlisntew9.gif" data-src=":spanyol">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynlesypva6.gif" data-src=":rusia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynlit69w53.gif" data-src=":perancis">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynmssas0z0.gif" data-src=":menang">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyqgsbvszbw.gif" data-src=":kroasia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyq98a36rmz.gif" data-src=":kolombia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynmssfwlks.gif" data-src=":kalah">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyqecl2b9vo.gif" data-src=":inggris">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynmsshu1kd.gif" data-src=":gregetan">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbyqgsc06fmp.gif" data-src=":belgia">
</div>
<div class="Mend(10px) My(5px)">
<img class="Maw(54px) Maw(54px)--md Maw(66px)--sm Maw(73px)--ms Maw(59px)--xs" src="https://s.kaskus.id/images/smilies/smilies_fbynlit7ubyb.gif" data-src=":argentina">
</div>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab7" textareaid=${textareaId}>
</div>
</div></div>
`			}
		})
	}
}


function insertSmilies() {
	function getElement(element) {
		while (element && element.nodeName != "IMG") {
			element = element.parentNode;
		}
		return element;
	}

	document.addEventListener("click", (e) => {
		let anchor = getElement(e.target)
		if (!anchor || anchor.target || anchor.protocol == "javascript:" || e.isTrusted === false || !anchor.offsetParent || (e.isTrusted == null && !e.detail)) {
			return;
		}
	
		let tab = anchor.parentNode.parentNode.parentNode.parentNode
		let textareaId = tab.getAttribute('textareaid')
		if (textareaId == 'undefined' || textareaId == null) {
			return;
		}
		
		let tabId = anchor.parentNode.parentNode.parentNode.getAttribute('id')
		let smiley
		if (tabId == 'tab0'){
			smiley = `[IMG]${anchor.getAttribute('src')}[/IMG]`
		}
		else{
			smiley = anchor.getAttribute('data-src')
		}
		 
		let textarea = document.getElementById(textareaId)
		insertTextAtCursor(textarea, smiley)
	})		
}



setText()
singleQuote()
loading()
insertSmilies()