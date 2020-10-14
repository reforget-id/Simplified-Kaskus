// ==UserScript==
// @name          Kaskus : Insert Quote Button (Mobile)
// @version       2.7.5
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
// @include       https://m.kaskus.co.id/edit_post/*
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
`);


Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element)
}, false

function getElementsByIdStartsWith(selectorTag, prefix) {
    var items = [];
    var myPosts = document.getElementsByTagName(selectorTag)
    for (var i = 0; i < myPosts.length; i++) {
        if (myPosts[i].id.lastIndexOf(prefix, 0) === 0) {
            items.push(myPosts[i])
        }
    }
    return items
}

function getElementsByClassStartsWith(selectorTag, prefix) {
    var items = [];
    var myPosts = document.getElementsByClassName(selectorTag);
    for (var i = 0; i < myPosts.length; i++) {
        var next = myPosts[i].children[0]
        if ((myPosts[i].className == selectorTag) && (next.id.lastIndexOf(prefix, 0) === 0)) {
            items.push(next)
        }
    }
    return items
}


function insertTextAtCursor(el, textStart, textEnd) {
    var startIndex, endIndex, range
    var val = el.value
    var doc = el.ownerDocument

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        startIndex = el.selectionStart
        endIndex = el.selectionEnd
        el.value = val.slice(0, startIndex) + textStart + val.slice(startIndex, endIndex) + textEnd + val.slice(endIndex)
        el.selectionStart = el.selectionEnd = endIndex + textStart.length
        el.focus()
    } else if (doc.selection != "undefined" && doc.selection.createRange) {
        el.focus()
        range = doc.selection.createRange()
        range.collapse(false)
        range.text = textStart
        range.select()
    }
}


function singleQuote() {
    var list = document.getElementsByClassName("quote-btn")
    var listreply = document.getElementsByClassName("Cur(p) C(c-secondary) nightmode_C(c-secondary-night) reply-btn")
    var thread = document.getElementById("thread_id")
    var post = getElementsByIdStartsWith("div", "cendol")

    for (var i = 0; i < listreply.length; i++) {
        var NewElement = document.createElement('a')
        var threadid = thread.getAttribute("value")
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g);
        var click = "quote('" + threadid + "', '" + postid + "');return false;"

        NewElement.setAttribute("class", "sq-post D(f) Jc(fs) Ai(c) fas fa-comment Fz(20px)")
        NewElement.setAttribute("onclick", click)
        NewElement.id = "sq" + postid
        NewElement.href = "javascript:void(0);"
        NewElement.addEventListener("click", function (e) {
            var check = document.getElementById("openiframe")
            if (typeof (check) == 'undefined' || check == null) {
                var frame = document.createElement('iframe')
                frame.style.display = "none"
                frame.src = "/post_reply/" + threadid
                frame.setAttribute("id", "openiframe")
                frame.setAttribute("frameid", e.target.id)
                document.body.appendChild(frame)
                getIframe()
            }
        });

        if (document.URL.match(/^.*\/show_post\/*./g)) {
            NewElement.appendBefore(listreply[i])
        } else {
            list[i].classList.add("mq-post")
            NewElement.appendBefore(list[i])
        }
    }
    console.log("berhasil single quote")
}


function nestedSingleQuote() {
    var list = document.getElementsByClassName("C(#b3b3b3) reply-btn")
    var thread = document.getElementById("thread_id")
    var post = getElementsByClassStartsWith("D(f) Jc(fs) Ai(c) c-reputation Mend(20px)", "cendol")

    for (var i = 0; i < list.length; i++) {
        var NewElement = document.createElement('a')
        var threadid = thread.getAttribute("value")
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g)
        var click = "quote('" + threadid + "', '" + postid + "');return false;"

        NewElement.setAttribute("class", "sq-nested D(f) Jc(fs) Ai(c) fas fa-comment")
        NewElement.appendBefore(list[i])
        NewElement.setAttribute("onclick", click)
        NewElement.id = "nsq" + postid
        NewElement.href = "javascript:void(0);"
        NewElement.addEventListener("click", function (e) {
            var check = document.getElementById("openiframe")
            if (typeof (check) == 'undefined' || check == null) {
                var frame = document.createElement('iframe')
                frame.style.display = "none"
                frame.src = "/post_reply/" + threadid
                frame.setAttribute("id", "openiframe")
                frame.setAttribute("frameid", e.target.id)
                document.body.appendChild(frame)
                getIframe()
            }
        })
    }
    console.log("berhasil nested single quote")
    setTimeout(nestedMultiQuote, 100)
}


function nestedMultiQuote() {
    var list = document.getElementsByClassName("C(#b3b3b3) reply-btn")
    var thread = document.getElementById("thread_id")
    var post = getElementsByClassStartsWith("D(f) Jc(fs) Ai(c) c-reputation Mend(20px)", "cendol")

    for (var i = 0; i < list.length; i++) {
        var NewElement1 = document.createElement('div')
        var postid = post[i].getAttribute("id").match(/[^cendol].*/g)
        var click = "return false;"

        list[i].classList.add("reply-nested")
        list[i].firstElementChild.classList.add("reply-size")
        NewElement1.setAttribute("class", "mq-nested quote-btn D(f) Jc(fs) Ai(c) Cur(p) Bdrs(8px) fas fa-comments")
        NewElement1.setAttribute("onclick", click)
        NewElement1.setAttribute("data-postid", postid)
        NewElement1.id = "mq_" + postid
        NewElement1.appendBefore(list[i])
        NewElement1.addEventListener("click", function (e) {
            e.target.classList.toggle("mq-color")
        })
    }
    console.log("berhasil multi quote")
    setTimeout(focus, 700)
    setTimeout(replyTools, 1000)
}


function nestedProperty() {
    var item = []
    var nest = document.getElementsByClassName("jsNestedItem statusFetchData")
    for (var j = 0; j < nest.length; j++) {
        item.push(nest[j].style.display)
        console.log(item[j])
    }

    if (item.includes("")) {
        console.log("gagal")
        setTimeout(nestedProperty, 300)
    } else {
        var elem1 = document.getElementsByClassName("Py(16px) Bdt(borderSolidGray2) nightmode_Bdt(borderSolidGray6) ")
        var elem2 = document.getElementsByClassName("D(f) Jc(sb) Ai(c) W(100%) Pstart(36px) Pt(8px) Fz(12px) C(c-normal) nightmode_C(c-normal)")
        var elem3 = document.getElementsByClassName("D(f) Pos(r) Mb(10px)")

        for (var i = 0; i < elem1.length; i++) {
            if (elem1[i].className === 'Py(16px) Bdt(borderSolidGray2) nightmode_Bdt(borderSolidGray6) ') {
                elem1[i].classList.add("padbottom")
            }
            if (elem2[i].className === 'D(f) Jc(sb) Ai(c) W(100%) Pstart(36px) Pt(8px) Fz(12px) C(c-normal) nightmode_C(c-normal)') {
                elem2[i].classList.add("Bdt(borderSolidGray2)", "nightmode_Bdt(borderSolidGray6)", "padtop")
            }
            if (elem3[i].className === 'D(f) Pos(r) Mb(10px)') {
                elem3[i].classList.add("minheight")
            }
        }
        console.log("berhasil property")
        nestedSingleQuote()
    }
};


function removeMultiquote() {
    var selected = document.getElementsByClassName("quote-btn")
    for (var i = 0; i < selected.length; i++) {
        var style = getComputedStyle(selected[i])
        var backgroundColor = style.backgroundColor
        if (backgroundColor == "rgb(253, 186, 77)") {
            selected[i].click()
            console.log("multi quote dihapus")
        }
    }
};


function getIframe() {
    document.body.style.opacity = "0.5"
    var frame = document.getElementById("openiframe")
    var link = frame.src
    var elem = frame.contentWindow.document.getElementById("jsCreateThread")
    var btnid = frame.getAttribute("frameid")
    if (typeof (elem) == 'undefined' || elem == null) {
        console.log("element kosong")
        setTimeout(getIframe, 200)
    } else {
        var val = elem.value
        GM_setValue("quote", val)
        console.log(GM_getValue("quote"))
        removeMultiquote()
        document.getElementById(btnid).click()
        console.log("single quote dihapus")
        window.location.href = link + "/"
    }
}


function setText() {
    if (window.location.href.match(/^.*post_reply.*\/$/g)) {
        console.log(GM_getValue("quote"))
        document.getElementById("jsCreateThread").value = GM_getValue("quote")
        //GM_deleteValue("quote");
    }

};


function loading() {
    var item = []
    var balas = document.getElementsByClassName("jsShowNestedTrigger")
    for (var i = 0; i < balas.length; i++) {
        if (balas[i].classList.contains("getNestedAD")) {
            balas[i].click()
            console.log("klik " + i)
        }
    }
    for (var j = 0; j < balas.length; j++) {
        item.push(balas[j].className)
        console.log(item[j])
    }
    if (item.includes("Fx(flex0Auto) jsShowNestedTrigger getNestedAD")) {
        console.log("gagal")
        setTimeout(loading, 500)
    } else {
        console.log("berhasil loading")
        nestedProperty()
    }
};


function focus() {
    var url = window.location.href
    if (url.match(/.*\/(lastpost|post)\/.*/)) {
        var post = url.match(/(?!#post)\w{24}$/)
        var postid = "postcontent" + post
        var element = document.getElementById(postid)
        var headerOffset = 85
        var bodyRect = document.body.getBoundingClientRect().top
        var elementRect = element.getBoundingClientRect().top
        var elementPosition = elementRect - bodyRect
        var offsetPosition = elementPosition - headerOffset

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        })
        console.log("focus berhasil")
    }
}


function replyTools() {
    let position = document.getElementsByClassName('Ta(end) Mt(5px)')
    let textarea = document.querySelectorAll('textarea[id^="jsReplyTextArea_"]')

    for (let i = 0; i < position.length; i++) {
        //textarea[i].setAttribute('id', `textarea${i}`)
        let NE0 = document.createElement('div')
        let textareaId = textarea[i].getAttribute('id')
        textarea[i].classList.add('replybox')
        position[i].prepend(NE0)
        NE0.setAttribute("class", "Fx(flexOne) D(f) Ai(c) mr-divtools")
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
			<button type="button" class="btncolor urlbtn">
				<i class="far fa-fw fa-link"></i>
			</button>
			<button type="button" class="btncolor imgurlbtn">
				<i class="far fa-fw fa-image"></i>
			</button>
			<button type="button" class="btncolor spoilerbtn">
				<i class="far fa-fw fa-comment-dots"></i>
			</button>
`

        let boldbtn = document.getElementsByClassName('boldbtn')
        boldbtn[i].addEventListener("click", () => {
            insertTextAtCursor(textarea[i], `[B]`, ` [/B]`)
        })

        let italicbtn = document.getElementsByClassName('italicbtn')
        italicbtn[i].addEventListener("click", () => {
            insertTextAtCursor(textarea[i], `[I]`, ` [/I]`)
        })

        let ulbtn = document.getElementsByClassName('ulbtn')
        ulbtn[i].addEventListener("click", () => {
            insertTextAtCursor(textarea[i], `[U]`, ` [/U]`)
        })

        let cbtn = document.getElementsByClassName('centerbtn')
        cbtn[i].addEventListener("click", () => {
            insertTextAtCursor(textarea[i], `[CENTER]`, ` [/CENTER]`)
        })

        let urlbtn = document.getElementsByClassName('urlbtn')
        urlbtn[i].addEventListener("click", () => {
            let url = prompt("URL :")
            if (!(url == null || url == '')) {
                let teks = prompt("Teks yang ditampilkan :")
                if (!(teks == null || teks == '')) {
                    insertTextAtCursor(textarea[i], `[URL="${url}"]${teks}[/URL] `, '')
                }
            }
        })

        let imgurlbtn = document.getElementsByClassName('imgurlbtn')
        imgurlbtn[i].addEventListener("click", () => {
            let url = prompt("Image URL :")
            if (!(url == null || url == '')) {
                insertTextAtCursor(textarea[i], `[IMG]${url}[/IMG] `, '')
            }
        })

        let spoilerbtn = document.getElementsByClassName('spoilerbtn')
        spoilerbtn[i].addEventListener("click", function (e) {
            let judul = prompt("Judul Spoiler :")
            if (!(judul == null || judul == '')) {
                insertTextAtCursor(textarea[i], `[SPOILER=${judul}]
`, `
[/SPOILER]`)
            }
        })


    }
}


function postReplyTools() {
    let url = window.location.pathname
    if (url.match(/(post_reply|edit_post)\//g)) {
        let container = document.getElementsByClassName('markItUpHeader')[0].firstElementChild
        let NE0 = document.createElement('div')
        let NE1 = document.createElement('div')
        NE0.setAttribute('style', 'display: flex')
        NE1.setAttribute('style', 'display: flex')
        let textarea = document.getElementById('jsCreateThread')
        container.insertBefore(NE1, container.children[5])
        container.insertBefore(NE0, container.children[4])
        NE0.innerHTML = `
						<li class="markItUpButton centerbtn"> 
						<a href="javascript:void(0);" title="Center"> 
						<i class="fas fa-align-center"> </i> </a> </li>
						<li class="W(1px) H(20px) Bgc(c-grey) Mx(5px)"></li> `

        NE1.innerHTML = `
						<li class="markItUpButton spoilerbtn"> 
						<a href="javascript:void(0);" title="Spoiler"> 
						<i class="fas fa-comment-dots"> </i> </a> </li> `

        let cbtn = document.getElementsByClassName('centerbtn')[0]
        cbtn.addEventListener("click", () => {
            insertTextAtCursor(textarea, `[CENTER]`, ` [/CENTER]`)
        })

        let spoilerbtn = document.getElementsByClassName('spoilerbtn')[0]
        spoilerbtn.addEventListener("click", function (e) {
            let judul = prompt("Judul Spoiler :")
            if (!(judul == null || judul == '')) {
                insertTextAtCursor(textarea, `[SPOILER=${judul}]
`, `
[/SPOILER]`)
            }
        })

    }
}

setText()
singleQuote()
loading()
postReplyTools()
