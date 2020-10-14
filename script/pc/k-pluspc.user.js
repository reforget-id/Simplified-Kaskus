// ==UserScript==
// @name          Kaskus : Plus Smilies for PC
// @version       1.0.3
// @namespace     k-pluspc
// @author        ffsuperteam
// @icon          https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Gunakan smilies kaskus plus tanpa perlu kaskus plus
// @include       https://www.kaskus.co.id/thread/*
// @include       https://www.kaskus.co.id/post/*
// @include       https://www.kaskus.co.id/show_post/*
// @include       https://www.kaskus.co.id/lastpost/*
// @include       https://www.kaskus.co.id/post_reply/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-pluspc.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-pluspc.user.js
// @run-at        document-idle
// ==/UserScript==


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

        let tabId = anchor.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        if (tabId == 'tab0') {
            let textarea = document.getElementById('reply-messsage')
            insertTextAtCursor(textarea, `[IMG]${anchor.getAttribute('src')}[/IMG]`)
        } else {
            return
        }
    })
}


function thread() {
    let url = window.location.pathname
    if (!url.match(/post_reply\//g)) {
        let smiliesBtn = document.getElementsByClassName('jsButtonSmilies')
        for (let i = 0; i < smiliesBtn.length; i++) {
            smiliesBtn[i].addEventListener("click", function check() {
                let tabMRU = document.getElementById('content-mru')
                if (typeof (tabMRU) == 'undefined' || tabMRU == null) {
                    setTimeout(check, 1000)
                } else {
                    let img = tabMRU.querySelectorAll('img.loadMRU')
                    for (let i = 0; i < img.length; i++) {
                        if (!img[i].hasAttribute('src')) {
                            let datasrc = img[i].getAttribute('data-src').match(/https.*\.gif/g)
                            img[i].setAttribute('src', datasrc)
                        }
                    }
                }

                let tab0 = document.getElementById('tab0')
                if (typeof (tab0) == 'undefined' || tab0 == null) {
                    setTimeout(check, 1000)
                } else {
                    tab0.lastElementChild.classList.remove('Fil(filterGrayscale)')
                    let fec = tab0.firstElementChild
                    if (fec.classList == 'D(f) Mb(10px) Bgc(c-white) Bdb(borderSolidGrey) P(10px)') {
                        fec.remove()

                        let img = tab0.querySelectorAll('img.loadSmilies')
                        for (let i = 0; i < img.length; i++) {
                            let src = img[i].getAttribute('src')
                            img[i].setAttribute('data-src', `[IMG]${src}[/IMG]`)
                        }
                    }
                }
            })
        }
    }
}


function postReply() {
    let url = window.location.pathname
    if (url.match(/(post_reply|edit_post)\//g)) {
        let tabMRU = document.getElementById('content-mru')
        if (typeof (tabMRU) == 'undefined' || tabMRU == null) {
            setTimeout(postReply, 1000)
        } else {
            setTimeout(() => {
                let mruimg = tabMRU.querySelectorAll('img[alt*="[IMG]"]')
                for (let i = 0; i < mruimg.length; i++) {
                    let alt = mruimg[i].getAttribute('alt').match(/https.*\.gif/g)
                    mruimg[i].setAttribute('src', alt)
                }

                document.getElementsByClassName('smiley-tab__featured')[0].remove()
                let tab0div = document.getElementById('tab0').querySelectorAll('div.smiley-tab__item--unavailable')
                for (let i = 0; i < tab0div.length; i++) {
                    tab0div[i].setAttribute('class', 'smiley-tab__item')
                }

            }, 2000)
        }
    }
}

thread()
postReply()
insertSmilies()