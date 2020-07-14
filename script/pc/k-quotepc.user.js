// ==UserScript==
// @name          Kaskus : Insert Quote Button for PC 
// @version       2.5.1
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

        NE0.innerHTML = `
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
            <button type="button" class="${classAtt} smiliesbtn">
            	<i class="far fa-fw fa-smile tooltip">
					<span class="tooltiptext">Insert Smiley</span>
				</i>
            </button>
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
		
		let smiliesbtn = document.getElementsByClassName('smiliesbtn')
        smiliesbtn[i].addEventListener("click", function (e) {
			let smiliesBox = document.getElementById('smiliesBox')
			if (!(typeof (smiliesBox) == 'undefined' || smiliesBox == null)){
				smiliesBox.remove()
				this.removeAttribute('style')
			}
			else{
				this.setAttribute('style', 'color: rgb(25, 152, 237)')
				let smilediv = document.createElement('div')
				smilediv.setAttribute('id', 'smiliesBox')
				smilediv.setAttribute('class', 'Bd(borderSolidLightGrey) Bxsh(boxShadow)')
				smilediv.setAttribute('style', 'position: absolute;z-index: 999999')
				position[i].appendChild(smilediv)
				smilediv.innerHTML = ` 
<div class="D(f) Pos(r) Bgc(c-semiwhite) tabNav" id="smiliesBoxTabNavHead">
<div onclick="open_smiley_tab('#tab0',this,'Plus Exclusive');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaqurkkof.gif)" data-title="Plus Exclusive"></div>
</div>
<div onclick="open_smiley_tab('#tab1',this,'Smilies 3.0');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/march2017/smilie_group_fbohhwkox78o.gif)" data-title="Smilies 3.0"></div>
</div>
<div onclick="open_smiley_tab('#tab2',this,'Only in KASKUS');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p) is-active">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaqv1h9do.gif)" data-title="Only in KASKUS"></div>
</div>
<div onclick="open_smiley_tab('#tab3',this,'Only in KASKUS(small)');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaquwaje1.gif)" data-title="Only in KASKUS(small)"></div>
</div>
<div onclick="open_smiley_tab('#tab4',this,'Standart Smilies');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/february2016/smilie_group_fbekaqv2cprr.gif)" data-title="Standart Smilies"></div>
</div>
<div onclick="open_smiley_tab('#tab5',this,'RaisaxOPPO');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/december2016/smilie_group_fbfj6i47tv7j.gif)" data-title="RaisaxOPPO"></div>
</div>
<div onclick="open_smiley_tab('#tab6',this,'Sundul Dunia');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/july2018/smilie_group_fbyqecle0wyv.gif)" data-title="Sundul Dunia"></div>
</div>
<div onclick="open_smiley_tab('#tab7',this,'Giphy');return false" class="W(50px) H(40px) D(f) Ai(c) Jc(c) tabNavItem Cur(p)">
<div class="W(25px) H(20px) Bg(bgImageProps) tabNavIcon" style="background-image:url(https://s.kaskus.id/img/seasonal/june2018/smilie_group_fbynlhikkobq.png)" data-title="Giphy"></div>
</div>
</div>
<div class="Bgc(c-white)">
<div class="Ov(h)">
<div class="Pos(r) Whs(nw) Fz(0) tabContent" style="transform:translateX(0%)">
<div class="W(100%) D(ib) Va(t) Whs(n) H(180px) Ovy(a)" id="smiliesBoxTabContent" style="width:498px;height:180px">
<div class="D(n) tabcontent" style="display:none" id="tab0">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w) D(b) Bgc(c-lightgrey-2):h" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeo3cobwwnh.gif" title="welcome" data-src=":welcome">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeo3coe6ltn.gif" title="terimakasih" data-src=":terimakasih">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9n3iqj.gif" title="Tepuk Tangan" data-src=":tepuktangan">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbey5o7hwr1s.gif" title="Tepar" data-src=":tepar">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ognstk6ml.gif" title="sudahkuduga" data-src=":sudahkuduga">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9huzjo.gif" title="Siap Gan" data-src=":siapgan">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9cln0l.gif" title="Semangat" data-src=":semangat">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeo3cojogfl.gif" title="sale" data-src=":sale">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5i1ormrmng.gif" title="Pertamax" data-src=":pertamax">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ognt7s97w.gif" title="pencet" data-src=":pencet">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeo3coop1hn.gif" title="paket" data-src=":paket">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeo3cohriho.gif" title="nyantai" data-src=":nyantai">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntj5ay6.gif" title="nulisah" data-src=":nulisah">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li8hidgu.gif" title="Monggo" data-src=":monggo">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li8c2qu0.gif" title="Merdeka" data-src=":merdeka">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5i1oqzqzc2.gif" title="Kangen" data-src=":kangen">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5i1oqy98xv.gif" title="Jones" data-src=":jones">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5i1oqtmu9v.gif" title="Insomnia" data-src=":insomnia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeo3confsaw.gif" title="hargapas" data-src=":hargapas">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li9rpj03.gif" title="Goyang" data-src=":goyang">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li8a2db4.gif" title="Garuda di Dadaku" data-src=":garudadidadaku">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntmyt72.gif" title="gagalpaham" data-src=":gagalpaham">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntoc022.gif" title="gaasik" data-src=":gaasik">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntptuty.gif" title="dor" data-src=":dor">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogntt5wfk.gif" title="cih" data-src=":cih">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogktza4ll.gif" title="ceyem" data-src=":ceyem">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5i2wtqtpje.gif" title="Butuh Pacar" data-src=":butuhpacar">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5iakdq4cug.gif" title="Bokek" data-src=":bokek">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fby5xxz3p50r.gif" title="Belum Tidur" data-src=":belumtidur">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li80dvu9.gif" title="Batik" data-src=":batik">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li7ugrgl.gif" title="Bangga Pake Batik" data-src=":banggapakebatik">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbp6li76gyt8.gif" title="Ayo Indonesia" data-src=":ayoindonesia">
</a>
</li>
</ul>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab1">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbohhx46ijiq.gif" title="Ngamuk" data-src=":ngamuk">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbohhxbaeg1k.gif" title="Lempar Bata" data-src=":lemparbata">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbohhx488el3.gif" title="Keep Posting Gan" data-src=":keepposting">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbohhx4dkayo.gif" title="Hansip" data-src=":hansip">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbohhx40jqmd.gif" title="Cendol Gan" data-src=":cendolgan">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbohhx42ehj0.gif" title="Big Kiss" data-src=":bigkiss">
</a>
</li>
</ul>
</div>
</div>
<div class="D(n) tabcontent" style="display:block" id="tab2">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5p7bhjffzl.gif" title="Christmas" data-src=":xmas">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiimgq21.gif" title="Wow" data-src=":wow">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtykhbhj.gif" title="Wkwkwk" data-src=":wkwkwk">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiiief4q.gif" title="Wakaka" data-src=":wakaka">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyu0dd5rpa3.gif" title="Wagelaseh" data-src=":wagelaseh">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1zwmwkm.gif" title="Ultah" data-src=":ultahhore">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1i58kbq.gif" title="Ultah" data-src=":ultah">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/traveller.gif" title="Traveller" data-src=":travel">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1iothbu.gif" title="Toast" data-src=":toast">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz15dew4.gif" title="Om Telolet Om!" data-src=":telolet4">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz123tem.gif" title="Om Telolet Om!" data-src=":telolet3">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz113cdq.gif" title="Om Telolet Om!" data-src=":telolet2">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfjmz0z4sbg.gif" title="Om Telolet Om!" data-src=":telolet1">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1itttkb.gif" title="Takut" data-src=":takut">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pxsn75.gif" title="Sundul Up" data-src=":sup:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1iy2y34.gif" title="Sundul" data-src=":sup2">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xldg9p.gif" title="Sorry" data-src=":sorry">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeqyos6i5nk.gif" title="Shakehand2" data-src=":shakehand2">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtwaipmr.gif" title="Selamat" data-src=":selamat">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiiddd93.gif" title="Salam Kenal" data-src=":salamkenal">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/lebaran03.gif" title="Salaman" data-src=":salaman">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/salah_kamar.gif" title="Salah Kamar" data-src=":salahkamar">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pti017.gif" title="Request" data-src=":request">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtyqhwnh.gif" title="Repost" data-src=":repost:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_repost2.gif" title="Purple Repost" data-src=":repost2">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_repost1.gif" title="Blue Repost" data-src=":repost">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xidtbd.gif" title="Recommended Seller" data-src=":recsel">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvqnpxx.gif" title="Rate 5 Star" data-src=":rate5">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqlyagi7.gif" title="Peluk" data-src=":peluk">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfjmzk6nrxc.gif" title="Om Telolet Om!" data-src=":omtelolet">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fben9zk8izp8.gif" title="Nyepi" data-src=":nyepi">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zbaufk9.gif" title="No Sara Please" data-src=":nosara">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6ps8oqq.gif" title="No Hope" data-src=":nohope">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtyfyn16.gif" title="Ngakak" data-src=":ngakak">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/ngacir2.gif" title="Ngacir2" data-src=":ngacir2">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/ngacir3.gif" title="Ngacir" data-src=":ngacir">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/najis.gif" title="Najis" data-src=":najis">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogiicfbwj.gif" title="Motret" data-src=":motret">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtveegn8.gif" title="Mewek" data-src=":mewek">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvdpjkq.gif" title="Matabelo" data-src=":matabelo">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5l20l4pt7z.gif" title="#MAR16ERAK" data-src=":marigerak">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zb3lb65.gif" title="Marah" data-src=":marah">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvafv6q.gif" title="Malu" data-src=":malu">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/lebaran04.gif" title="Maaf Aganwati" data-src=":maafaganwati">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/lebaran01.gif" title="Maaf Agan" data-src=":maafagan">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fber17aocqul.gif" title="Leh Uga" data-src=":lehuga">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zbf7ivh.gif" title="Kemana TSnya?" data-src=":kts:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtvf8ymz.gif" title="Kaskus Radio" data-src=":kr">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqlwohnn.gif" title="Kiss" data-src=":kiss">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/kimpoi.gif" title="Kimpoi" data-src=":kimpoi">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/lebaran05.gif" title="Ketupat" data-src=":ketupat">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zay8rj5.gif" title="Kaskus Banget" data-src=":kbgt:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zb8qj68.gif" title="Thread Kacau" data-src=":kacau:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zavolvn.gif" title="Jangan ribut disini" data-src=":jrb:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqm927y2.gif" title="Imlek" data-src=":imlek2">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqm4l950.gif" title="Imlek" data-src=":imlek">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pmu1yk.gif" title="I Love Kaskus" data-src=":ilovekaskus">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xu2wka.gif" title="I Love Indonesia" data-src=":iloveindonesia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/hoax.gif" title="Hoax" data-src=":hoax">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/hotnews.gif" title="Hot News" data-src=":hn">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pkrrrw.gif" title="Hammer2" data-src=":hammer">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtxkkci6.gif" title="Hai" data-src=":hai">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1xc0hnl.gif" title="Games" data-src=":games">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ogii64nj7.gif" title="Entahlah" data-src=":entahlah">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeqyos193hf.gif" title="DP" data-src=":dp">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pg5o6d.gif" title="cystg" data-src=":cystg">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ohtw20w8z.gif" title="Cool" data-src=":cool">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6q3de6x.gif" title="Coblos" data-src=":coblos">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqmdvjfl.gif" title="Cipok" data-src=":cipok">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6pblpkt.gif" title="Blue Guy Cendol (L)" data-src=":cendolbig">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/cekpm.gif" title="Cek PM" data-src=":cekpm">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeqyortimyf.gif" title="Cape deeehh" data-src=":cd:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zaps8px.gif" title="Cape d..." data-src=":cd">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbf1wzm9bml4.gif" title="Gotta catch 'em all!" data-src=":catchemall:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/bola.gif" title="Bola" data-src=":bola">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ox6p94iii.gif" title="Bingung" data-src=":bingung">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeqyoryg2b4.gif" title="Bukan IGO" data-src=":bigo:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_maho.gif" title="Betty" data-src=":betty">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbeg2zalcx0i.gif" title="Turut Berduka" data-src=":berduka">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/lebaran02.gif" title="Bedug" data-src=":bedug">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqljqkd1.gif" title="Blue Guy Bata (L)" data-src=":batabig">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/babygirl.gif" title="Baby Girl" data-src=":babygirl">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/babyboy1.gif" title="Baby Boy 1" data-src=":babyboy1">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/babyboy.gif" title="Baby Boy" data-src=":babyboy">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejlbrhvlpt.gif" title="Angpau" data-src=":angpau">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbejiqle36zb.gif" title="Angel" data-src=":angel">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1x373yj.gif" title="2 Jempol" data-src=":2thumbup">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fb5ly1j43vv5.gif" title="Jempol" data-src=":1thumbup">
</a>
</li>
</ul>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab3">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_peace.gif" title="Blue Guy Peace" data-src=":Yb">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/takuts.gif" title="Takut (S)" data-src=":takuts">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sundulgans.gif" title="Sundul Gan (S)" data-src=":sundulgans">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/shutup-kecil.gif" title="Shutup (S)" data-src=":shutups">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/reposts.gif" title="Repost (S)" data-src=":reposts">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/ngakaks.gif" title="Ngakak (S)" data-src=":ngakaks">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/najiss.gif" title="Najis (S)" data-src=":najiss">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/malus.gif" title="Malu (S)" data-src=":malus">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/mads.gif" title="Mad (S)" data-src=":mads">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/kisss.gif" title="Kiss (S)" data-src=":kisss">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/iluvkaskuss.gif" title="I Love Kaskus (S)" data-src=":ilovekaskuss">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/iloveindonesias.gif" title="I Love Indonesia (S)" data-src=":iloveindonesias">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/hammers.gif" title="Hammer (S)" data-src=":hammers">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/cendols.gif" title="Cendol (S)" data-src=":cendols">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_cendol.gif" title="Blue Guy Cendol (S)" data-src=":cendolb">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/cekpms.gif" title="Cek PM (S)" data-src=":cekpms">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/capedes.gif" title="Cape d... (S)" data-src=":capedes">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/bookmark-kecil.gif" title="Bookmark (S)" data-src=":bookmarks">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/bingungs.gif" title="Bingung (S)" data-src=":bingungs">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/mahos.gif" title="Betty (S)" data-src=":bettys">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/berdukas.gif" title="Berduka (S)" data-src=":berdukas">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/berbusa-kecil.gif" title="Berbusa (S)" data-src=":berbusas">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/batas.gif" title="Bata (S)" data-src=":batas">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_batamerah.gif" title="Blue Guy Bata (S)" data-src=":bata">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/army-kecil.gif" title="Army (S)" data-src=":armys">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/add-friend-kecil.gif" title="Add Friend (S)" data-src=":addfriends">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/s_sm_smile.gif" title="Blue Guy Smile (S)" data-src=":)b">
</a>
</li>
</ul>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab4">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/13.gif" title="Wink" alt=";)" data-src=";)">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/001.gif" title="Wowcantik" data-src=":wowcantik">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/44.gif" title="televisi" data-src=":tv">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/47.gif" title="thumbsup" data-src=":thumbup">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/48.gif" title="thumbdown" data-src=":thumbdown">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/006.gif" title="Thinking" data-src=":think:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/shit-3.gif" title="Tai" data-src=":tai">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/tabrakan.gif" title="Ngacir Tubrukan" data-src=":tabrakan:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/39.gif" title="table" data-src=":table:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/008.gif" title="Matahari" data-src=":sun:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/020.gif" title="siul" data-src=":siul">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/5.gif" title="Shutup" data-src=":shutup:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/49.gif" title="shakehand" data-src=":shakehand">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/34.gif" title="rose" data-src=":rose:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/01.gif" title="Roll Eyes (Sarcastic)" data-src=":rolleyes">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/32.gif" title="ricebowl" data-src=":ricebowl:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/e02.gif" title="rainbow" data-src=":rainbow:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/60.gif" title="raining" data-src=":rain:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/40.gif" title="present" data-src=":present:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/41.gif" title="phone" data-src=":Phone:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/005.gif" title="Peace" data-src=":Peace:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/paw.gif" title="Paw" data-src=":Paws:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/6.gif" title="Stick Out Tongue" data-src=":p">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/rice.gif" title="Onigiri" data-src=":Onigiri">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/07.gif" title="Embarrassment" data-src=":o">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/35.gif" title="norose" data-src=":norose:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/q11.gif" title="Nohope" data-src=":nohope:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/ngacir.gif" title="Ngacir" data-src=":ngacir:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/007.gif" title="Moon" data-src=":moon:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/q17.gif" title="Metal" data-src=":metal">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/33.gif" title="medicine" data-src=":medicine:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/004.gif" title="Belo" data-src=":matabelo:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/1.gif" title="Malu" data-src=":malu:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/12.gif" title="Mad" data-src=":mad">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/26.gif" title="linux2" data-src=":linux2:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/25.gif" title="linux" data-src=":linux1:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/28.gif" title="kucing" data-src=":kucing:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/36.gif" title="kiss" data-src=":kissmouth">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/014.gif" title="kisssing" data-src=":kissing:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/smiley_couple.gif" title="Pasangan Smiley" data-src=":kimpoi:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/3.gif" title="Kagets" data-src=":kagets:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/hi.gif" title="Hi" data-src=":hi:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/37.gif" title="heart" data-src=":heart:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/8.gif" title="Hammer" data-src=":hammer:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/crazy.gif" title="Gila" data-src=":gila:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/q03.gif" title="Genit" data-src=":genit">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/fuck-4.gif" title="fuck" data-src=":fuck:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/fuck-8.gif" title="fuck3" data-src=":fuck3:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/fuck-6.gif" title="fuck2" data-src=":fuck2:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/frog.gif" title="frog" data-src=":frog:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smileyfm329wj.gif" title="Forum Music" data-src=":fm:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/e03.gif" title="flower" data-src=":flower:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/52.gif" title="exclamation" data-src=":exclamati">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/43.gif" title="mail" data-src=":email">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/4.gif" title="EEK!" data-src=":eek">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/18.gif" title="doctor" data-src=":doctor">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/14.gif" title="Big Grin" data-src=":D">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/05.gif" title="Cool" data-src=":cool:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/7.gif" title="Confused" data-src=":confused">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/31.gif" title="coffee" data-src=":coffee:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/42.gif" title="clock" data-src=":clock">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/kaskuslove.gif" title="Kaskus Lovers" data-src=":ck">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/woof.gif" title="Buldog" data-src=":buldog">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/38.gif" title="breakheart" data-src=":breakheart">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/bolakbalik.gif" title="Bingung" data-src=":bingung:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/vana-bum-vanaweb-dot-com.gif" title="Bikini" data-src=":bikini">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/q20.gif" title="Busa" data-src=":berbusa">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/smiley_beer.gif" title="Angkat Beer" data-src=":beer:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/30.gif" title="baby" data-src=":baby:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/27.gif" title="babi" data-src=":babi:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/24.gif" title="army" data-src=":army">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/29.gif" title="anjing" data-src=":anjing:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/017.gif" title="angel" data-src=":angel:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/amazed.gif" title="Amazed" data-src=":amazed:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/kribo.gif" title="afro" data-src=":afro:">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/15.gif" title="Smilie" data-src=":)">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/sumbangan/06.gif" title="Frown" data-src=":(">
</a>
</li>
</ul>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab5">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4cagtf.gif" title="tempted" data-src=":tempted">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4iwkvj.gif" title="surprised" data-src=":surprised">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4ngca1.gif" title="sad" data-src=":sad">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4dt90b.gif" title="excited" data-src=":excited">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbfj6i4jyfhe.gif" title="angry" data-src=":angry">
</a>
</li>
</ul>
</div>
</div>
<div class="D(n) tabcontent" style="display:none" id="tab6">
<div class="My(10px) D(f) Jc(fs) Fld(r) Flw(w)" textareaId="${textareaId}">
<ul class="D(f) Fxf(w)">
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynlheek6ga.gif" title="Xabi" data-src=":xabi">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyq989xe9up.gif" title="Uruguay" data-src=":uruguay">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyq989yzuz6.gif" title="Swiss" data-src=":swiss">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyqecl7mf6w.gif" title="Swedia" data-src=":swedia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynlisntew9.gif" title="Spanyol" data-src=":spanyol">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynlesypva6.gif" title="Rusia" data-src=":rusia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynlit69w53.gif" title="Perancis" data-src=":perancis">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynmssas0z0.gif" title="Menang" data-src=":menang">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyqgsbvszbw.gif" title="Kroasia" data-src=":kroasia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyq98a36rmz.gif" title="Kolombia" data-src=":kolombia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynmssfwlks.gif" title="Kalah" data-src=":kalah">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyqecl2b9vo.gif" title="Inggris" data-src=":inggris">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynmsshu1kd.gif" title="Gregetan" data-src=":gregetan">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbyqgsc06fmp.gif" title="Belgia" data-src=":belgia">
</a>
</li>
<li class="W(1/5) P(5px)">
<a href="#" onclick="return false">
<img class="Mx(a) D(b)" src="https://s.kaskus.id/images/smilies/smilies_fbynlit7ubyb.gif" title="Argentina" data-src=":argentina">
</a></li></ul></div></div>
<div class="D(n) tabcontent" style="display:none" id="tab7" textareaId="${textareaId}">
</div></div></div></div></div></div>
`
			}		 
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

	document.addEventListener("click", function(e){
		let anchor = getElement(e.target)
		if (!anchor || anchor.target || anchor.protocol == "javascript:" || e.isTrusted === false || !anchor.offsetParent || (e.isTrusted == null && !e.detail)) {
			return;
		}
		
		let textareaId = anchor.parentNode.parentNode.parentNode.parentNode.getAttribute('textareaId')
		let tabId = anchor.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
		if (textareaId == 'undefined' || textareaId == null) {
			return;
		}
		
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

setText();
singleQuote();
replaceKutip();
loading();
insertSmilies()