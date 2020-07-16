// ==UserScript==
// @name          Kaskus : Plus Smilies 
// @version       1.0.0
// @namespace     k-plus
// @author        ffsuperteam
// @icon          https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Gunakan smilies kaskus plus tanpa perlu kaskus plus
// @include       https://m.kaskus.co.id/thread/*
// @include       https://m.kaskus.co.id/post/*
// @include       https://m.kaskus.co.id/show_post/*
// @include       https://m.kaskus.co.id/lastpost/*
// @include       https://m.kaskus.co.id/post_reply/*
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-plus.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-plus.user.js
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

        let tabId = anchor.parentNode.parentNode.parentNode.getAttribute('id')
        if (tabId == 'tab0') {
            let textarea = document.getElementById('jsReplyTextArea')
            insertTextAtCursor(textarea, `[IMG]${anchor.getAttribute('src')}[/IMG]`)
        } else {
            return
        }
    })
}


function thread() {
    let url = window.location.pathname
    if (!url.match(/post_reply\//g)) {
        let smilebtn = document.getElementById('smilies-btn')
        smilebtn.addEventListener("click", function check() {
            let tab0 = document.getElementById('tab0')
            if (typeof (tab0) == 'undefined' || tab0 == null) {
                setTimeout(check, 1000)
            } else {
                tab0.lastElementChild.classList.remove('is-disabled_Grayscale(1)')
                let fec = tab0.firstElementChild
                if (fec.classList == 'Mt(10px)') {
                    fec.remove()
                }
            }
        })
    }
}


function postReply() {
    let url = window.location.pathname
    if (url.match(/post_reply\//g)) {
        let tabMRU = document.querySelector('div[data-id="content-mru"]')
        if (typeof (tabMRU) == 'undefined' || tabMRU == null) {
            setTimeout(postReply, 1000)
        } else {
            setTimeout(() => {
                let mruimg = tabMRU.querySelectorAll('img[alt*="[IMG]"]')
                for (let i = 0; i < mruimg.length; i++) {
                    let alt = mruimg[i].getAttribute('alt').match(/https.*\.gif/g)
                    mruimg[i].setAttribute('src', alt)
					mruimg[i].parentNode.parentNode.setAttribute('style', 'height: min-content')
                }
				
				let tab0 = document.querySelector('div[data-id="1"]')
				if (typeof (tab0) == 'undefined' || tab0 == null) {
					setTimeout(check, 1000)
				} 
				else {
					tab0.classList.remove('is-disabled')
					let fec = tab0.firstElementChild
					if (fec.classList == 'D(f) Mb(10px) Ai(fs) Jc(sb)') {
						fec.remove()
					}

					let img = tab0.querySelectorAll('img.disable-smiley')
					for (let i = 0; i < img.length; i++) {
						let src = img[i].getAttribute('src')
						img[i].classList.remove('disable-smiley')
						img[i].setAttribute('alt', `[IMG]${src}[/IMG]`)
                	}
				}
            }, 2000)
        }
    }
}

thread()
postReply()
insertSmilies()