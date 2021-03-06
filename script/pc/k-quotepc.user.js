// ==UserScript==
// @name            Kaskus : Insert Quote Button (PC)
// @version         3.1.0
// @namespace       k-quotepc
// @author          ffsuperteam
// @icon            https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage        https://github.com/reforget-id/Simplified-Kaskus
// @description     Tambah tombol quote di nested reply di PC
// @match           https://www.kaskus.co.id/thread/*
// @match           https://www.kaskus.co.id/post/*
// @match           https://www.kaskus.co.id/lastpost/*
// @include         https://www.kaskus.co.id/post_reply/*/
// @downloadURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-quotepc.user.js
// @updateURL       https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/pc/k-quotepc.user.js
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// ==/UserScript==


GM_addStyle(`
.single-quote {
    padding-right: 3px !important;
    font-size: 15px !important;
}
.nested-height {
    min-height: 50px !important;
    padding-bottom: 20px !important;
    padding-top: 10px !important;
}
.nested-top {
    padding-bottom: 12px !important;
    padding-top: 4px !important;
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
    margin-left: 32px;
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
.nested-container {
    max-height: 80vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}
.nested-toogle {
    position: sticky;
    top: 0;
    z-index: 1;
}
.nested-reply {
    position: sticky; 
    bottom: 0; 
    z-index: 1;
}
.sticky-button {
    position: sticky;
    bottom: 10vh;
    height: 0px;
    margin-right: -19%;
    z-index: 1;
}
.shadow-box {
    box-shadow: 0px 1px 35px #404040;
}
`);

'use strict';

/******************************************************************************/

(() => {

    /******************************************************************************/
    /******************************************************************************/

    // Adds Element BEFORE NeighborElement 
    Element.prototype.appendBefore = function (element) {
        element.parentNode.insertBefore(this, element)
    }, false

    // Adds Element AFTER NeighborElement 
    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling)
    }, false

    function getElementsByIdStartsWith(selectorTag, prefix) {
        let items = []
        let myPosts = document.getElementsByTagName(selectorTag)
        for (let i = 0; i < myPosts.length; i++) {
            if (myPosts[i].id.startsWith(prefix)) {
                items.push(myPosts[i])
            }
        }
        return items
    }

    function insertTextAtCursor(el, text) {
        var val = el.value,
            endIndex, range, doc = el.ownerDocument;
        if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
            endIndex = el.selectionEnd
            el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
            el.selectionStart = el.selectionEnd = endIndex + text.length;
            el.focus()
        } else if (doc.selection !== undefined && doc.selection.createRange) {
            el.focus()
            range = doc.selection.createRange();
            range.collapse(false)
            range.text = text
            range.select()
        }
    }

    /******************************************************************************/
    /******************************************************************************/

    // DEFAULT SETTINGS
    const maxReplyDefault = 10
    const nestedCommentStyleDefault = 'scroll'

    // USER SETTINGS
    let maxReply = GM_getValue('maxReply', null)
    let nestedCommentStyle = GM_getValue('nestedCommentStyle', null)

    // CONSTANTS
    const posts = getElementsByIdStartsWith('div', 'post')
    const url = window.location.href
    const log = '[Kaskus Quote]'
    let threadId

    /******************************************************************************/

    if (maxReply == null) {
        GM_setValue('maxReply', maxReplyDefault)
        maxReply = GM_getValue('maxReply')
    }

    if (nestedCommentStyle == null || (nestedCommentStyle !== 'expand' && nestedCommentStyle !== 'scroll')) {
        GM_setValue('nestedCommentStyle', nestedCommentStyleDefault)
        nestedCommentStyle = GM_getValue('nestedCommentStyle')
    }
    console.log(log, 'maxReply = ' + maxReply)
    console.log(log, 'nestedCommentStyle = ' + nestedCommentStyle)

    /******************************************************************************/
    /*************************** FUNCTION CONTROLLER ******************************/
    /******************************************************************************/

    if (url.match(/\/post_reply\/\w{24}\/$/)) {
        setQuotedText()
    } else {
        threadId = document.getElementById('thread_id').value
        setTimeout(replaceTextKutip, 10)
        setTimeout(createSingleQuote(posts), 10)
        setTimeout(removeModeratedPosts, 20)
    }

    /******************************************************************************/

    function removeModeratedPosts() {
        const moderatedPost = getElementsByIdStartsWith('div', 'moderated-')

        if (moderatedPost.length > 0) {
            for (let i = 0; i < moderatedPost.length; i++) {
                moderatedPost[i].remove()
            }
            console.log(log, 'Removing moderated-post')
        }
        nestedCommentsHandler()
    }

    /******************************************************************************/

    function nestedCommentsHandler() {
        const nestedWrapper = document.getElementsByClassName('nestedWrapper')
        const emptyArray = []
        const dummyElement = null

        if (nestedWrapper.length === 0) {
            setTimeout(stickyPostButton, 500)
            return
        }

        if (nestedCommentStyle === 'scroll') {
            setTimeout(nestedWrapperProperties(nestedWrapper), 20)
        }

        if (maxReply > 0) {
            setTimeout(openNestedComments(posts), 50)
        } else {
            setTimeout(nestedCommentsObserver(emptyArray, dummyElement), 50)
        }

        setTimeout(replyTools, 2000)
        setTimeout(stickyPostButton, 1500)
    }

    /******************************************************************************/

    function replaceTextKutip() {
        const kutip = document.getElementsByTagName('span')
        for (let i = 0; i < kutip.length; i++) {
            if (kutip[i].innerHTML === 'Kutip') {
                kutip[i].innerHTML = 'Multi Quote'
            }
        }
        console.log(log, 'Successfully replaced "Kutip" to be "Multi Quote"')
    }

    /******************************************************************************/

    function createSingleQuote(posts) {
        for (let i = 0; i < posts.length; i++) {
            let replyButton = posts[i].getElementsByClassName('D(ib) Td(n):h Fz(16px) jsButtonReply buttonReply')[0]

            if (replyButton && replyButton.className === 'D(ib) Td(n):h Fz(16px) jsButtonReply buttonReply') {
                let parentNode = replyButton.parentNode
                let singleQuoteBtn = document.createElement('a')
                let postId = posts[i].id.match(/(?<=^post).+/)
                let click = `quote('${threadId}', '${postId}');return false;`

                singleQuoteBtn.href = 'javascript:void(0);'
                singleQuoteBtn.setAttribute('onclick', click)
                singleQuoteBtn.setAttribute('class', 'D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) buttonMultiquote')
                singleQuoteBtn.innerHTML = ` 
                    <i class="single-quote fas C(c-secondary) fa-comment Mend(2px)"></i>
                    <span class="C(c-secondary) Fz(12px)">Single Quote</span>
                `
                parentNode.prepend(singleQuoteBtn)
                singleQuoteBtn.addEventListener('click', createXhr)
            }
        }
        console.log(log, 'Successfully created Single Quote Button!')
    }

    /******************************************************************************/

    function createNestedQuote(post) {
        for (var i = 0; i < post.length; i++) {
            let replyButton = post[i].getElementsByClassName('jsButtonReply buttonReply')[0]

            if (replyButton && replyButton.className === 'jsButtonReply buttonReply') {
                let parentNode = replyButton.parentNode
                let singleQuoteBtn = document.createElement('a')
                let multiQuoteBtn = document.createElement('a')
                let postId = post[i].id.match(/(?<=^post).+/)
                let click = `quote('${threadId}', '${postId}');return false;`

                singleQuoteBtn.href = 'javascript:void(0);'
                singleQuoteBtn.setAttribute('onclick', click)
                singleQuoteBtn.setAttribute('class', 'D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) buttonMultiquote')
                singleQuoteBtn.innerHTML = ` 
                    <i class="single-quote fas C(c-secondary) fa-comment Mend(2px)" ></i>
                    <span class="C(c-secondary) Fz(12px)">Single Quote</span></a>
                `

                multiQuoteBtn.href = 'javascript:void(0);'
                multiQuoteBtn.setAttribute('onclick', click)
                multiQuoteBtn.setAttribute("class", "D(ib) Td(n):h Fz(16px) Mend(15px) Px(8px) Py(3px) Bdrs(8px) jsButtonMultiquote buttonMultiquote")
                multiQuoteBtn.innerHTML = `
                    <i class="single-quote fas C(c-secondary) fa-comments Mend(2px)"></i>
                    <span class="C(c-secondary) Fz(12px)">Multi Quote</span>
                `

                parentNode.prepend(singleQuoteBtn, multiQuoteBtn)
                singleQuoteBtn.addEventListener('click', createXhr)

            } else if (!replyButton) {
                post[i].remove()
                console.log(log, 'Removing invalid post in nested comments')
            }
        }
        console.log(log, 'Successfully created Single & Multi Quote Button in nested comments!')
    }

    /******************************************************************************/

    function openNestedComments(posts) {
        const postUrl = url.match(/\/(last|)post\/\w{24}.*#post\w{24}/)
        const nestedUrl = url.match(/\/post\/\w{24}\/\?child_id=post\w{24}$/)
        const totalNested = []
        const priorityNested = []
        let filteredElements = []
        let checkHelper = true
        let postId, childId, postElement

        if (postUrl) {
            postId = url.match(/(?<=#)post\w{24}/)
            postElement = document.getElementById(postId)
        } else if (nestedUrl) {
            try {
                postId = 'post' + url.match(/(?<=\/post\/)\w{24}/)
                childId = url.match(/(?<=child_id=)post\w{24}$/)
                postElement = document.getElementById(postId)
                postElement.getElementsByClassName('jsShowNestedTrigger')[0]
                    .setAttribute('priority', 'high')

                specificNestedCommentObserver(postElement, childId)
            } catch (e) {
                console.log(log, e)
            }
        }

        if (maxReply >= 20) {
            const nestedTrigger = document.getElementsByClassName('jsShowNestedTrigger')
            filteredElements = Array.from(nestedTrigger)

            if (postElement) {
                for (let i = 0; i < posts.length; i++) {
                    let trigger = posts[i].getElementsByClassName('jsShowNestedTrigger')[0]
                    if (posts[i].id == postId) {
                        break
                    } else if (trigger) {
                        priorityNested.push(totalNested.length)
                        totalNested.push(totalNested.length)
                    }
                }
            }
        } else {
            for (let i = 0; i < posts.length; i++) {
                let trigger = posts[i].getElementsByClassName('jsShowNestedTrigger')[0]
                if (posts[i].id == postId) {
                    checkHelper = false
                } 
                
                if (trigger) {
                    let replyCount = trigger.getAttribute('data-replycount')
                    let priority = trigger.getAttribute('priority') || ''

                    if (replyCount <= maxReply || priority === 'high') {
                        filteredElements.push(trigger)
                        if (postElement && checkHelper) {
                            priorityNested.push(totalNested.length)
                        }
                    }
                    totalNested.push(totalNested.length)
                }
            }
        }

        nestedCommentsObserver(priorityNested, postElement)
        if (filteredElements.length > 0) {
            setTimeout(clickIterator, 200)
        }

        function clickIterator() {
            for (let i = 0; i < filteredElements.length; i++) {
                if (filteredElements[i].classList.contains('getNestedAD')) {
                    filteredElements[i].click()
                } else {
                    filteredElements.splice(i, 1)
                    i--
                }
            }
            console.log(log, `Clicking (${filteredElements.length}) nested trigger `)

            if (filteredElements.length > 0) {
                setTimeout(clickIterator, 100)
            } else {
                console.log(log, 'All nested comments were open')
            }
        }
    }

    /******************************************************************************/

    function nestedCommentsObserver(priorityNested, postElement) {
        const targetNode = document.getElementsByClassName('jsNestedItemContent')
        const observers = []
        const filteredNested = []
        const config = {
            childList: true
        }

        for (let i = 0; i < targetNode.length; i++) {
            mutationObserverFactory(targetNode[i], i)
        }
        console.log(log, 'Register observer for nested comments')

        function mutationObserverFactory(target, i) {
            observers[i] = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target && [...mutation.addedNodes].length) {
                        let newPosts = []
                        let newNodes = [...mutation.addedNodes]
                        let moreNested = mutation.target.getElementsByClassName('moreNested')[0]

                        for (let j = 0; j < newNodes.length; j++) {
                            let postId = newNodes[j].id || ''

                            if (postId.startsWith('post')) {
                                newPosts.push(newNodes[j])
                            } else if (postId.startsWith('moderated-')) {
                                newNodes[j].remove()
                                console.log(log, 'Removing moderated-post in nested comments')
                            }
                        }

                        if (newPosts.length > 0) {
                            console.log(log, `(${newPosts.length}) post has been added in nested comments (${i}) !`);
                            setTimeout(nestedPostProperties(newPosts), 10)
                            setTimeout(createNestedQuote(newPosts), 20)
                        }

                        if (priorityNested.includes(i) && !filteredNested.includes(i)) {
                            filteredNested.push(i)
                        }

                        let totalPosts = mutation.target.getElementsByClassName('nestedbit')
                        if (!moreNested.innerHTML) {
                            observers[i].disconnect()
                            console.log(log, `Disconnect observer for nested comments (${i})`)

                            if (!totalPosts.length) {
                                mutation.target.parentNode.remove()
                                console.log(log, `Remove empty nested comments (${i})`)
                            }
                        }
                    }
                })
            })
            observers[i].observe(target, config)
        }

        if (priorityNested.length) {
            let checkPriorityNested = setInterval(() => {
                if (filteredNested.length == priorityNested.length) {
                    clearInterval(checkPriorityNested)
                    console.log(log, `Focus after nested comments ${filteredNested} are open`)
                    setTimeout(focusToPost(postElement), 60)
                }
            }, 100)
        }
    }

    /******************************************************************************/

    function specificNestedCommentObserver(parentElement, childId) {
        const itemContent = parentElement.getElementsByClassName('jsNestedItemContent')[0]
        const config = {
            childList: true
        }

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let childElement = mutation.target.getElementsByClassName(childId)[0]
                let moreNested = mutation.target.getElementsByClassName('moreNested')[0]

                if (!childElement && moreNested.innerHTML) {
                    moreNested.click()
                } else {
                    if (childElement) {
                        console.log(log, `Child Post is found in ${parentElement.id}`)
                    } else if (!moreNested.innerHTML) {
                        console.log(log, `Child Post is not found in ${parentElement.id}`)
                    }
                    observer.disconnect()
                    console.log(log, `Disconnect observer for nestedItemContent in ${parentElement.id}`)
                }

                /*
                if (childElement) {
                    childElement.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth'
                    })
                    console.log(log, 'Focusing to nested comment ' + childId[0])
                    observer.disconnect()

                } else if (!childElement && moreNested.innerHTML) {
                    moreNested.click()
                }
                */
            })
        })

        observer.observe(itemContent, config)
        console.log(log, `Observing nestedItemContent in ${parentElement.id} for focusing business`)
    }

    /******************************************************************************/

    function nestedWrapperProperties(nestedWrapper) {
        for (let i = 0; i < nestedWrapper.length; i++) {
            let simpleReply = nestedWrapper[i].getElementsByClassName('simple-reply')[0]
            let smallReply = nestedWrapper[i].getElementsByClassName('small-reply')[0]

            nestedWrapper[i].classList.add('nested-container')
            nestedWrapper[i].firstElementChild.classList.add('nested-toogle', 'Bgc(#f9f9f9)')
            smallReply.classList.add('nested-reply')
            simpleReply.classList.add('nested-reply', 'Bgc(#f9f9f9)')
            simpleReply.addEventListener('click', function sibling() {
                let formReply = simpleReply.nextElementSibling
                if (formReply && formReply.classList.contains('form-reply-message')) {
                    formReply.classList.add('Px(20px)', 'Mx(-16px)', 'Bgc(#f9f9f9)')
                    let parent = nestedWrapper[i].parentNode
                    let fragment = document.createDocumentFragment()
                    fragment.appendChild(formReply)
                    parent.appendChild(fragment)
                } else {
                    setTimeout(sibling, 100)
                }
            })
        }
        console.log(log, 'Success set nested wrapper properties')
    }

    /******************************************************************************/

    function nestedPostProperties(posts) {
        for (let i = 0; i < posts.length; i++) {
            let pageText = posts[i].getElementsByClassName('C(c-primary) Fz(14px) pagetext')[0]

            if (pageText && pageText.className === 'C(c-primary) Fz(14px) pagetext') {
                pageText.classList.add('nested-height', 'Bdb(borderSolidLightGrey)')
                pageText.previousElementSibling.classList.add('nested-top', 'Bdb(borderSolidLightGrey)')
            }
        }
        console.log(log, 'Success set nested post properties')
    }

    /******************************************************************************/

    function createXhr() {
        const openUrl = 'https://www.kaskus.co.id/post_reply/' + threadId

        document.body.style.opacity = '0.6'
        console.log(log, 'Creating XHR request')

        function clearQuoteCookie() {
            document.cookie = `kaskus_multiquote_${threadId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: openUrl,
            overrideMimeType: 'text/html; charset=UTF-8',
            responseType: 'document',
            binary: false,
            timeout: 0,
            withCredentials: true,
            onerror: function () {
                clearQuoteCookie()
                alert('Tidak bisa terhubung dengan server. Cek koneksi anda')
                console.log(log, 'Failed to create XHR request')
            },
            onload: function (res) {
                let quotedText = res.response.getElementById('reply-messsage').value

                if (quotedText) {
                    GM_setValue('quotedText', quotedText)
                    console.log(log, 'Success get quoted text from XHR')
                    console.log(log, quotedText)
                    clearQuoteCookie()
                    window.location.href = openUrl + '/'
                } else {
                    alert('Ada sesuatu yang salah. Coba reload halaman')
                    console.log(log, 'Failed to get quote text XHR')
                    clearQuoteCookie()
                }
            }
        })
    }

    /******************************************************************************/

    function setQuotedText() {
        let quotedText = GM_getValue('quotedText')
        console.log(log, 'Set text to reply message textarea')
        console.log(log, quotedText)
        document.getElementById('reply-messsage').value = quotedText
        //GM_deleteValue('quotedText')
    }

    /******************************************************************************/

    function focusToPost(postElement) {
        const headerOffset = 60
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = postElement.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        })

        console.log(log, 'Focusing to the ' + postElement.id)
    }

    /******************************************************************************/

    function stickyPostButton() {
        const container = document.getElementsByClassName('post-reply-button')[0]
        const postReplyBtn = document.getElementsByClassName('jsButtonPostReply')[0]
        const config = {
            childList: true,
            characterData: true
        }

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let text = mutation.target.innerHTML.match(/^Kutip ([2-9]|\d{2}) Post$/)
                let classList = container.classList.contains('sticky-button')

                if (text && !classList) {
                    mutation.target.classList.add('shadow-box')
                    container.classList.add('sticky-button')
                } else if (!text && classList) {
                    container.classList.remove('sticky-button')
                    mutation.target.classList.remove('shadow-box')
                }
            })
        })

        observer.observe(postReplyBtn, config)
        console.log(log, 'Observe Post Button')
    }

    /******************************************************************************/

    function replyTools() {
        let position = document.getElementsByClassName('small-reply')
        let textarea = getElementsByIdStartsWith('textarea', 'qr-message-')

        for (let i = 0; i < position.length; i++) {
            let replyBox = document.createElement('div')
            let textareaId = textarea[i].id
            let click = (x) => `insertBBCode('[${x}]','[/${x}]','#${textareaId}');return false;`
            let classAtt = `C(c-grey) C(c-normal):h toolbox`

            textarea[i].classList.add('replybox')
            position[i].appendChild(replyBox)
            replyBox.setAttribute('class', 'Fx(flexOne) D(f) Ai(c) mr-divtools')
            replyBox.id = 'divtools'

            replyBox.innerHTML = `
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

            let urlBtn = document.getElementsByClassName('urlbtn')
            urlBtn[i].addEventListener('click', () => {
                let url = prompt('URL : ')
                if (url) {
                    let teks = prompt('Teks yang ditampilkan : ')
                    if (teks) {
                        insertTextAtCursor(textarea[i], `[URL="${url}"]${teks}[/URL]`)
                    }
                }
            })

            let imgurlBtn = document.getElementsByClassName('imgurlbtn')
            imgurlBtn[i].addEventListener('click', () => {
                let url = prompt('Image URL : ')
                if (url) {
                    insertTextAtCursor(textarea[i], `[IMG]${url}[/IMG]`)
                }
            })

            let spoilerbtn = document.getElementsByClassName('spoilerbtn')
            spoilerbtn[i].addEventListener('click', () => {
                let judul = prompt('Judul Spoiler : ')
                if (judul) {
                    insertTextAtCursor(textarea[i], `[SPOILER=${judul}] 

[/SPOILER]`)
                }
            })
        }
        console.log(log, 'Successfully added Reply Tools')
    }

    /******************************************************************************/

})()

/******************************************************************************/