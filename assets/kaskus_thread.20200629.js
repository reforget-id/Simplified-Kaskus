function save_smiley_localStorage(t) {
    if (localStorage) {
        if (a = JSON.parse(localStorage.getItem(mru_key)))
            for (var e in a) e === "smilie" + t && delete a[e];
        else var a = new Object;
        mru_limit == Object.keys(a).length && delete a[Object.keys(a)[0]], a["smilie" + t] = t, localStorage.setItem(mru_key, JSON.stringify(a))
    }
}

function get_revamp_MRU() {
    var t = [];
    if (localStorage[mru_key] && (mru = JSON.parse(localStorage[mru_key]), mru)) {
        for (var e in mru) e.search("smilie") > -1 && t.push(mru[e]);
        var a = {
            smilies: t
        }
    }
    return a || {}
}
var giphy_tab_id, giphy_timer, fetched_smilies = null;

function get_revamp_smilies() {
    if (localSmilies = get_revamp_MRU(), localSmilies) var t = {
        smilies: $.param(localSmilies)
    };
    null == fetched_smilies ? $.ajax({
        method: "POST",
        url: "/misc/get_smilies/0",
        data: t || {}
    }).done(get_revamp_smilies_success) : $("#jsSmiliesWrapper").toggleClass("is-open")
}

function get_revamp_smilies_success(t) {
    fetched_smilies = t, build_revamp_smilies_tag(t)
}

function openSmileyTab(t, e) {
    $("#jsSmiliesTabNavHead div").removeClass("is-active"), $(e).parent().addClass("is-active"), $(".tabcontent").hide(), $(t).show()
}

function open_smiley_tab(t, e, a) {
    "Giphy" == a && get_giphy_revamp(t), $("#jsSmiliesTabNavHead div").removeClass("is-active"), $(e).addClass("is-active"), $(".tabcontent").hide(), $(t).show(), title = $(e).find(".tabNavIcon").attr("data-title"), smilie_tracking("smiley", "click", title)
}

function insert_smiley(t, e, a) {
    var s = $(e).val(),
        i = $(e).prop("selectionStart"),
        o = s.substring(0, i),
        r = s.substring(i, s.length);
    $(e).val(o + t + r), $(e).focus(), $(e).prop("selectionStart", i + t.length), a && save_smiley_localStorage(t)
}

function build_revamp_smilies_tag(t) {
    parsed = JSON.parse(t), smilies = JSON.parse(parsed.kaskus);
    $("#jsSmiliesTabNavHead").append(parsed.tab), $("#jsSmiliesTabContent").append(parsed.content), load_MRU_revamp(), $("#tab-mru").show()
}

function load_MRU_revamp() {
    var t = $("#content-mru").find(".loadMRU");
    return t && $.each(t, function (t, e) {
        $(e).attr("src", $('.loadSmilies[alt="' + $(e).attr("data-src") + '"]').attr("src")), $(e).attr("title", $('.loadSmilies[alt="' + $(e).attr("data-src") + '"]').attr("title")), $(e).attr("alt", $('.loadSmilies[alt="' + $(e).attr("data-src") + '"]').attr("alt"))
    }), !0
}

function get_giphy_revamp(t, e) {
    giphy_tab_id = t, $.ajax({
        method: "POST",
        url: "/misc/get_giphy/0",
        cache: !1,
        data: {
            keyword: e
        }
    }).done(function (t) {
        giphy = JSON.parse(t), $(giphy_tab_id).html(giphy), $("#search-giphy").focus(), e && $("#search-giphy").val(e), $("#search-giphy").keydown(function (t) {
            13 === t.keyCode && (clearTimeout(giphy_timer), t.preventDefault(), query = t.target.value, get_giphy_revamp(giphy_tab_id, query))
        })
    })
}
var giphy_keyword = null;

function search_revamp_giphy(t) {
    clearTimeout(giphy_timer), giphy_timer = setTimeout(function () {
        return giphy_keyword != t.value && (giphy_keyword = t.value, get_giphy_revamp(giphy_tab_id, giphy_keyword)), !1
    }, 1e3)
}

function get_autocomplete_mention(t) {
    var e = $(".sctoken").val();
    $.ajax({
        url: KASKUS_URL + "/misc/get_user_mention/",
        type: "post",
        data: {
            keyword: t,
            securitytoken: e
        },
        xhrFields: {
            withCredentials: !0
        },
        success: function (t) {
            "object" != typeof t && (t = $.parseJSON(t)), t.success ? $(".mentionList").html(t.view) : $(".mentionList").html(""), $(".sctoken").val(t.securitytoken)
        }
    })
}

function quote(t, e, a) {
    a || (a = "yes");
    var s = "";
    if (null != $.cookie("kaskus_multiquote_" + __thread_id)) {
        for (s = $.cookie("kaskus_multiquote_" + __thread_id).split(","), store_post_id = $.cookie("kaskus_multiquote_" + __thread_id), count = !1, i = 0; i < s.length; i++) s[i] == e && (count = !0, "yes" == a && (store_post_id = store_post_id.split("," + e).join(""), store_post_id = store_post_id.split(e + ",").join(""), store_post_id = store_post_id.split(e).join("")));
        0 == count && (store_post_id += "," + e)
    } else store_post_id = e;
    if ("" == store_post_id) return $.cookie("kaskus_multiquote_" + __thread_id, null, {
        expires: null,
        path: "/",
        secure: !1
    }), $("#mq_" + e).toggleClass("btn-orange"), !0;
    $("#mq_" + e).toggleClass("btn-orange");
    var o = new Date;
    o.setTime(o.getTime() + 864e5), $.cookie("kaskus_multiquote_" + __thread_id, store_post_id, {
        expires: o,
        path: "/",
        secure: !1
    })
}

function a_reason(t) {
    $("#reason").val(t)
}

function b_reason() {
    var t = $(".reputation_button").attr("id").split("_"),
        e = $("#reason").val();
    if (void 0 === $("input:radio[name=reputation]:checked").val()) return alert("Please select the type of reputation you want to give"), !1;
    jQuery.fn.modalBox("close"), $.ajax({
        url: KASKUS_URL + "/give_reputation/" + t[1],
        type: "post",
        data: {
            reputation: $("input:radio[name=reputation]:checked").val(),
            reason: e,
            ajax: !0
        },
        xhrFields: {
            withCredentials: !0
        },
        dataType: "json"
    }).success(function (t) {
        return alert(t.message_return), !1
    })
}

function increment_share_count_revamp(t, e) {
    $.ajax({
        url: KASKUS_URL + "/misc/update_share_count",
        type: "POST",
        data: {
            share_type: e,
            thread_id: t
        },
        xhrFields: {
            withCredentials: !0
        },
        success: function (t) {
            "object" != typeof t && (t = $.parseJSON(t)), "true" == t.success && $(".total-share").fadeOut(300, function () {
                var t = $(this).html();
                t.indexOf("K") < 0 && t.indexOf("M") < 0 && $(this).html(parseInt(t) + 1), $(this).fadeIn(300)
            })
        },
        error: function (t) {}
    })
}

function increment_share_count(t, e) {
    $.ajax({
        url: KASKUS_URL + "/misc/update_share_count",
        type: "POST",
        data: {
            share_type: e,
            thread_id: t
        },
        xhrFields: {
            withCredentials: !0
        },
        success: function (t) {
            "object" != typeof t && (t = $.parseJSON(t)), "true" == t.success && $("li.total-share span").fadeOut(300, function () {
                var t = $(this).html();
                t.indexOf("K") < 0 && t.indexOf("M") < 0 && $(this).html(parseInt(t) + 1), $(this).fadeIn(300)
            })
        },
        error: function (t) {}
    })
}

function spoiler(t) {
    "Show" == t.value ? ($(".content_" + $(t).attr("class")).slideDown(0), t.innerHTML = "", t.value = "Hide") : ($(".content_" + $(t).attr("class")).slideUp(0), t.innerHTML = "", t.value = "Show")
}

function createNestedReplyForm(t) {
    var e = $(t);
    /*
    if (!e.parents("form").hasClass("form-reply-message")) {
        var a = e.attr("id").split("-")[2],
            s = $jQ("#qr" + a),
            i = $jQ("#securitytoken").val();
        formString = '<form class="form-reply-message" role="form" action="/post_reply/' + __thread_id + '" method="post" name="qr_form" ></form>', e.after('<input type="hidden" name="securitytoken" value="' + i + '" class="sctoken">'), e.after('<input id="parent_post" type="hidden" name="parent_post" value="' + a + '">'), e.after('<input type="hidden" name="thread_id" value="' + __thread_id + '" id="qr_threadid">'), s.wrap(formString), setTimeout(function () {
            e.focus()
        }, 5)
    }*/
}

function createQuickReplyForm(t) {
    var e = $(t);/*
    if (!e.parents("form").hasClass("form-reply-message")) {
        var a = e.parents(".qr-section"),
            s = a.data("postid"),
            i = $jQ("#securitytoken").val(),
            o = $jQ("#thread_id").val();
        $jQ("#captcha-wrapper").css("display", "block"), formString = '<form class="form-reply-message" onsubmit="return quick_reply(this);" role="form" action="/post_reply/' + o + '" method="post" name="qr_form"></form>', e.after('<input type="hidden" name="securitytoken" value="' + i + '" class="sctoken">'), e.after('<input type="hidden" name="fromquickreply" value="1">'), e.after('<input type="hidden" name="do" value="postreply">'), e.after('<input type="hidden" name="parseurl" value="1">'), e.after('<input id="parent_post" type="hidden" name="parent_post" value="' + s + '">'), e.after('<input type="hidden" name="thread_id" value="' + o + '" id="qr_threadid">'), e.after('<input type="hidden" name="post_id" value="' + s + '">'), s == FIRST_POST_ID ? from_first_post = "1" : from_first_post = "0", e.after('<input type="hidden" class="qr-first-post" name="qr_first_post" value="' + from_first_post + '" id="qr_threadid">'), a.wrap(formString), $jQ(".qr-button").show(), $jQ(".qr-message").focus(), setTimeout(function () {
            e.focus()
        }, 5)
    }*/
}

function moveReplyForm(t) {
    if (!($jQ(t).attr("href").search("post_reply") >= 0)) {
        var e = $jQ(t).attr("data-reply-count"),
            a = $jQ(".qr-section")[0],
            s = $jQ(t).data("postid"),
            i = $.cookie("post_order");
        if (s == $jQ(".qr-section").attr("data-postid") && e < 1) return $jQ(".qr-section").show(), void $jQ(".qr-message").focus();
        if ($.isEmptyObject(i) && (i = "1"), e < 1 || void 0 === e) {
            if ($jQ(".qr-section").find("input[name=post_id]").val(s), $jQ(".qr-section").attr("data-postid", s), (a = $jQ(a).parent("form").hasClass("form-reply-message") ? $jQ(a).parent("form") : $jQ(a)).insertAfter($jQ(t).parents("div:eq(1)")), $jQ("#parent_post").val(s), s == FIRST_POST_ID) from_first_post = "1";
            else {
                from_first_post = "0";
                var o = $jQ(t).data("username");
                l = getPageTextMentionList($jQ(t).closest(".postbody").find(".pagetext"), o), $jQ(".qr-section").find("textarea").val(l)
            }
            $jQ(".qr-first-post").val(from_first_post), $jQ(".qr-section").show(), $jQ(".qr-message").focus(), autosize.update($jQ(".qr-section").find("textarea")[0])
        }  
        else {
            $(".smallReply").hide();
            var r = $jQ(t),
                n = r.data("root-postid"),
                l = "";
            o = r.data("username");
            l = getPageTextMentionList(r.closest(".postbody").find(".pagetext"), o), $jQ("#qr" + n).show(), $jQ("#qr-message-" + n).val(l);
            var d = r.parents("div").eq(1).siblings(".nestedWrapper").find(".jsNestedItemContent");
            d.find(".totalNestedOf").text("1 dari " + e), d.show(), $(".statusFetchData").hide(), $jQ("html, body").animate({
                scrollTop: $jQ("#qr-message-" + n).offset().top - $jQ(".jsNavHeader").outerHeight() - 10
            }, 1e3), $jQ("#qr-message-" + n).focus(), $jQ("#qr" + n).find("input[name=parent_post]").val(s)
        }
    }
}

function getPageTextMentionList(t, e) {
    if ("" == e) return "";
    var a = "",
        s = new RegExp(".+?/@([A-Za-z0-9.]*)"),
        i = "";
    "" !== e && e !== current_username && (i = "[mention]" + e + "[/mention] ");
    for (var o = t.find("a.mention"), r = 0; r < o.length; r++) {
        var n = s.exec(o[r].href);
        n[1] !== current_username && 0 == $(o[r]).parents(".quote").length && (a = a + "[mention]" + n[1] + "[/mention] "), n[1] === e && (i = "")
    }
    return a += i
}

function replyFromNested(t) {
    qrStatus = !0, result = !1, quickReply(t), qrStatus = !1
}

function quickReply(t) {
    if (1 == qrStatus) {
        var e = $(t).serialize();
        $.post("/post_reply/" + __thread_id, e, function (e) {
            if (void 0 !== e) {
                if (0 == e.error) {
                    var a, s = $.cookie("post_order");
                    $.isEmptyObject(s) && (s = "1");
                    var i = $(e.post).addClass("removeAfterLoad");
                    s < 0 ? ($jQ(t).siblings(".statusFetchData").first().after(i), a = $jQ("#post" + e.post_id + " .nestedbit").first().offset().top) : ($jQ(t).siblings(".statusFetchData").last().before(i), a = $jQ("#post" + e.post_id + " .nestedbit").last().offset().top), $jQ(t).find(".reply-post").val(""), wrapper_id = $jQ(t).children().attr("id"), $jQ("#" + wrapper_id).hide();
                    var o = $(t).serializeArray(),
                        r = {};
                    $(o).each(function (t, e) {
                        r[e.name] = e.value
                    }), $("html, body").animate({
                        scrollTop: a - $jQ(".jsNavHeader").outerHeight() - 20
                    }, 1e3);
                    var n = $jQ(t).siblings(".loadMoreAD");
                    if (n.length > 0 && s < 0 && (n.attr("data-offset", +n.attr("data-offset") + 1), n.attr("data-replycount", +n.attr("data-replycount") + 1)), 1 == e.auto_subscribe_user) {
                        var l = $("#post" + e.post_id).find(".subscribe-post");
                        l.removeClass("subscribe-post"), l.addClass("unsubscribe-post"), l.find("span").text("Matikan Notifikasi")
                    }
                } else showBottomToast(e.message, 2e3);
                $(".sctoken").val(e.securitytoken), reFireLazyLoadAndtooltip()
            }
        }, "json")
    }
}

function getNestedAscendingDescending(t, e) {
    var a = $jQ(t),
        s = a.parents(".nestedWrapper").find(".jsNestedItemContent"),
        i = s.find(".statusFetchData"),
        o = s.find(".statusFetchDataTop"),
        r = null;
    a.hasClass("jsShowNestedTrigger") && (r = a, a.removeClass("getNestedAD"), a.hide(), a = s.find(".loadMoreAD")), a.hide(), i.show(), o.show(), "#" === a.attr("href") && e.preventDefault();
    var n = a.data("postid"),
        l = parseInt(a.attr("data-offset")),
        d = parseInt(a.attr("data-limit")),
        c = parseInt(a.attr("data-order")),
        u = parseInt(a.attr("data-replycount")),
        p = a.hasClass("loadMoreTopAD"),
        h = n + "/" + l + "/" + d + "/" + c + "/" + !0;
    $jQ.ajax({
        url: "/misc/get_post_replies/" + h,
        method: "GET"
    }).done(function (t) {
        if ("object" != typeof t && (t = $jQ.parseJSON(t)), !0 === t.result) {
            i.hide(), o.hide(), p ? o.after(t.view) : i.before(t.view);
            var e = parseInt(t.total_post);
            if (p) {
                c = l - e;
                a.attr("data-offset", c), c >= 0 && a.show()
            } else {
                var c = l + e;
                a.attr("data-offset", c), c < u && a.show()
            }
            null !== r && r.show();
            var h = s.find(".loadMoreTopAD").attr("data-offset"),
                m = isNaN(h) ? 1 : parseInt(h) + d + 1,
                _ = s.find(".loadMoreAD").attr("data-offset"),
                f = isNaN(_) ? u : parseInt(_);
            s.find(".totalNestedOf").text("Menampilkan balasan ke " + m + " sampai " + f), $("#post" + n + " .removeAfterLoad").remove(), reFireLazyLoadAndtooltip()
        } else i.find("div").html("Gagal mengambil data"), i.show()
    })
}

function trackShowNested(t) {
    var e = __forum_id + " thread detail",
        a = __thread_id,
        s = $jQ(t).parents(".nestedWrapper").find(".jsNestedItemContent").hasClass("is-hide") ? "close nested" : "open nested";
    _gaq.push(["_trackEvent", e, s, a]), dataLayer.push({
        event: "trackEvent",
        "eventDetails.category": e,
        "eventDetails.action": s,
        "eventDetails.label": a
    })
}

function reFireLazyLoadAndtooltip() {
    setTimeout(function () {
        $(window).off("scroll.kslzy resize.kslzy lookup.kslzy click.kslzy"), $(".mls-img").kslzy(300), $(".embed_twitter").kslzy(300, "fetch_twitter"), $(".embed_instagram").kslzy(300, "fetch_instagram"), tippy(".jsTippy", {
            theme: "translucent",
            arrow: !0,
            size: "small"
        }), autosize($(".jsNestedReplyTextArea"))
    }, 300)
}

function switchCheckbox(t, e) {
    var a = $jQ(t).find("input"),
        s = a.prop("checked");
    a.prop("checked", !s)
}

function moveTo() {
    var t = $(location).attr("href").match(/(.*?)\/show_post\/\w{24}\/.*?\?child_id=(\w{24})/);
    null == t && (t = $(location).attr("href").match(/(.*?)\/show_post\/(\w{24})/)), null == t && (t = $(location).attr("href").match(/(.*?)\/post\/(\w{24})/));
    var e = $(".jsStickyHeader"),
        a = e.length ? e.height() - 10 : 0;
    if (null !== t) {
        var s = t[2];
        try {
            $("html, body").animate({
                scrollTop: $("#post" + s).offset().top - a - 10
            })
        } catch (t) {}
    }
}

function countCookie() {
    var t = $.cookie("kaskus_multiquote_" + __thread_id);
    if ($.isEmptyObject(t)) $jQ(".post-reply-button").find("a").text("Balas Thread");
    else {
        var e = t.split(",");
        $jQ(".post-reply-button").find("a").text("Kutip " + e.length + " Post")
    }
}

function getRecommendedThread() {
    var t = "/recommendation/recommended_thread/" + __forum_id + "/" + __thread_id;
    $.get(t, function (t) {
        if ("object" != typeof t && (t = $.parseJSON(t)), !1 !== t.result) {
            $jQ("#recommended-thread").replaceWith(t.view);
            var e = $($(t.view_middle)[0]);
            $(".postlist-trh.no-border").html(e.find(".trh-recommend-no-border")[0].outerHTML), $(".mls-img").kslzy(300), t.contain_trh && dataLayer.push({
                event: "optimize.activate"
            }), bindJsTippy()
        }
    })
}

function userquick_connection(t) {
    $.post(t, {
        securitytoken: $("#sctoken").val()
    }, function (t) {
        $("#sctoken").val(t.securitytoken), 1 == t.result ? ("Unfollow" == t.connection_type ? $(".uq-connection").replaceWith('<div class="is-btn-state v-middle m-right-5 uq-connection"><a  class="btn btn-blue--transparent btn-sm is-primary-btn">' + t.label_connection + '</a><a onclick="userquick_connection(' + t.url + ')" class="btn btn-red btn-sm is-secondary-btn">' + t.word + "</a></div>") : "Follow" == t.connection_type ? $(".uq-connection").replaceWith('<div class="is-btn-state v-middle m-right-5 uq-connection"><a class="btn btn-blue btn-sm m-right-5" onclick="userquick_connection(' + t.url + ')">' + t.word + "</a></div>") : "Unblock" == t.connection_type && $(".uq-connection").replaceWith('<div class="is-btn-state v-middle m-right-5 uq-connection"><a  class="btn btn-fixed--long btn-blocked btn-sm is-primary-btn">' + t.label_connection + '</a><a href="' + t.url + '" class="btn btn-fixed--long btn-red btn-sm is-secondary-btn">' + t.word + "</a></div>"), window.location.reload(!0)) : 0 == t.result && notice(t.error_message)
    }, "json")
}

function laporHansip(t) {
    var e = $(t),
        a = e.find("input[name=reportedid]").val(),
        s = e.find("input[name=reportedtype]").val(),
        i = e.find("select").val(),
        o = e.find("textarea").val(),
        r = $jQ("#securitytoken").val();
    e.find(".errorMessage").addClass("D(n)"), $.ajax({
        url: "/misc/lapor_hansip/",
        type: "POST",
        data: {
            reported_id: a,
            category: i,
            reason: o,
            reported_type: s,
            securitytoken: r
        },
        success: function (t) {
            var a = JSON.parse(t);
            if (a.result) $("#jsModalLaporHansip").removeClass("is-open"), $("body").removeClass("Ov(h)"), showBottomToast(a.message, 2e3), e.find("textarea").val(""), e.find("select").val("sara");
            else {
                var s = a.errors,
                    i = !0;
                for (var o in s) {
                    var r = ".error" + o[0].toUpperCase() + o.slice(1);
                    e.find(r).text(s[o]), e.find(r).removeClass("D(n)"), i && $("#lapor-hansip-scroll").animate({
                        scrollTop: $(r).offset().top
                    }, 1e3), i = !1
                }
            }
            $jQ(".sctoken").val(a.securitytoken)
        }
    })
}

function smilie_tracking(t, e, a) {
    _gaq.push(["_trackEvent", t, e, a]), dataLayer.push({
        event: "trackEvent",
        "eventDetails.category": t,
        "eventDetails.action": e,
        "eventDetails.label": a
    })
}
$(document).ready(function () {
    var t;
    ($(".js-show-first-page").on("click", function () {
        window.location.replace("/thread/" + $(this).data("threadid"))
    }), $("#form_poll").submit(function () {
        $("#securitytokenpoll").val($("#securitytoken").val())
    }), $(".button_qr").click(function () {
        var t = $(this).attr("data-postid");
        $("#parent_post").val(t)
    }), $("body").on("click", "a.animate_nested", function (t) {
        if (t.preventDefault(), post_id = $(this).attr("data-postid"), target_dom_id = "post" + post_id, target_dom = $("#" + target_dom_id), void 0 === target_dom[0]) $(location).attr("href", $(this).attr("href"));
        else {
            var e = $(".site-header").length ? $(".site-header").height() : 0;
            $("html, body").animate({
                scrollTop: target_dom.offset().top - e
            })
        }
    }), $("body").on("click", "a.jsLinkNestedPost", function (t) {
        if (t.preventDefault(), post_id = $(this).attr("data-postid"), target_dom_id = "post" + post_id, target_dom = $("#" + target_dom_id), void 0 === target_dom[0]) $(location).attr("href", $(this).attr("href"));
        else {
            var e = $(".jsStickyHeader").length ? $(".jsStickyHeader").height() - 10 : 0;
            $("html, body").animate({
                scrollTop: target_dom.offset().top - e
            })
        }
    }), $("ul.share li.facebook a").click(function () {
        var t = $(this).attr("data-url"),
            e = $(this).attr("data-threadid");
        return FB.ui({
            method: "share",
            href: t
        }, function (a) {
            a && !a.error_code && (increment_share_count(e, "facebook"), _gaq.push(["_trackSocial", "facebook", "send", t]), customGtm.clickEventToAnalytics("facebook", "send", t))
        }), !1
    }), $(".share-thread-head").click(function () {
        if ($(this).hasClass("google")) window.open($(this).attr("href"), "sharer", "toolbar=0,status=0,width=626,height=436"), increment_share_count_revamp($(this).attr("data-threadid"), "google");
        else if ($(this).hasClass("twitter")) window.open($(this).attr("href"), "sharer", "toolbar=0,status=0,width=626,height=436"), increment_share_count_revamp($(this).attr("data-threadid"), "twitter");
        else {
            if ($(this).hasClass("whatsapp")) return increment_share_count_revamp($(this).attr("data-threadid"), "whatsapp"), !0;
            if ($(this).hasClass("facebook-messenger")) return increment_share_count_revamp($(this).attr("data-threadid"), "facebook-messenger"), !0;
            if ($(this).hasClass("mail")) return increment_share_count_revamp($(this).attr("data-threadid"), "mail"), !0;
            $(this).hasClass("facebook") && (t = $(this).attr("data-url"), e = $(this).attr("data-threadid"), FB.ui({
                method: "share",
                href: t
            }, function (a) {
                a && !a.error_code && (increment_share_count_revamp(e, "facebook"), _gaq.push(["_trackSocial", "facebook", "send", t]), customGtm.clickEventToAnalytics("facebook", "send", t))
            }))
        }
        var t, e;
        return !1
    }), $("ul.share li.twitter a, ul.share li.google a").click(function () {
        return window.open($(this).attr("href"), "sharer", "toolbar=0,status=0,width=626,height=436"), "google" == $(this).parent().attr("class") ? increment_share_count($(this).attr("data-threadid"), "google") : "twitter" == $(this).parent().attr("class") && increment_share_count($(this).attr("data-threadid"), "twitter"), !1
    }), $("ul.share li.mail a").click(function () {
        increment_share_count($(this).attr("data-threadid"), "mail")
    }), $(".reputation_button").click(function () {
        $("#reputation_form").submit()
    }), $(".reputation-con div.radio").click(function () {
        $("#modal-rep-radio-" + $(this).attr("data-value")).prop("checked", !0)
    }), $(".post-list-old-theme").on("click", ".external-link", function (t) {
        t.preventDefault();
        var e = $(this).attr("href");
        $.ajax({
            url: e,
            xhrFields: {
                withCredentials: !0
            }
        }).success(function (t) {
            $("#modal-container .modal-content").html(t), $("#modal-container").modal("show"), $("#modal-container .modal-content a").attr("target", "_blank").click(function (t) {
                $(this).is(".btn") && t.preventDefault(), $("#modal-container").modal("hide")
            })
        })
    }), $(".post-list-new-theme").on("click", ".external-link", function (t) {
        t.preventDefault();
        var e = $(this).attr("href");
        $.ajax({
            url: e,
            xhrFields: {
                withCredentials: !0
            },
            success: function (t) {
                openModal("jsModalExternalUrl"), $("#jsModalExternalUrl .modal-body").html(t)
            }
        })
    }), $(".post-list-new-theme").on("click", ".append-post", function (t) {
        var e = $(this).data("postid"),
            a = $(this).data("threadid"),
            s = $("#securitytoken").val();
        $.ajax({
            url: "/misc/append_first_post/" + a + "/" + e,
            method: "POST",
            data: {
                securitytoken: s
            },
            xhrFields: {
                withCredentials: !0
            },
            success: function (t) {
                var a = $.parseJSON(t);
                1 !== a.error && ($(".jsFirstPostItemContent article").html(a.text), $(".embed_twitter").kslzy(300, "fetch_twitter"), $(".embed_instagram").kslzy(300, "fetch_instagram")), showBottomToast(a.message, 1500), $("#securitytoken").val(a.securitytoken), $("#post" + e + " .jsPopoverMenu").removeClass("is-visible")
            }
        })
    }), $(document).on("click", ".whoCendolAjax", function (t) {
        var e = $(this).attr("data-postid"),
            a = KASKUS_URL + "/misc/get_who_cendoled/" + e;
        return $.ajax({
            url: a,
            xhrFields: {
                withCredentials: !0
            },
            success: function (t) {
                "object" != typeof t && (resp = $.parseJSON(t)), 1 == resp.result ? (openModal("jsModalWhoCendoled"), $("#whocendol").html(resp.whocendoled), $("#whobata").html(resp.whobata), $(".modalWhoCendoled .cendolList li").length < 1 ? ($(".jsTabComponent").find(".bata").trigger("click"), $("#jsModalWhoCendoled").find(".modal-header > div").addClass("bata"), $(".jsTabButton").find(".bata").addClass("is-active")) : ($(".jsTabComponent").find(".cendol").trigger("click"), $("#jsModalWhoCendoled").find(".modal-header > div").addClass("cendol"))) : showBottomToast(resp.message_return, 2e3)
            },
            error: function (t) {}
        }), !1
    }), $(document).on("click", ".jsReputationConnection", function (t) {
        var e = $(this).attr("data-userid"),
            a = $(this).attr("data-current-userid"),
            s = $(this).attr("data-url") + e;
        return $.ajax({
            url: s,
            type: "POST",
            xhrFields: {
                withCredentials: !0
            },
            data: {
                securitytoken: $("#securitytoken").val()
            },
            dataType: "json",
            success: function (t) {
                $("#securitytoken").val(t.securitytoken), 1 == t.result ? "Unfollow" == t.connection_type ? $("#connection-user-" + e).html('<a data-id="unfollow" data-default="' + t.label_connection + '" data-current-userid="' + a + '" data-userid="' + e + '" data-hover="' + t.word + '" data-url="/profile/unfollow_user/" class="jsReputationConnection jsFollowingButton D(b) Ta(c) W(80px) Bdrs(3px) Bdw(1px) Bds(s) C(c-blue) Fz(12px) Py(5px) Trs(transitionAll) Bgc(c-white) Bgc(c-red):h Bdc(c-red):h Td(n):h C(c-white):h"><span>' + t.label_connection + "</span></a>") : $("#connection-user-" + e).html('<a data-id="follow" data-userid="' + e + '" data-url="/profile/follow_user/" class="jsReputationConnection Bgc(c-blue) C(c-white) Bdrs(3px) Bd(borderSolidLightGrey) D(b) W(80px) Ta(c) Fz(12px) Px(12px) Py(5px) Trs(transitionAll)">' + t.word + "</span>") : 0 == t.result && showBottomToast(t.error_message, 1500)
            },
            error: function (t) {}
        }), !1
    }), $(document).on({
        mouseenter: function () {
            "" != $(this).data("current-userid") && $(this).text($(this).data("hover"))
        },
        mouseleave: function () {
            "" != $(this).data("current-userid") && $(this).text($(this).data("default"))
        }
    }, ".jsFollowingButton"), $(document).on("click", ".send-cendol", function (t) {
        t.preventDefault(), notice("Please wait...");
        var e = $(this).attr("href"),
            a = $(this).attr("data-postid");
        $.ajax({
            url: e,
            xhrFields: {
                withCredentials: !0
            }
        }).success(function (t) {
            var e = $.parseJSON(t);
            "TRUE" == e.flag ? e.message_return ? ($("#modal-container").modal("hide"), notice(e.message_return), e.sc && $(".sctoken").val(e.sc)) : ($("#modal-container").modal("show"), $("#modal-container .modal-content").html(e.table)) : ($("#floating_notice").hide(), $("#modal-container").modal("show"), $("#modal-container .modal-content").html(e.html), $("#modal-rep-form").attr("action", KASKUS_URL + "/give_reputation/" + a), reputationTrigger(), $(".reputation-con div.radio").click(function () {
                $("#modal-rep-radio-" + $(this).attr("data-value")).prop("checked", !0)
            }), $("#modal-rep-send").click(function () {
                var t = $("form#modal-rep-form").serializeArray();
                t.push({
                    name: "securitytoken",
                    value: $("#securitytoken").val()
                });
                var e = !1;
                for (i in t) "reputation" != t[i].name || "pos" != t[i].value && "neg" != t[i].value || (e = !0);
                if (!e) return alert("Please select the type of reputation you want to give"), !1;
                $.ajax({
                    url: $("#modal-rep-form").attr("action"),
                    type: "post",
                    data: t,
                    xhrFields: {
                        withCredentials: !0
                    }
                }).success(function (t) {
                    var e = $.parseJSON(t);
                    $("#modal-container").modal("hide"), notice(e.message_return.replace(".", ".<br />")), e.sc && $(".sctoken").val(e.sc)
                })
            }), $("#modal-container").modal("show"))
        })
    }), $(document).on("click", ".ipstat", function (t) {
        t.preventDefault(), notice("Please wait...");
        var e = $(this).attr("href");
        $.ajax({
            url: e,
            xhrFields: {
                withCredentials: !0
            }
        }).success(function (t) {
            $("#floating_notice").hide(), $("#modal-container").modal("show"), $("#modal-container .modal-content").html(t)
        })
    }), $(".ocr_revamp_btn").click(function () {
        if (val = $(this).attr("rating-value"), thread_id = $("#thread_id").length > 0 ? $("#thread_id").val() : $(this).attr("data-threadid"), user_id = $(this).attr("data-userid"), post_user_id = $(this).attr("data-post-userid"), null == val) return !1;
        if (val < 0 || val > 5) return notice("You submitted an invalid vote."), !1;
        var t = document.vote_submitted ? 0 : 2e3;
        document.vote_tid = setTimeout(function () {
            $.ajax({
                url: KASKUS_URL + "/threadrate",
                type: "post",
                data: {
                    thread_id: thread_id,
                    vote: val,
                    securitytoken: $("#securitytoken").val()
                },
                xhrFields: {
                    withCredentials: !0
                },
                dataType: "json"
            }).done(function (t) {
                if ($("#securitytoken").val(t.securitytoken), document.vote_submitted = !0, void 0 !== t.rate_error) $(".rating").removeClass("is-enabledVote"), showBottomToast(t.rate_error, 1500);
                else {
                    $(".ocr_revamp_btn").each(function (e) {
                        $(this).attr("data-threadid") == thread_id && ($(this).addClass("active"), $(this).parent().find(".like-btn-widget--count").html(t.rate_title.substring(0, t.rate_title.indexOf(" votes"))))
                    }), $(".rating").attr("class", "Fz(18px) Mb(1px) Mend(20px) D(f) jsTippy jsThreadRating ratingStar star" + Math.round(t.rate).toString()).attr("data-original-title", t.rate_title).attr("title", t.rate_title), $(".link_rating").html("");
                    for (var e = 5; e > 0; e--) Math.round(t.rate) >= e ? $(".link_rating").append('<i class="ocr_btn fa fa-star C(c-yellow-1) jsTippy Fx(flexZero) Mend(4px)"></i>') : $(".link_rating").append('<i class="ocr_btn fa fa-star C(c-grey) jsTippy Fx(flexZero) Mend(4px)"></i>');
                    dataLayer.push({
                        event: "trackEvent",
                        "eventDetails.category": "Star Rating",
                        "eventDetails.action": e,
                        "eventDetails.label": thread_id,
                        totalRate: "1",
                        userID: user_id,
                        author: post_user_id
                    }), showBottomToast(t.message, 1500)
                }
            })
        }, t), document.vote_submitted || showBottomToast("Memuat ...", 2e3)
    }), $(".ocr_btn").click(function () {
        if (val = $(this).attr("rating-value"), thread_id = $("#thread_id").length > 0 ? $("#thread_id").val() : $(this).attr("data-threadid"), null == val) return !1;
        if (val < 0 || val > 5) return notice("You submitted an invalid vote."), !1;
        var t = document.vote_submitted ? 0 : 2e3;
        document.vote_tid = setTimeout(function () {
            $.ajax({
                url: KASKUS_URL + "/threadrate",
                type: "post",
                data: {
                    thread_id: thread_id,
                    vote: val,
                    securitytoken: $("#securitytoken").val()
                },
                xhrFields: {
                    withCredentials: !0
                },
                dataType: "json"
            }).success(function (t) {
                if ($("#securitytoken").val(t.securitytoken), document.vote_submitted = !0, void 0 !== t.rate_error) notice(t.rate_error, 1500);
                else {
                    $(".ocr_btn").each(function (e) {
                        $(this).attr("data-threadid") == thread_id && ($(this).addClass("active"), $(this).parent().find(".like-btn-widget--count").html(t.rate_title.substring(0, t.rate_title.indexOf(" votes"))))
                    }), $(".tool_panel_rating").attr("class", "tool_panel_rating tools-panel rating star" + Math.round(t.rate).toString()).attr("data-original-title", t.rate_title).attr("title", t.rate_title), $(".link_rating").html("");
                    for (var e = 1; e <= 5; e++) Math.round(t.rate) >= e ? $(".link_rating").append('<i class="fa fa-star"></i>&nbsp;') : $(".link_rating").append('<i class="fa fa-star un"></i>&nbsp;');
                    notice(t.message, 1500)
                }
            })
        }, t), document.vote_submitted || ($("#notice_span").html('Submitting thread rating... (<a href="#" id="cancel_btn">cancel</a>)'), $("#floating_notice").show(), $("#cancel_btn").click(function (t) {
            t.preventDefault(), document.vote_tid && clearTimeout(document.vote_tid), notice("Submission cancelled", 500)
        }))
    }), 1 == $("#first_newpost").val()) && (null != $("#unread_post").attr("href") && (location.href = $("#unread_post").attr("href")));
    $("div.user-name, div.user-avatar").on("mouseover", function () {
        var t = $(this).attr("data-userid");
        "Loading..." != $(".uqv_" + t + ":first").html() || $(".uqv_" + t + ":first").hasClass("is-loading") || ($(".uqv_" + t + ":first").addClass("is-loading"), $.ajax({
            url: KASKUS_URL + "/misc/user_quickview/" + t,
            success: function (e) {
                $(".uqv_" + t).html(e), $(".uqv_" + t + ":first").removeClass("is-loading")
            }
        }))
    }), $("body").on("click", ".getNestedAD", function (t) {
        getNestedAscendingDescending(this, t)
    }), $("body").on("click", ".loadMoreAD", function (t) {
        getNestedAscendingDescending(this, t)
    }), $("body").on("click", ".loadMoreTopAD", function (t) {
        getNestedAscendingDescending(this, t)
    }), $("body").on("click", ".jsShowNestedTrigger", function (t) {
        trackShowNested(this)
    });
    $(".qr-section").on("keyup", ".autocomplete-mention", function (e) {
        var a = $(".autocomplete-mention").val();
        (a = a.trim()).length > 0 ? 13 === e.keyCode ? (clearTimeout(t), get_autocomplete_mention(a)) : (clearTimeout(t), t = setTimeout(function () {
            return get_autocomplete_mention(a), !1
        }, 1e3)) : ($(".mentionList").html(""), $(".autocomplete-mention").val(""))
    }), $(".qr-section").on("keydown", ".autocomplete-mention", function (t) {
        if (13 === t.keyCode) return t.preventDefault(), !1
    }), $(".qr-section").on("click", ".user-mention", function () {
        insertCaretPosition("[mention]" + $(this).find(".username-mention").text() + "[/mention]"), $(".jsButtonMention").click(), $(".mentionList").html(""), $(".autocomplete-mention").val("")
    })
}), $jQ(document).ready(function () {
    function t(t, a = null) {
        if (null === a) {
            $jQ(".jsCendol", t).toggleClass("is-cendol-animate"), $jQ(".is-up-vote", t).toggleClass("is-active");
            var s = t.parents(".c-reputation__list");
            s.find(".jsBata").addClass("is-bata").removeClass("is-bata-animate"), s.find(".is-down-vote").removeClass("is-active")
        } else {
            if (t.parents(".jsNestedItemContent").length > 0) {
                var i = t.attr("data-postid"),
                    o = $(".post" + i);
                $jQ.each(o, function (s, i) {
                    e(t = $jQ(i).find(".buttonCendol"), a)
                })
            } else e(t, a)
        }
    }

    function e(t, e) {
        t.toggleClass("is-active");
        var a = t.closest(".vote-wrapper");
        a.find(".buttonBata").removeClass("is-active"), a.find(".vote-value").html(e.upvote - e.downvote);
        var s = a.find(".buttonBata");
        s.hasClass("vote-post") || s.addClass("vote-post")
    }

    function a(t, e = null) {
        if (null === e) {
            $jQ(".jsBata", t).toggleClass("is-bata-animate"), $jQ(".is-down-vote", t).toggleClass("is-active");
            var a = t.parents(".c-reputation__list");
            a.find(".jsCendol").addClass("is-cendol").removeClass("is-cendol-animate"), a.find(".is-up-vote").removeClass("is-active")
        } else {
            if (t.parents(".jsNestedItemContent").length > 0) {
                var i = t.attr("data-postid"),
                    o = $(".post" + i);
                $jQ.each(o, function (a, i) {
                    s(t = $jQ(i).find(".buttonBata"), e)
                })
            } else s(t, e)
        }
    }

    function s(t, e) {
        t.toggleClass("is-active");
        var a = t.closest(".vote-wrapper");
        a.find(".buttonCendol").removeClass("is-active"), a.find(".vote-value").html(e.upvote - e.downvote), 1 == e.disable_bata && t.removeClass("vote-post")
    }

    function i(t, e = !0) {
        var a = __forum_id + " thread detail",
            s = __thread_id,
            i = "",
            o = t.attr("data-action"),
            r = t.closest(".vote-wrapper").find(".buttonCendol").hasClass("is-active"),
            n = t.closest(".vote-wrapper").find(".buttonBata").hasClass("is-active");
        0 !== t.find("span.is-active").length && (i = "un"), !e && t.hasClass("is-active") && (i = "un");
        var l = i + o,
            d = "" == i ? "1" : "-1";
        "cendol" == l || "uncendol" == l ? n && "cendol" == l ? dataLayer.push({
            event: "trackEvent",
            "eventDetails.category": a,
            "eventDetails.action": l,
            "eventDetails.label": s,
            totalCendol: "1",
            totalBata: "-1",
            userID: user_id,
            userIDHit: post_user_id,
            postId: post_id
        }) : dataLayer.push({
            event: "trackEvent",
            "eventDetails.category": a,
            "eventDetails.action": l,
            "eventDetails.label": s,
            totalCendol: d,
            userID: user_id,
            userIDHit: post_user_id,
            postId: post_id
        }) : "bata" != l && "unbata" != l || (r && "bata" == l ? dataLayer.push({
            event: "trackEvent",
            "eventDetails.category": a,
            "eventDetails.action": l,
            "eventDetails.label": s,
            totalCendol: "-1",
            totalBata: "1",
            userID: user_id,
            userIDHit: post_user_id,
            postId: post_id
        }) : dataLayer.push({
            event: "trackEvent",
            "eventDetails.category": a,
            "eventDetails.action": l,
            "eventDetails.label": s,
            totalBata: d,
            userID: user_id,
            userIDHit: post_user_id,
            postId: post_id
        }))
    }
    moveTo(), countCookie(), $jQ("body").on("submit", "#lapor-hansip-form", function (t) {
        t.preventDefault(), laporHansip(this)
    }), $jQ("#thread_post_list").on("focus", ".reply-post", function () {
        createNestedReplyForm(this)
    }), $jQ("#thread_post_list").on("focus", ".qr-message", function () {
        createQuickReplyForm(this)
    }), $jQ("#thread_post_list").on("click", ".buttonReply", function () {
        moveReplyForm(this)
    }), $jQ("#thread_post_list").on("submit", "form.form-reply-message", function (t) {
        if (QR_NESTED_ACTION) {
            if (USE_CAPTCHA) return;
            t.preventDefault(), replyFromNested($jQ(this)), QR_NESTED_ACTION = !1
        }
    }), $jQ("#thread_post_list").on("click", ".checkbox", function (t) {
        switchCheckbox(this, t)
    }), $jQ("#thread_post_list").on("click", ".buttonMultiquote", function (t) {
        countCookie()
    }), $jQ("#load-more-postlist").click(function (t) {
        fetch_more_post()
    }), $jQ("#thread_post_list").on("click", ".vote-post", function (e) {
        var s = $jQ(this);
        return post_id = s.attr("data-postid"), user_id = s.attr("data-userid"), post_user_id = s.attr("data-postuserid"), status = s.attr("data-status-vote"), security_token = $jQ("#securitytoken").val(), $jQ.ajax({
            url: KASKUS_URL + "/give_vote/" + post_id,
            type: "POST",
            data: {
                status: status,
                securitytoken: security_token
            },
            xhrFields: {
                withCredentials: !0
            },
            success: function (e) {
                if ("object" != typeof e && (e = $jQ.parseJSON(e)), $jQ(".sctoken").val(e.securitytoken), 1 == e.result && 1 == e.is_old_theme) {
                    i(s), 1 == status ? t(s) : a(s), vote_id = "#total-vote-" + post_id, $jQ(vote_id).attr("data-original-title", "Total Vote : " + e.total_vote);
                    var o = $jQ(vote_id + " span").html();
                    o.indexOf("K") < 0 && o.indexOf("M") < 0 && $jQ(vote_id + " span").text(e.total_vote)
                } else 1 == e.result ? (i(s, e.is_old_theme), 1 == status ? t(s, e) : a(s, e), function (t, e) {
                    var a = $("#who-give-cendol-wrapper-" + e);
                    t.disable_bata || (a.find(".whoCendolAjax").remove(), a.prepend(t.view));
                    var s = t.upvote + t.downvote > 0;
                    (s || a.find("time").length > 0) && (a.removeClass("D(n)"), a.addClass("D(f)"));
                    s || 0 != a.find("time").length || (a.removeClass("D(f)"), a.addClass("D(n)"))
                }(e, post_id), showBottomToast(e.message, 2e3), reFireLazyLoadAndtooltip()) : IS_OLD_THEME ? notice(e.message_return) : showBottomToast(e.message_return, 2e3)
            },
            error: function (t) {}
        }), !1
    }), $jQ("#thread_post_list").on("click", ".subscribe-post", function (t) {
        var e = $jQ(this),
            a = e.attr("data-postid"),
            s = $jQ("#securitytoken").val(),
            i = __thread_id;
        return $jQ.ajax({
            url: KASKUS_URL + "/myforum/subscribe_post",
            type: "POST",
            data: {
                post_id: a,
                thread_id: i,
                securitytoken: s
            },
            xhrFields: {
                withCredentials: !0
            },
            success: function (t) {
                if ("object" != typeof t && (t = $jQ.parseJSON(t)), $jQ(".sctoken").val(t.securitytoken), 1 == t.result) {
                    e.removeClass("subscribe-post"), e.addClass("unsubscribe-post"), e.find("span").text(t.unsubscribe_wording), showBottomToast(t.message_return, 2e3);
                    var a = __forum_id + "thread detail",
                        s = i;
                    _gaq.push(["_trackEvent", a, "subscribe post", s]), dataLayer.push({
                        event: "trackEvent",
                        "eventDetails.category": a,
                        "eventDetails.action": "subscribe post",
                        "eventDetails.label": s
                    })
                } else null == t.message_return ? showBottomToast(t.error, 2e3) : showBottomToast(t.message_return, 2e3)
            },
            error: function (t) {}
        }), !1
    }), $jQ("#thread_post_list").on("click", ".unsubscribe-post", function (t) {
        var e = $jQ(this),
            a = e.attr("data-postid"),
            s = $jQ("#securitytoken").val(),
            i = __thread_id;
        return $jQ.ajax({
            url: KASKUS_URL + "/myforum/unsubscribe_post",
            type: "POST",
            data: {
                post_id: a,
                thread_id: i,
                securitytoken: s
            },
            xhrFields: {
                withCredentials: !0
            },
            success: function (t) {
                if ("object" != typeof t && (t = $jQ.parseJSON(t)), $jQ(".sctoken").val(t.securitytoken), 1 == t.result) {
                    e.removeClass("unsubscribe-post"), e.addClass("subscribe-post"), e.find("span").text(t.subscribe_wording), showBottomToast(t.message_return, 2e3);
                    var a = __forum_id + "thread detail",
                        s = i;
                    _gaq.push(["_trackEvent", a, "unsubscribe post", s]), dataLayer.push({
                        event: "trackEvent",
                        "eventDetails.category": a,
                        "eventDetails.action": "unsubscribe post",
                        "eventDetails.label": s
                    })
                } else showBottomToast(t.message_return, 2e3)
            },
            error: function (t) {}
        }), !1
    }), $jQ(".poll-swap-result").click(function () {
        $("#polling-form").addClass("hide"), $("#polling-result").removeClass("hide")
    }), $jQ(".poll-swap-back").click(function () {
        $("#polling-form").removeClass("hide"), $("#polling-result").addClass("hide")
    }), $jQ("#thread_post_list").on("click", ".lapor-hansip", function (t) {
        var e = $(this).attr("data-reported-id"),
            a = $(this).attr("data-reported-type"),
            s = $("#lapor-hansip-form"),
            i = s.find("input[name=reportedtype]");
        i.length > 0 ? i.val(a) : s.append('<input type="hidden" value="' + a + '" name="reportedtype">'), s.find("input[name=reportedid]").val(e)
    }), $("#thread_post_list").on("click", ".jsFetchPostSubscribe", function () {
        if ("undefined" != typeof postSubscribeFetch) {
            postIdToBeFetch = [];
            for (let t = 0; t < postSubscribeFetch.length; t++) $(".subscribe-post[data-postid='" + postSubscribeFetch[t] + "']").length > 0 && postIdToBeFetch.push(postSubscribeFetch[t]);
            0 !== postIdToBeFetch.length && $.ajax({
                url: "/misc/fetch_post_subscription_data",
                method: "POST",
                data: {
                    post_ids: postIdToBeFetch
                },
                xhrFields: {
                    withCredentials: !0
                },
                success: function (t) {
                    if ("object" != typeof t && (response = $.parseJSON(t)), 1 == response.result) {
                        $(".subscribe-post").removeClass("D(n)");
                        for (let t = 0; t < response.post_ids.length; t++) {
                            let e = $(".subscribe-post[data-postid='" + response.post_ids[t] + "']");
                            e.toggleClass("subscribe-post"), e.addClass("unsubscribe-post"), e.find("span").text("Matikan Notifikasi")
                        }
                    }
                    postSubscribeFetch = []
                }
            })
        }
    })
}), $(document).ready(function () {
    function t(t) {
        var e = t.children;
        return insertCaretPosition($(e).attr("data-src") + " "), $(e).attr("data-src")
    }
    $(".jsSmilies").on("click", ".giphy-smilie li a", function () {
        t(this)
    }), $(".jsSmilies").on("click", ".normal-smilie li a", function () {
        save_smiley_localStorage(t(this));
        var e = $(this.children).attr("title");
        smilie_tracking("smiley", $(".tabNavItem.is-active .tabNavIcon").attr("data-title"), e)
    })
}), $(document).ready(function () {
    $(".embed_twitter").kslzy(300, "fetch_twitter"), $(".embed_instagram").kslzy(300, "fetch_instagram"), bindPostListNext()
});
var postListLoading = !1;

function bindPostListNext() {
    $("#load-more-postlist").length > 0 && (window.addEventListener("resize", fetch_more_post, {
        passive: !0
    }), window.addEventListener("scroll", fetch_more_post, {
        passive: !0
    }), window.addEventListener("touch", fetch_more_post, {
        passive: !0
    }), window.addEventListener("click", fetch_more_post, {
        passive: !0
    }))
}

function removePostListAutoload() {
    window.removeEventListener("resize", fetch_more_post), window.removeEventListener("scroll", fetch_more_post), window.removeEventListener("touch", fetch_more_post), window.removeEventListener("click", fetch_more_post), $("#load-more-postlist").hide()
}

function fetch_more_post() {
    var t = $jQ("#load-more-postlist");
    if (!postListLoading && isElementInViewport(t)) {
        postListLoading = !0, showBottomToast("Mengambil Data", 2e3), t.hide();
        var e = t.attr("data-offset");
        $jQ.ajax({
            url: "/thread/get_post_list/" + __thread_id + "/" + e,
            method: "GET",
            xhrFields: {
                withCredentials: !0
            },
            success: function (a) {
                "object" != typeof a && (a = $jQ.parseJSON(a)), $jQ("#load-more").before(a.view), "undefined" != typeof postSubscribeFetch && (postSubscribeFetch = postSubscribeFetch.concat(a.post_ids)), reFireLazyLoadAndtooltip(), LAST_ID = a.last_id, t.attr("data-offset", +e + +ROOT_POST_LIMIT), 0 == a.last_load && t.show(), 0 == a.total_post && (showBottomToast("No more data.", 2e3), removePostListAutoload()), postListLoading = !1
            }
        })
    }
}

function insertCaretPosition(t) {
    var e = jQuery("#jsReplyTextArea"),
        a = e.val(),
        s = e[0].selectionStart,
        i = e[0].selectionEnd;
    $("#jsReplyTextArea").val(a.substring(0, s) + t + a.substring(i, a.length)), e.focus(), e[0].selectionStart = s + t.length, e[0].selectionEnd = s + t.length
}