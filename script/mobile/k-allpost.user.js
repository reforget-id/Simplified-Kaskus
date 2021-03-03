// ==UserScript==
// @name          Kaskus : Show All Post (Mobile Dev)
// @version       2.1.0
// @namespace     k-allpost
// @author        ffsuperteam
// @icon          https://s.kaskus.id/themes_3.0/mobile/images/logo-n.svg
// @homepage      https://github.com/reforget-id/Simplified-Kaskus
// @description   Otomatis redirect single post ke all post (thread)
// @match         https://m.kaskus.co.id/show_post/*/?child_id=*
// @match         https://m.kaskus.co.id/show_post/*
// @exclude       https://m.kaskus.co.id/show_post/*/*/-
// @exclude       https://m.kaskus.co.id/show_post/*//-
// @downloadURL   https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @updateURL     https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/script/mobile/k-allpost.user.js
// @run-at        document-start
// ==/UserScript==

'use strict';

(() => {
	const url = window.location.href
    const parentId = url.match(/(?<=\/show_post\/)\w{24}/)
    const childId = url.match(/(?<=child_id=)\w{24}/)
    const postId = url.match(/#post\w{24}/)

    if (childId) {
        window.location.href = `https://m.kaskus.co.id/post/${parentId}/?child_id=${childId}`
    }
    else if (postId) {
        window.location.href = `https://m.kaskus.co.id/post/${parentId}${postId}`
    }
    
})()
