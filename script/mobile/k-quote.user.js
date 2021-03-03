// ==UserScript==
// @name            Kaskus : Insert Quote Button (Mobile Dev)
// @version         3.0.0
// @namespace       k-quote
// @author          ffsuperteam
// @icon            https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage        https://github.com/reforget-id/Simplified-Kaskus
// @description     Tambah tombol quote di nested reply
// @match           https://m.kaskus.co.id/thread/*
// @match           https://m.kaskus.co.id/post/*
// @match           https://m.kaskus.co.id/lastpost/*
// @include         https://m.kaskus.co.id/post_reply/*/
// @downloadURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/dev/script/mobile/k-quote.user.js
// @updateURL       https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/dev/script/mobile/k-quote.user.js
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// ==/UserScript==

GM_addStyle(`
.mq-color {
    background-color: var(--c-orange-night) !important;
    color: var(--c-white) !important;
    font-weight: 500;
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
.sticky-button {
    position: sticky;
    bottom: 13vh;
    padding: 0;
    z-index: 1;
}
.btn-container {
    height: 0;
    text-align: center;
}
.corner {
    border-radius: 20px;
    box-shadow: 0px 1px 35px #404040;
}
.wrapper-popup {
    position: fixed !important;
    bottom: 0px !important;
    z-index: 1 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    max-height: 89% !important;
    width: 100% !important;
    max-width: 620px !important;
}
.trigger-popup {
    position: sticky !important;
    top: -3px !important;
    z-index: 1 !important;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
}
.reply-popup {
    position: sticky !important;
    bottom: -8px !important;
    z-index: 1 !important;
    padding-bottom: 10px !important;
}
.Ovy-hidden {
    overflow-y: hidden !important;
}
.loading-screen {
    display: block;
    opacity: 0.3;
    background-color: #cccccc;
    z-index: 12;
    width: 100%;
    position: fixed;
    height: 100%;
    top: 0px;
    left: 0px;
}
.progressbar {
    border: 12px solid #f3f3f3;
    border-radius: 50%;
    border-top: 12px solid #555;
    width: 100px;
    height: 100px;
    animation: spin 2s linear infinite;
    position: relative;
    top: 50%;
    margin: auto;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`);


'use strict';

/******************************************************************************/

(() => {

    /******************************************************************************/
    /******************************************************************************/

    Element.prototype.appendBefore = function (element) {
        element.parentNode.insertBefore(this, element)
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

    function insertTextAtCursor(el, textStart, textEnd) {
        var startIndex, endIndex, range
        var val = el.value
        var doc = el.ownerDocument

        if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
            startIndex = el.selectionStart
            endIndex = el.selectionEnd
            el.value = val.slice(0, startIndex) + textStart + val.slice(startIndex, endIndex) + textEnd + val.slice(endIndex)
            el.selectionStart = el.selectionEnd = endIndex + textStart.length
            el.focus()
        } else if (doc.selection != undefined && doc.selection.createRange) {
            el.focus()
            range = doc.selection.createRange()
            range.collapse(false)
            range.text = textStart
            range.select()
        }
    }

    /******************************************************************************/
    /******************************************************************************/

    // DEFAULT SETTINGS
    const maxReplyDefault = 10
    const nestedCommentStyleDefault = 'popup'

    // USER SETTINGS
    let maxReply = GM_getValue('maxReply', null)
    let nestedCommentStyle = GM_getValue('nestedCommentStyle', null)

    // CONSTANTS
    const posts = getElementsByIdStartsWith('div', 'postcontent')
    const url = window.location.href
    const postUrl = url.match(/\/(last|)post\/\w{24}.*#post\w{24}/)
    const nestedUrl = url.match(/\/post\/\w{24}\/\?child_id=\w{24}$/)
    const postReplyUrl = url.match(/\/post_reply\/\w{24}\/$/)
    const editPostUrl = url.match(/\/edit_post\/\w{24}$/)
    const log = '[Kaskus Quote]'
    let threadId

    /******************************************************************************/

    if (maxReply == null || typeof maxReply !== 'number') {
        GM_setValue('maxReply', maxReplyDefault)
    } else if (maxReply < 0) {
        GM_setValue('maxReply', 0)
    } else if (maxReply > 20) {
        GM_setValue('maxReply', 20)
    }
    maxReply = GM_getValue('maxReply')

    if (nestedCommentStyle == null || (nestedCommentStyle !== 'expand' && nestedCommentStyle !== 'popup')) {
        GM_setValue('nestedCommentStyle', nestedCommentStyleDefault)
        nestedCommentStyle = GM_getValue('nestedCommentStyle')
    }

    console.log(log, 'maxReply = ' + maxReply)
    console.log(log, 'nestedCommentStyle = ' + nestedCommentStyle)

    /******************************************************************************/
    /*************************** FUNCTION CONTROLLER ******************************/
    /******************************************************************************/

    if (postReplyUrl) {
        setQuotedText()
        postReplyTools()
    } else if (editPostUrl) {
        postReplyTools()
    } else if (posts.length > 0) {
        threadId = document.getElementById('thread_id').value
        setTimeout(createSingleQuote(posts), 10)
        setTimeout(createLoadingScreen, 10)
        setTimeout(removeDeletedPosts, 20)
    }

    /******************************************************************************/

    function createLoadingScreen() {
        if (nestedUrl) {
            const loadingScreen = document.createElement('div')

            loadingScreen.id = 'loadingScreen'
            loadingScreen.setAttribute('class','loading-screen')
            loadingScreen.innerHTML = '<div class="progressbar"></div>'
            
            document.body.append(loadingScreen)
            //document.body.classList.add('Ovy-hidden')
        }
    }
    
    /******************************************************************************/

    function removeDeletedPosts() {
        const deletedPost = getElementsByIdStartsWith('div', 'postdeleted')

        if (deletedPost.length > 0) {
            for (let i = 0; i < deletedPost.length; i++) {
                deletedPost[i].parentNode.remove()
            }
            console.log(log, 'Removing deleted post')
        }
        nestedCommentsHandler()
    }

    /******************************************************************************/

    function nestedCommentsHandler() {
        const nestedWrapper = document.getElementsByClassName('nestedWrapper')
        const emptyArray = []
        const nullElement = null

        if (nestedWrapper.length === 0) {
            setTimeout(stickyPostButton, 500)
            return
        }

        if (maxReply === 0 && postUrl) {
            if (nestedCommentStyle === 'popup') {
                setTimeout(nestedPopupStyle(nestedWrapper), 20)
            }
            setTimeout(nestedCommentsObserver(emptyArray, nullElement), 50)
        } else {
            setTimeout(openNestedComments(posts), 50)
        }

        setTimeout(replyTools, 2000)
        setTimeout(stickyPostButton, 1500)
    }

    /******************************************************************************/

    function createSingleQuote(posts) {
        for (let i = 0; i < posts.length; i++) {
            let replyButton = posts[i].getElementsByClassName('Cur(p) C(c-secondary) nightmode_C(c-secondary-night) reply-btn')[0]

            if (replyButton && replyButton.className === 'D(f) Jc(fs) Ai(c) Cur(p) Mstart(10px) C(c-secondary) nightmode_C(c-secondary-night) reply-btn') {
                let singleQuoteBtn = document.createElement('div')
                let postId = posts[i].id.match(/(?<=^postcontent).+/)
                let click = `quote('${threadId}', '${postId}');return false;`

                singleQuoteBtn.setAttribute('class', 'D(f) Jc(fs) Ai(c) Mend(10px) Cur(p) Px(8px) Py(3px) Bdrs(8px)')
                singleQuoteBtn.setAttribute('onclick', click)
                singleQuoteBtn.innerHTML = ` 
                    <div class="Mend(5px)"><i class="fas fa-comment Fz(20px)"></i></div>
                `
                replyButton.parentNode.prepend(singleQuoteBtn)
                singleQuoteBtn.addEventListener('click', createXhr)
            }
        }
        console.log(log, 'Successfully created Single Quote Button!')
    }

    /******************************************************************************/

    function createNestedQuote(post) {
        for (var i = 0; i < post.length; i++) {
            let replyButton = post[i].getElementsByClassName('reply-btn')[0]

            if (replyButton && replyButton.className === 'D(f) Jc(fs) Ai(c) Mstart(10px) C(#b3b3b3) reply-btn') {
                let parentNode = replyButton.parentNode
                let singleQuoteBtn = document.createElement('div')
                let multiQuoteBtn = document.createElement('div')
                let postId = post[i].id.match(/(?<=^nestedbit-).+/)
                let click = `quote('${threadId}', '${postId}');return false;`

                singleQuoteBtn.setAttribute('class', 'D(f) Jc(fs) Ai(c) Mend(10px) Cur(p) Px(8px) Py(3px) Bdrs(8px)')
                singleQuoteBtn.setAttribute('onclick', click)
                singleQuoteBtn.innerHTML = ` 
                    <div class="Mend(5px)"><i class="fas fa-comment Fz(18px)"></i></div>
                `

                multiQuoteBtn.setAttribute('class', 'quote-btn D(f) Jc(fs) Ai(c) Mend(10px) Cur(p) Px(8px) Py(3px) Bdrs(8px)')
                multiQuoteBtn.setAttribute('onclick', 'return false;')
                multiQuoteBtn.setAttribute('data-postid', postId)
                multiQuoteBtn.id = 'mq_' + postId
                multiQuoteBtn.innerHTML = `
                    <div class="Mend(5px)"><i class="fas fa-comments Fz(18px)"></i></div>
                `

                replyButton.classList.add('Mend(4px)')
                replyButton.firstElementChild.classList.add('Fz(16px)')
                parentNode.classList.add('C(c-secondary)', 'nightmode_C(c-secondary-night)')
                parentNode.prepend(singleQuoteBtn, multiQuoteBtn)
                singleQuoteBtn.addEventListener('click', createXhr)
                multiQuoteBtn.addEventListener('click', () => {
                    multiQuoteBtn.classList.toggle('mq-color')
                })

            } else if (!replyButton) {
                post[i].remove()
                console.log(log, 'Removing invalid post in nested comments')
            }
        }
        console.log(log, 'Successfully created Single & Multi Quote Button in nested comments!')
    }

    /******************************************************************************/

    function openNestedComments(posts) {
        const totalNested = []
        const priorityNested = []
        const popupNested = []
        let clickedTrigger = []
        let checkHelper = true
        let postId, childId, postElement

        if (postUrl) {
            postId = url.match(/(?<=#)post\w{24}/)
            postElement = document.getElementById(postId)
        } else if (nestedUrl) {
            try {
                postId = 'post' + url.match(/(?<=\/post\/)\w{24}/)
                childId = 'nestedbit-' + url.match(/(?<=child_id=)\w{24}$/)
                postElement = document.getElementById(postId)
                postElement.getElementsByClassName('jsShowNestedTrigger')[0]
                    .setAttribute('priority', 'high')

                specificNestedCommentObserver(postElement, childId)
            } catch (e) {
                console.log(log, e)
            }
        }
        
        if (maxReply === 20 && nestedCommentStyle === 'expand') {
            const nestedTrigger = document.getElementsByClassName('jsShowNestedTrigger')
            clickedTrigger = Array.from(nestedTrigger)

            if (postElement) {
                for (let i = 0; i < posts.length; i++) {
                    let trigger = posts[i].parentNode.getElementsByClassName('jsShowNestedTrigger')[0]
                    if (posts[i].parentNode.id == postId) {
                        break
                    } else if (trigger) {
                        priorityNested.push(totalNested.length)
                        totalNested.push(totalNested.length)
                    }
                }
            }
        } else {
            for (let i = 0; i < posts.length; i++) {
                let trigger = posts[i].parentNode.getElementsByClassName('jsShowNestedTrigger')[0]
                if (posts[i].parentNode.id == postId) {
                    checkHelper = false
                }

                if (trigger) {
                    let replyCount = trigger.getAttribute('data-replycount')
                    let priority = trigger.getAttribute('priority') || ''

                    if (replyCount <= maxReply || priority === 'high') {
                        clickedTrigger.push(trigger)
                        if (postElement && checkHelper) {
                            priorityNested.push(totalNested.length)
                        }
                    } 
                    if (nestedCommentStyle === 'popup' && replyCount > maxReply) {
                        popupNested.push(trigger.parentNode.parentNode)
                    }
                    totalNested.push(totalNested.length)
                }
            }
        }
        
        if (popupNested.length > 0) {
            setTimeout(nestedPopupStyle(popupNested), 20)
        }
        nestedCommentsObserver(priorityNested, postElement)
        if (clickedTrigger.length > 0) {
            setTimeout(clickIterator, 200)
        }

        function clickIterator() {
            for (let i = 0; i < clickedTrigger.length; i++) {
                if (clickedTrigger[i].classList.contains('getNestedAD')) {
                    clickedTrigger[i].click()
                } else {
                    clickedTrigger.splice(i, 1)
                    i--
                }
            }
            console.log(log, `Clicking (${clickedTrigger.length}) nested trigger `)

            if (clickedTrigger.length > 0) {
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

                            if (postId.startsWith('nestedbit-')) {
                                newPosts.push(newNodes[j])
                            } else if (postId.startsWith('nestedbit-deleted-')) {
                                newNodes[j].remove()
                                console.log(log, 'Removing nestedbit-deleted in nested comments')
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
                let childElement = document.getElementById(childId)
                let moreNested = mutation.target.getElementsByClassName('moreNested')[0]

                if (!childElement && moreNested.innerHTML) {
                    moreNested.click()
                } else if (childElement) {
                    console.log(log, `Child Post was found in ${parentElement.id}`)
                    setTimeout(() => { 
                        childElement.scrollIntoView({
                            block: 'center',
                            behavior: 'smooth'
                        })
                        console.log(log, 'Focusing to nested comment ' + childId)
                        setTimeout(() => { 
                            document.getElementById('loadingScreen').remove() 
                            //document.body.classList.remove('Ovy-hidden')
                        }, 1100)
                    }, 1000)

                    observer.disconnect()
                    console.log(log, `Disconnect observer for nestedItemContent in ${parentElement.id}`)
                } else if (!moreNested.innerHTML) {
                    console.log(log, `Child Post was not found in ${parentElement.id}`)
                    document.getElementById('loadingScreen').remove()
                    observer.disconnect()
                    console.log(log, `Disconnect observer for nestedItemContent in ${parentElement.id}`)
                }
            })
        })

        observer.observe(itemContent, config)
        console.log(log, `Observing nestedItemContent in ${parentElement.id} for focusing business`)
    }

    /******************************************************************************/

    function nestedPopupStyle(nestedWrapper) {
        for (let i = 0; i < nestedWrapper.length; i++) {
            let trigger = nestedWrapper[i].getElementsByClassName('jsShowNestedTrigger')[0]
            let simpleReply = nestedWrapper[i].getElementsByClassName('simple-reply')[0]
            let smallReply = nestedWrapper[i].getElementsByClassName('small-reply')[0]
            

            trigger.addEventListener('click', () => {
                let checkLastReply = nestedWrapper[i].getElementsByClassName('gotolastreply')[0]
                document.body.classList.toggle('Ovy-hidden')
                nestedWrapper[i].classList.toggle('wrapper-popup')
                if (nestedWrapper[i].firstElementChild.classList.contains('trigger-popup')) {
                    nestedWrapper[i].firstElementChild.classList.remove('trigger-popup','Bdb(borderSolidGray2)','nightmode_Bdb(borderSolidGray6)')
                } else {
                    nestedWrapper[i].firstElementChild.classList.add('trigger-popup','Bgc(c-gray-0)','nightmode_Bgc(c-gray-8)','nightmode_Bgc(c-gray-8)','Bdb(borderSolidGray2)','nightmode_Bdb(borderSolidGray6)')
                }

                if (!checkLastReply) {
                    let lastReplyBtn = document.createElement('div')
                    lastReplyBtn.setAttribute('class','Mstart(a) gotolastreply')
                    lastReplyBtn.innerHTML = `
                        <span class="Fz(14px) C(c-blue) Mend(10px) Fw(500) nightmode_C(c-blue-night)">Jump to Last Reply</span> 
                        <i class="far C(c-blue-dark) nightmode_C(c-blue-dark) fa-angle-down"></i>
                    `
                    nestedWrapper[i].firstElementChild.append(lastReplyBtn)

                    lastReplyBtn.addEventListener('click', () => {
                        nestedWrapper[i].scrollTop = nestedWrapper[i].scrollHeight - nestedWrapper[i].clientHeight
                    })
                } else {
                    checkLastReply.remove()
                }

                simpleReply.classList.add('Bgc(c-gray-0)','nightmode_Bgc(c-gray-8)')
                simpleReply.classList.toggle('reply-popup')
                smallReply.classList.add('Bgc(c-gray-0)','nightmode_Bgc(c-gray-8)')
                smallReply.classList.toggle('reply-popup')
                smallReply.classList.toggle('Ovy(a)')
            })
        }
        console.log(log, 'Success set nested wrapper properties')
    }

    /******************************************************************************/

    function nestedPostProperties(posts) {
        for (let i = 0; i < posts.length; i++) {
            let pageText = posts[i].getElementsByClassName('pagetext')[0]
            let container1 = posts[i].firstElementChild
            let container2 = container1.firstElementChild

            if (pageText) {
                pageText.classList.add('Pt(15px)','Pb(15px)','Mih(70px)','Bdt(borderSolidGray2)','Bdb(borderSolidGray2)','nightmode_Bdt(borderSolidGray6)','nightmode_Bdb(borderSolidGray6)')
                container1.classList.add('Pt(8px)','Pb(8px)')
                container2.style.marginBottom = '0px'
            }
        }
        console.log(log, 'Success set nested post properties')
    }
    
    /******************************************************************************/

    function createXhr() {
        const openUrl = 'https://m.kaskus.co.id/post_reply/' + threadId

        document.body.style.opacity = '0.5'
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
                let quotedText = res.response.getElementById('jsCreateThread').value

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
        console.log(log, 'Set text to jsCreateThread textarea')
        console.log(log, quotedText)
        document.getElementById('jsCreateThread').value = quotedText
        //GM_deleteValue('quotedText')
    }

    /******************************************************************************/

    function focusToPost(postElement) {
        const headerOffset = 85
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
        const parentWrapper = document.getElementsByClassName('parentWrapper')[0]
        const container = document.getElementById('quick_reply_wrapper').nextElementSibling
        const postReplyBtn = document.getElementById('btn-reply-thread')
        const config = {
            childList: true,
            characterData: true
        }

        parentWrapper.style.overflow = 'unset'

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let text = mutation.target.innerHTML.match(/^Kutip ([2-9]|\d{2}) Post$/)
                let classList = container.classList.contains('sticky-button')

                if (text && !classList) {
                    mutation.target.classList.add('corner')
                    container.firstElementChild.classList.add('btn-container')
                    container.classList.add('sticky-button')
                } else if (!text && classList) {
                    container.classList.remove('sticky-button')
                    container.firstElementChild.classList.remove('btn-container')
                    mutation.target.classList.remove('corner')
                }
            })
        })

        observer.observe(postReplyBtn, config)
        console.log(log, 'Observe Post Button')
    }

    /******************************************************************************/

    function replyTools() {
        let position = document.getElementsByClassName('Ta(end) Mt(5px)')
        let textarea = document.querySelectorAll('textarea[id^="jsReplyTextArea_"]')

        for (let i = 0; i < position.length; i++) {
            //textarea[i].setAttribute('id', `textarea${i}`)
            let NE0 = document.createElement('div')
            //let textareaId = textarea[i].getAttribute('id')
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
                if (url) {
                    let teks = prompt("Teks yang ditampilkan :")
                    if (teks) {
                        insertTextAtCursor(textarea[i], `[URL="${url}"]${teks}[/URL] `, '')
                    }
                }
            })

            let imgurlbtn = document.getElementsByClassName('imgurlbtn')
            imgurlbtn[i].addEventListener("click", () => {
                let url = prompt("Image URL :")
                if (url) {
                    insertTextAtCursor(textarea[i], `[IMG]${url}[/IMG] `, '')
                }
            })

            let spoilerbtn = document.getElementsByClassName('spoilerbtn')
            spoilerbtn[i].addEventListener("click", function (e) {
                let judul = prompt("Judul Spoiler :")
                if (judul) {
                    insertTextAtCursor(textarea[i], `[SPOILER=${judul}]
`, `
[/SPOILER]`)
                }
            })


        }
    }


    function postReplyTools() {
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

    /******************************************************************************/

})()

/******************************************************************************/
