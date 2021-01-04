// ==UserScript==
// @name          Kaskus : Show All Post for PC (Dev)
// @version       2.1.0
// @namespace     k-allpostpc
// @author        ffsuperteam
// @icon          https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect single post ke all post (thread)
// @match         https://www.kaskus.co.id/show_post/*/?child_id=*
// @match         https://www.kaskus.co.id/show_post/*
// @exclude       https://www.kaskus.co.id/show_post/*/*/-
// @exclude       https://www.kaskus.co.id/show_post/*//-
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/dev/script/pc/k-allpostpc.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/dev/script/pc/k-allpostpc.user.js
// @run-at        document-start
// ==/UserScript==

'use strict';

(() => {
	const url = window.location.href
    const parentId = url.match(/(?<=\/show_post\/)\w{24}/)
    const childId = url.match(/(?<=child_id=)\w{24}/)
    const postId = url.match(/#post\w{24}/)

    if (childId) {
        window.location.href = `https://www.kaskus.co.id/post/${parentId}/?child_id=post${childId}`
    }
    else if (!childId && postId) {
        window.location.href = `https://www.kaskus.co.id/post/${parentId}/${postId}`
    }
    else {
        return
    }
    
})()